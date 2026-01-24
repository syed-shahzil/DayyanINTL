from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import List

from app.api import deps
from app.core.database import get_db
from app.models.order import Order
from app.models.user import User
from app.models.product import Product
from app.schemas.order import OrderResponse

class DashboardStats(BaseModel):
    totalOrders: int
    totalRevenue: float
    totalProfit: float
    totalUsers: int
    totalProducts: int
    recentOrders: List[OrderResponse]

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_manager),
) -> Any:
    """
    Get dashboard statistics (Owner/Manager only).
    """
    # Orders Stats
    orders_result = await db.execute(select(Order))
    orders = orders_result.scalars().all()
    
    total_orders = len(orders)
    total_revenue = sum(o.total_amount for o in orders)
    
    # Simple profit calculation (Revenue - Cost). 
    # Assuming cost is 40% of subtotal as per frontend logic: (order.subtotal * 0.4)
    # This matches the frontend logic: const totalCost = orders.reduce((sum, order) => sum + (order.subtotal * 0.4), 0);
    total_cost = sum((o.subtotal * 0.4) for o in orders)
    total_profit = total_revenue - total_cost

    # Users Count
    users_result = await db.execute(select(func.count(User.id)))
    total_users = users_result.scalar() or 0
    
    # Products Count
    products_result = await db.execute(select(func.count(Product.id)))
    total_products = products_result.scalar() or 0
    
    # Recent Orders
    recent_orders_result = await db.execute(
        select(Order)
        .order_by(Order.created_at.desc())
        .limit(10)
    )
    recent_orders = recent_orders_result.scalars().all()
    
    return {
        "totalOrders": total_orders,
        "totalRevenue": total_revenue,
        "totalProfit": total_profit,
        "totalUsers": total_users,
        "totalProducts": total_products,
        "recentOrders": recent_orders
    }
