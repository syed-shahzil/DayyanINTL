from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Numeric, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
from datetime import datetime

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    detailed_description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    sku = Column(String(100), unique=True, nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)
    
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=True)
    image_url = Column(String(1000), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Store JSON as text in SQL Server if JSON type issues arise, or use a specific dialect type if verified.
    # For compatibility, Text is safest for generic use, but we can assume parsing happens in Pydantic.
    specifications = Column(Text, nullable=True) 
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("Category", back_populates="products")
