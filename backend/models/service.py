from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from config.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
