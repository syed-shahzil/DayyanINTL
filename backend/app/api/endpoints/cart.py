from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.core.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemResponse, CartItemUpdate

router = APIRouter()

@router.get("/", response_model=List[CartItemResponse])
async def read_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's cart.
    """
    result = await db.execute(
        select(CartItem)
        .options(selectinload(CartItem.product))
        .where(CartItem.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("/", response_model=CartItemResponse)
async def add_to_cart(
    *,
    db: AsyncSession = Depends(get_db),
    item_in: CartItemCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add item to cart or update quantity if exists.
    """
    # Check if item exists
    result = await db.execute(
        select(CartItem)
        .where(CartItem.user_id == current_user.id)
        .where(CartItem.product_id == item_in.product_id)
    )
    existing_item = result.scalars().first()
    
    if existing_item:
        existing_item.quantity += item_in.quantity
        db.add(existing_item)
        await db.commit()
        await db.refresh(existing_item)
        
        # Re-fetch for product
        result = await db.execute(
            select(CartItem)
            .options(selectinload(CartItem.product))
            .where(CartItem.id == existing_item.id)
        )
        return result.scalars().first()
        
    else:
        # Check product validity (optional but good)
        result = await db.execute(select(Product).where(Product.id == item_in.product_id))
        if not result.scalars().first():
             raise HTTPException(status_code=404, detail="Product not found")

        new_item = CartItem(
            user_id=current_user.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(new_item)
        await db.commit()
        await db.refresh(new_item)
        
        result = await db.execute(
            select(CartItem)
            .options(selectinload(CartItem.product))
            .where(CartItem.id == new_item.id)
        )
        return result.scalars().first()

@router.put("/{id}", response_model=CartItemResponse)
async def update_cart_item(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    item_in: CartItemUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update cart item quantity.
    """
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == id)
        .where(CartItem.user_id == current_user.id)
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item_in.quantity <= 0:
        await db.delete(item)
        await db.commit()
        return item # Return deleted item (id will be valid in response but deleted in DB)
        
    item.quantity = item_in.quantity
    db.add(item)
    await db.commit()
    await db.refresh(item)
    
    result = await db.execute(
        select(CartItem)
        .options(selectinload(CartItem.product))
        .where(CartItem.id == item.id)
    )
    return result.scalars().first()

@router.delete("/{id}")
async def remove_from_cart(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Remove item from cart.
    """
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == id)
        .where(CartItem.user_id == current_user.id)
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    await db.delete(item)
    await db.commit()
    return {"status": "success"}

@router.delete("/")
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Clear entire cart.
    """
    result = await db.execute(select(CartItem).where(CartItem.user_id == current_user.id))
    items = result.scalars().all()
    for item in items:
        await db.delete(item)
    await db.commit()
    return {"status": "success"}
