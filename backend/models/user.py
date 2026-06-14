from sqlalchemy import Column, String, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
import uuid
import enum
from config.database import Base

class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    BUSINESS_OWNER = "business_owner"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    avatar_url = Column(String, nullable=True)
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    google_id = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login_at = Column(DateTime(timezone=True), nullable=True)
