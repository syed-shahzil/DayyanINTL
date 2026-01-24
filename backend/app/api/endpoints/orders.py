from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.api import deps
from app.core.config import settings
from app.core.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate
from app.services import email

router = APIRouter()

@router.post("/", response_model=OrderResponse)
async def place_order(
    *,
    db: AsyncSession = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks
) -> Any:
    """
    Place a new order.
    """
    if not current_user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified")

    # Calculate totals and verify stock
    subtotal = 0
    order_items_data = [] # List of tuples (product, quantity)
    
    for item in order_in.items:
        result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalars().first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
            
        subtotal += product.price * item.quantity
        order_items_data.append((product, item.quantity))
        
    tax = subtotal * 0.1 # 10% tax assumption from frontend
    shipping_cost = 0 # Free shipping logic or fixed
    total_amount = subtotal + tax + shipping_cost
    
    # Create Order
    order = Order(
        user_id=current_user.id,
        status="pending",
        subtotal=subtotal,
        tax=tax,
        shipping_cost=shipping_cost,
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
        delivery_notes=order_in.delivery_notes
    )
    db.add(order)
    await db.flush() # Get ID
    
    # Create Items and Update Stock
    for product, quantity in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            price_at_purchase=product.price
        )
        db.add(order_item)
        
        # Update stock
        product.stock_quantity -= quantity
        db.add(product)
        
    await db.commit()
    await db.refresh(order)
    
    # Eager load for response
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product))
        .where(Order.id == order.id)
    )
    final_order = result.scalars().first()
    
    # Send Notification to Owner
    background_tasks.add_task(
        email.send_order_notification,
        settings.OWNER_EMAIL,
        str(final_order.id),
        float(final_order.total_amount)
    )
    
    return final_order

@router.get("/", response_model=List[OrderResponse])
async def read_my_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's orders.
    """
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()

@router.get("/all", response_model=List[OrderResponse])
async def read_all_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_manager),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get all orders (Manager/Owner only).
    """
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.patch("/{id}/status", response_model=OrderResponse)
async def update_order_status(
    *,
    db: AsyncSession = Depends(get_db),
    id: str,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Update order status.
    """
    result = await db.execute(select(Order).where(Order.id == id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    old_status = order.status
    order.status = status_update.status
    db.add(order)
    
    # Audit Log
    audit = AuditLog(
        actor_id=current_user.id,
        action="update_order_status",
        details=f"Order {id} status changed from {old_status} to {order.status}"
    )
    db.add(audit)
    
    await db.commit()
    await db.refresh(order)
    
    # Re-fetch for items
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == id)
    )
    return result.scalars().first()
