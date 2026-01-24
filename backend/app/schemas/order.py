from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class OrderItemSchema(BaseModel):
    product_id: str
    quantity: int

class OrderItemResponse(OrderItemSchema):
    id: str
    price_at_purchase: Decimal
    product_name: Optional[str] = None # Calculated or joined
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[OrderItemSchema]
    shipping_address: str
    delivery_notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: str
    status: str
    subtotal: Decimal
    tax: Decimal
    shipping_cost: Decimal
    total_amount: Decimal
    shipping_address: str
    delivery_notes: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse] = []
    
    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str
