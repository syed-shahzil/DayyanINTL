from sqlalchemy import Column, String, Integer, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
from datetime import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    
    # Status: pending, confirmed, shipped, delivered, cancelled
    status = Column(String(50), default="pending", nullable=False)
    
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax = Column(Numeric(10, 2), nullable=False)
    shipping_cost = Column(Numeric(10, 2), default=0)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    shipping_address = Column(Text, nullable=False)
    delivery_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    
    quantity = Column(Integer, nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
