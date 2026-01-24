from datetime import timedelta, datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User, EmailVerification
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()

# Schema for JSON login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Schema for email verification
class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str

@router.post("/signup", response_model=UserResponse)
async def create_user(
    *,
    db: AsyncSession = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    # Check if user exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    # Create user
    # Check if this is the owner config
    role = "customer"
    is_owner = False
    if user_in.email == settings.OWNER_EMAIL:
        role = "owner"
        is_owner = True
        
    db_user = User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=role,
        is_owner=is_owner,
        is_verified=False 
    )
    db.add(db_user)
    await db.flush() # Flush to get ID
    
    # Generate Verification Code
    import random
    import string
    from datetime import datetime
    from app.models.user import EmailVerification
    from app.services import email
    
    code = ''.join(random.choices(string.digits, k=6))
    verification = EmailVerification(
        user_id=db_user.id,
        code=code,
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    db.add(verification)
    
    await db.commit()
    await db.refresh(db_user)
    
    # Send verification email
    # We do this in background in production, but synchronous here for simplicity or use BackgroundTasks
    # Using simple call for now.
    try:
        email.send_verification_email(db_user.email, code)
    except Exception:
        pass # Don't fail signup if email fails, though ideally should retry
    
    return db_user

@router.post("/login", response_model=Token)
async def login_access_token(
    login_data: LoginRequest,
    db: AsyncSession = Depends(deps.get_db)
) -> Any:
    """
    JSON login endpoint - accepts email and password as JSON.
    """
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalars().first()
    
    if not user or not security.verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, role=user.role, expires_delta=access_token_expires
    )
    refresh_token = security.create_refresh_token(
        user.id, role=user.role
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
    }

@router.post("/verify")
async def verify_email(
    *,
    db: AsyncSession = Depends(deps.get_db),
    verify_data: VerifyEmailRequest
) -> Any:
    """
    Verify user email with verification code.
    """
    # Find user
    result = await db.execute(select(User).where(User.email == verify_data.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.is_verified:
        return {"message": "Email already verified"}
    
    # Find verification code
    result = await db.execute(
        select(EmailVerification)
        .where(EmailVerification.user_id == user.id)
        .where(EmailVerification.code == verify_data.code)
        .where(EmailVerification.is_used == False)
    )
    verification = result.scalars().first()
    
    if not verification:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if verification.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Verification code has expired")
    
    # Mark as verified
    user.is_verified = True
    verification.is_used = True
    
    await db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/refresh", response_model=Token)
async def refresh_token(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Refresh access token using refresh token.
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        current_user.id, role=current_user.role, expires_delta=access_token_expires
    )
    refresh_token = security.create_refresh_token(
        current_user.id, role=current_user.role
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
    }
