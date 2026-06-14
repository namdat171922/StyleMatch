from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
from config.database import Base

class PortfolioImage(Base):
    __tablename__ = "portfolio_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    staff_id = Column(UUID(as_uuid=True), ForeignKey("staff.id", ondelete="CASCADE"), nullable=True, index=True)
    image_url = Column(Text, nullable=False)
    caption = Column(Text, nullable=True)
    tags = Column(ARRAY(String), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
