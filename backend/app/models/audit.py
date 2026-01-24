from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from app.core.database import Base
import uuid
from datetime import datetime

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String(36), nullable=True) # User ID who performed the action
    action = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
