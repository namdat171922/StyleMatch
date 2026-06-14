from pydantic import BaseModel
from datetime import datetime, date, time
from typing import Optional
from uuid import UUID
from models.appointment import AppointmentStatus

class AppointmentCreate(BaseModel):
    business_id: UUID
    service_id: UUID
    appointment_date: date
    start_time: time
    customer_notes: Optional[str] = None

class AppointmentResponse(BaseModel):
    id: UUID
    customer_id: UUID
    business_id: UUID
    service_id: UUID
    appointment_date: date
    start_time: time
    end_time: time
    status: str
    customer_notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
