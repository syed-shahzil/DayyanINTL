from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from app.core.database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    
    # Roles: 'customer', 'management', 'owner'
    role = Column(String(50), default="customer", nullable=False)
    is_owner = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    verifications = relationship("EmailVerification", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    wishlist = relationship("WishlistItem", back_populates="user", cascade="all, delete-orphan")


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    code = Column(String(10), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="verifications")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    
    user = relationship("User", back_populates="wishlist")
    product = relationship("Product")
