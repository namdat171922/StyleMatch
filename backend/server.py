from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from datetime import datetime, timezone, date, time, timedelta
from typing import List, Optional
import logging
import os
import re
from uuid import UUID

# Load environment variables first
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import after loading env
from config.database import get_session, init_db, Base, engine
from config.settings import settings
from models.user import User, UserRole
from models.business import Business, BusinessHour
from models.service import Service
from models.appointment import Appointment, AppointmentStatus
from schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from schemas.business import BusinessCreate, BusinessUpdate, BusinessResponse, BusinessListResponse
from schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from schemas.appointment import AppointmentCreate, AppointmentResponse
from core.security import hash_password, verify_password, create_access_token, create_refresh_token
from core.dependencies import get_current_user, get_current_active_user, require_role
from core.exceptions import (
    BusinessNotFoundException,
    ServiceNotFoundException,
    AppointmentNotFoundException,
    EmailAlreadyExistsException
)

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="UniBooking API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL] if settings.CORS_ORIGINS != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
api_router = APIRouter(prefix="/api")

# --- Helper Functions ---

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

async def seed_admin(session: AsyncSession):
    """Seed admin user"""
    result = await session.execute(
        select(User).where(User.email == settings.ADMIN_EMAIL)
    )
    existing_admin = result.scalar_one_or_none()
    
    if not existing_admin:
        admin = User(
            email=settings.ADMIN_EMAIL,
            password_hash=hash_password(settings.ADMIN_PASSWORD),
            full_name="Admin",
            role=UserRole.ADMIN,
            email_verified=True,
            is_active=True
        )
        session.add(admin)
        await session.commit()
        logger.info(f"Admin user created: {settings.ADMIN_EMAIL}")
    else:
        # Update password if changed
        if not verify_password(settings.ADMIN_PASSWORD, existing_admin.password_hash):
            existing_admin.password_hash = hash_password(settings.ADMIN_PASSWORD)
            await session.commit()
            logger.info("Admin password updated")
    
    # Write test credentials
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials for UniBooking\n\n")
        f.write("## Admin Account\n")
        f.write(f"- Email: {settings.ADMIN_EMAIL}\n")
        f.write(f"- Password: {settings.ADMIN_PASSWORD}\n")
        f.write(f"- Role: admin\n\n")
        f.write("## API Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- GET /api/auth/me\n")
        f.write("- GET /api/businesses\n")
        f.write("- POST /api/businesses\n")
        f.write("- POST /api/appointments\n")

# --- AUTH ROUTES ---

@api_router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    """Register a new user"""
    # Check if email exists
    result = await session.execute(
        select(User).where(User.email == user_data.email.lower())
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    new_user = User(
        email=user_data.email.lower(),
        password_hash=hash_password(user_data.password),
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=user_data.role
    )
    
    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)
    
    # Create tokens
    access_token = create_access_token(str(new_user.id), new_user.email)
    refresh_token = create_refresh_token(str(new_user.id))
    
    # Set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(new_user)
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    """Login user"""
    result = await session.execute(
        select(User).where(User.email == credentials.email.lower())
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Update last login
    user.last_login_at = datetime.now(timezone.utc)
    await session.commit()
    
    # Create tokens
    access_token = create_access_token(str(user.id), user.email)
    refresh_token = create_refresh_token(str(user.id))
    
    # Set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user)
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserResponse.model_validate(current_user)

@api_router.post("/auth/logout")
async def logout(response: Response):
    """Logout user"""
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

# --- BUSINESS ROUTES ---

@api_router.get("/businesses", response_model=List[BusinessListResponse])
async def list_businesses(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_session)
):
    """List businesses with filters"""
    query = select(Business).where(
        and_(Business.is_approved == True, Business.is_active == True)
    )
    
    if category:
        query = query.where(Business.category == category)
    
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Business.name.ilike(search_term),
                Business.description.ilike(search_term)
            )
        )
    
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    businesses = result.scalars().all()
    
    return [BusinessListResponse.model_validate(b) for b in businesses]

