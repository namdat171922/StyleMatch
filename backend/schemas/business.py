from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from decimal import Decimal

class BusinessCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    address: str
    city: str
    country: str = "Singapore"
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class BusinessResponse(BaseModel):
    id: UUID
    owner_id: UUID
    name: str
    slug: str
    description: Optional[str]
    category: str
    cover_image_url: Optional[str]
    address: str
    city: str
    country: str
    postal_code: Optional[str]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    is_approved: bool
    is_active: bool
    average_rating: Decimal
    total_reviews: int
    total_bookings: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class BusinessListResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    category: str
    cover_image_url: Optional[str]
    address: str
    city: str
    average_rating: Decimal
    total_reviews: int
    
    class Config:
        from_attributes = True
