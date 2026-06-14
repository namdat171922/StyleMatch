from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class PaginationParams(BaseModel):
    page: int = 1
    per_page: int = 20

class PaginationMeta(BaseModel):
    page: int
    per_page: int
    total: int
    total_pages: int

class PaginatedResponse(BaseModel):
    data: List
    pagination: PaginationMeta

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
