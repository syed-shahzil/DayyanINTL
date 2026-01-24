from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    price: Decimal
    sku: str
    stock_quantity: int
    image_url: Optional[str] = None
    is_active: bool = True
    category_id: Optional[str] = None
    specifications: Optional[str] = None # JSON string

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    detailed_description: Optional[str] = None
    price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    category_id: Optional[str] = None
    specifications: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    created_at: datetime
    category: Optional[CategoryResponse] = None
    
    class Config:
        from_attributes = True
