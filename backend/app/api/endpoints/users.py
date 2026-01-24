from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.api import deps
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_user_me(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.get("/", response_model=List[UserResponse])
async def read_users(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Retrieve users (Manager/Owner only).
    """
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()

@router.patch("/{user_id}/promote", response_model=UserResponse)
async def promote_user(
    *,
    db: AsyncSession = Depends(get_db),
    user_id: str,
    current_user: User = Depends(deps.get_current_active_superuser), # Only Owner can promote folks ideally, or Manager? Prompt says "Manager/Owner can Promote".
) -> Any:
    """
    Promote a user to Manager role.
    """
    # Check permissions logic more granularly if needed.
    # Prompt: "Manager Can assign manager role to other users".
    if current_user.role not in ["manager", "owner"]:
         raise HTTPException(status_code=400, detail="Not enough privileges")
         
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.role = "manager"
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
