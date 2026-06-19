from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, timezone, date, time, timedelta
import logging
import os
import re
import bcrypt
import jwt
from bson import ObjectId

# Load environment variables first
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="StyleMatch API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get('FRONTEND_URL', '*')],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# JWT Settings
JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Helper Functions
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        user["_id"] = str(user["_id"])
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    phone: Optional[str] = None
    role: str = "customer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

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

class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int
    price: float
    category: Optional[str] = None

class AppointmentCreate(BaseModel):
    business_id: str
    service_id: str
    appointment_date: str
    start_time: str
    customer_notes: Optional[str] = None

# AUTH ROUTES
@api_router.post("/auth/register")
async def register(user_data: UserCreate, response: Response):
    try:
        # Check if email exists
        existing = await db.users.find_one({"email": user_data.email.lower()})
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user_doc = {
            "email": user_data.email.lower(),
            "password_hash": hash_password(user_data.password),
            "full_name": user_data.full_name,
            "phone": user_data.phone,
            "role": user_data.role,
            "avatar_url": None,
            "email_verified": False,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create tokens
        access_token = create_access_token(user_id, user_data.email)
        refresh_token = create_refresh_token(user_id)
        
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
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user_data.email,
                "full_name": user_data.full_name,
                "role": user_data.role
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login")
async def login(credentials: UserLogin, response: Response):
    try:
        user = await db.users.find_one({"email": credentials.email.lower()})
        
        if not user or not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not user.get("is_active", True):
            raise HTTPException(status_code=403, detail="Account is inactive")
        
        user_id = str(user["_id"])
        
        # Create tokens
        access_token = create_access_token(user_id, user["email"])
        refresh_token = create_refresh_token(user_id)
        
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
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return {
        "id": user["_id"],
        "email": user["email"],
        "full_name": user["full_name"],
        "role": user["role"],
        "email_verified": user.get("email_verified", False),
        "is_active": user.get("is_active", True)
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

# BUSINESS ROUTES
@api_router.get("/businesses")
async def list_businesses(category: Optional[str] = None, search: Optional[str] = None):
    try:
        query = {"is_approved": True, "is_active": True}
        
        if category:
            query["category"] = category
        
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        
        businesses = await db.businesses.find(query, {"_id": 0}).to_list(100)
        return businesses
    except Exception as e:
        logger.error(f"List businesses error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/businesses/{business_id}")
async def get_business(business_id: str):
    try:
        business = await db.businesses.find_one({"id": business_id}, {"_id": 0})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        return business
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get business error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/businesses")
async def create_business(business_data: BusinessCreate, request: Request):
    try:
        user = await get_current_user(request)
        
        # Generate unique slug
        base_slug = slugify(business_data.name)
        slug = base_slug
        counter = 1
        
        while await db.businesses.find_one({"slug": slug}):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        business_doc = {
            "id": str(ObjectId()),
            "owner_id": user["_id"],
            "name": business_data.name,
            "slug": slug,
            "description": business_data.description,
            "category": business_data.category,
            "address": business_data.address,
            "city": business_data.city,
            "country": business_data.country,
            "postal_code": business_data.postal_code,
            "phone": business_data.phone,
            "email": business_data.email,
            "website": business_data.website,
            "cover_image_url": None,
            "is_approved": True,
            "is_active": True,
            "average_rating": 0,
            "total_reviews": 0,
            "total_bookings": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.businesses.insert_one(business_doc)
        business_doc.pop("_id")
        return business_doc
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create business error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# SERVICE ROUTES
@api_router.get("/businesses/{business_id}/services")
async def list_services(business_id: str):
    try:
        services = await db.services.find(
            {"business_id": business_id, "is_active": True},
            {"_id": 0}
        ).to_list(100)
        return services
    except Exception as e:
        logger.error(f"List services error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/businesses/{business_id}/services")
async def create_service(business_id: str, service_data: ServiceCreate, request: Request):
    try:
        user = await get_current_user(request)
        
        business = await db.businesses.find_one({"id": business_id})
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        if business["owner_id"] != user["_id"] and user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        
        service_doc = {
            "id": str(ObjectId()),
            "business_id": business_id,
            "name": service_data.name,
            "description": service_data.description,
            "duration_minutes": service_data.duration_minutes,
            "price": service_data.price,
            "category": service_data.category,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.services.insert_one(service_doc)
        service_doc.pop("_id")
        return service_doc
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create service error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# APPOINTMENT ROUTES
@api_router.post("/appointments")
async def create_appointment(appointment_data: AppointmentCreate, request: Request):
    try:
        user = await get_current_user(request)
        
        service = await db.services.find_one({"id": appointment_data.service_id}, {"_id": 0})
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        # Calculate end time
        start_dt = datetime.fromisoformat(f"{appointment_data.appointment_date}T{appointment_data.start_time}")
        end_dt = start_dt + timedelta(minutes=service["duration_minutes"])
        
        appointment_doc = {
            "id": str(ObjectId()),
            "customer_id": user["_id"],
            "business_id": appointment_data.business_id,
            "service_id": appointment_data.service_id,
            "appointment_date": appointment_data.appointment_date,
            "start_time": appointment_data.start_time,
            "end_time": end_dt.strftime("%H:%M:%S"),
            "status": "confirmed",
            "customer_notes": appointment_data.customer_notes,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.appointments.insert_one(appointment_doc)
        appointment_doc.pop("_id")
        return appointment_doc
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create appointment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/appointments")
async def list_appointments(request: Request, upcoming: bool = True):
    try:
        user = await get_current_user(request)
        
        query = {"customer_id": user["_id"]}
        if upcoming:
            query["appointment_date"] = {"$gte": datetime.now().strftime("%Y-%m-%d")}
        
        appointments = await db.appointments.find(query, {"_id": 0}).to_list(100)
        return appointments
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"List appointments error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/appointments/{appointment_id}")
async def get_appointment(appointment_id: str, request: Request):
    try:
        user = await get_current_user(request)
        
        appointment = await db.appointments.find_one({"id": appointment_id}, {"_id": 0})
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        if appointment["customer_id"] != user["_id"] and user["role"] != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
        
        return appointment
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get appointment error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting StyleMatch API...")
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@stylematch.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "full_name": "Admin",
            "role": "admin",
            "email_verified": True,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    
    # Write credentials
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials for StyleMatch\n\n")
        f.write("## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write("- Role: admin\n")
    
    logger.info("StyleMatch API ready!")

@app.on_event("shutdown")
async def shutdown_event():
    client.close()

@app.get("/")
async def root():
    return {"message": "StyleMatch API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
