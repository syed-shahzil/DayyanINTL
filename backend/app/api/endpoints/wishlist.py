from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Optional

from app.api import deps
from app.core.database import get_db
from app.models.user import WishlistItem, User
from app.models.product import Product
from app.schemas.product import ProductResponse

# Schemas
class WishlistItemCreate(BaseModel):
    product_id: str

class WishlistItemResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    product: Optional[ProductResponse] = None
    
    class Config:
        from_attributes = True

router = APIRouter()

@router.get("/", response_model=List[WishlistItemResponse])
async def read_wishlist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's wishlist.
    """
    result = await db.execute(
        select(WishlistItem)
        .options(selectinload(WishlistItem.product))
        .where(WishlistItem.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("/", response_model=WishlistItemResponse)
async def add_to_wishlist(
    *,
    db: AsyncSession = Depends(get_db),
    item_in: WishlistItemCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add item to wishlist.
    """
    # Check if already exists
    result = await db.execute(
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .where(WishlistItem.product_id == item_in.product_id)
    )
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Item already in wishlist")

    item = WishlistItem(
        user_id=current_user.id,
        product_id=item_in.product_id
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    
    # Re-fetch for product
    result = await db.execute(
        select(WishlistItem)
        .options(selectinload(WishlistItem.product))
        .where(WishlistItem.id == item.id)
    )
    return result.scalars().first()

@router.delete("/{product_id}")
async def remove_from_wishlist(
    *,
    db: AsyncSession = Depends(get_db),
    product_id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Remove item from wishlist by Product ID.
    """
    result = await db.execute(
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .where(WishlistItem.product_id == product_id)
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found from wishlist")
        
    await db.delete(item)
    await db.commit()
    return {"status": "success"}

@router.get("/check/{product_id}", response_model=bool)
async def check_wishlist_status(
    *,
    db: AsyncSession = Depends(get_db),
    product_id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Check if product is in wishlist.
    """
    result = await db.execute(
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .where(WishlistItem.product_id == product_id)
    )
    return result.scalars().first() is not None
