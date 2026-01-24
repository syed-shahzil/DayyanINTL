from typing import Optional
from pydantic import BaseModel
from app.schemas.product import ProductResponse

class CartItemBase(BaseModel):
    product_id: str
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(CartItemBase):
    id: str
    user_id: str
    product: Optional[ProductResponse] = None
    
    class Config:
        from_attributes = True