@api_router.get("/businesses/{business_id}", response_model=BusinessResponse)
async def get_business(
    business_id: UUID,
    session: AsyncSession = Depends(get_session)
):
    """Get business details"""
    result = await session.execute(
        select(Business).where(Business.id == business_id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return BusinessResponse.model_validate(business)

@api_router.post("/businesses", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(
    business_data: BusinessCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a new business"""
    # Generate unique slug
    base_slug = slugify(business_data.name)
    slug = base_slug
    counter = 1
    
    while True:
        result = await session.execute(
            select(Business).where(Business.slug == slug)
        )
        if not result.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Create business
    new_business = Business(
        owner_id=current_user.id,
        name=business_data.name,
        slug=slug,
        description=business_data.description,
        category=business_data.category,
        address=business_data.address,
        city=business_data.city,
        country=business_data.country,
        postal_code=business_data.postal_code,
        phone=business_data.phone,
        email=business_data.email,
        website=business_data.website,
        is_approved=True  # Auto-approve for MVP
    )
    
    session.add(new_business)
    await session.commit()
    await session.refresh(new_business)
    
    return BusinessResponse.model_validate(new_business)

# --- SERVICE ROUTES ---

@api_router.get("/businesses/{business_id}/services", response_model=List[ServiceResponse])
async def list_services(
    business_id: UUID,
    session: AsyncSession = Depends(get_session)
):
    """List services for a business"""
    result = await session.execute(
        select(Service).where(
            and_(Service.business_id == business_id, Service.is_active == True)
        ).order_by(Service.display_order, Service.name)
    )
    services = result.scalars().all()
    return [ServiceResponse.model_validate(s) for s in services]

@api_router.post("/businesses/{business_id}/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    business_id: UUID,
    service_data: ServiceCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create a service for a business"""
    # Verify business ownership
    result = await session.execute(
        select(Business).where(Business.id == business_id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    if business.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_service = Service(
        business_id=business_id,
        name=service_data.name,
        description=service_data.description,
        duration_minutes=service_data.duration_minutes,
        price=service_data.price,
        category=service_data.category
    )
    
    session.add(new_service)
    await session.commit()
    await session.refresh(new_service)
    
    return ServiceResponse.model_validate(new_service)

# --- APPOINTMENT ROUTES ---

@api_router.post("/appointments", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Create an appointment"""
    # Verify service exists and get duration
    result = await session.execute(
        select(Service).where(Service.id == appointment_data.service_id)
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Calculate end time
    start_datetime = datetime.combine(appointment_data.appointment_date, appointment_data.start_time)
    end_datetime = start_datetime + timedelta(minutes=service.duration_minutes)
    end_time = end_datetime.time()
    
    # Create appointment
    new_appointment = Appointment(
        customer_id=current_user.id,
        business_id=appointment_data.business_id,
        service_id=appointment_data.service_id,
        appointment_date=appointment_data.appointment_date,
        start_time=appointment_data.start_time,
        end_time=end_time,
        status=AppointmentStatus.CONFIRMED,
        customer_notes=appointment_data.customer_notes
    )
    
    session.add(new_appointment)
    await session.commit()
    await session.refresh(new_appointment)
    
    return AppointmentResponse.model_validate(new_appointment)

@api_router.get("/appointments", response_model=List[AppointmentResponse])
async def list_appointments(
    upcoming: bool = True,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """List user's appointments"""
    query = select(Appointment).where(Appointment.customer_id == current_user.id)
    
    if upcoming:
        query = query.where(Appointment.appointment_date >= date.today())
    
    query = query.order_by(Appointment.appointment_date, Appointment.start_time)
    result = await session.execute(query)
    appointments = result.scalars().all()
    
    return [AppointmentResponse.model_validate(a) for a in appointments]

@api_router.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment(
    appointment_id: UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    """Get appointment details"""
    result = await session.execute(
        select(Appointment).where(Appointment.id == appointment_id)
    )
    appointment = result.scalar_one_or_none()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if appointment.customer_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return AppointmentResponse.model_validate(appointment)

# Include router
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and seed admin"""
    logger.info("Starting UniBooking API...")
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed admin
    async with async_session_maker() as session:
        await seed_admin(session)
    
    logger.info("Database initialized and admin seeded")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    await engine.dispose()
    logger.info("UniBooking API stopped")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "UniBooking API", "version": "1.0.0"}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# For async_session_maker
from config.database import async_session_maker
