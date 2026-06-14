from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID
from decimal import Decimal

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int
    price: Decimal
    category: Optional[str] = None

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: Optional[int] = None
    price: Optional[Decimal] = None
    category: Optional[str] = None
    is_active: Optional[bool] = None

class ServiceResponse(BaseModel):
    id: UUID
    business_id: UUID
    name: str
    description: Optional[str]
    duration_minutes: int
    price: Decimal
    category: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
