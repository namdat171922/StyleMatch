# UniBooking - Backend Architecture

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0 with asyncpg
- **Authentication**: JWT (python-jose) + OAuth (authlib)
- **File Storage**: Cloudinary
- **Email**: Resend
- **Maps**: Google Maps API
- **Validation**: Pydantic v2
- **Password Hashing**: bcrypt

## Architecture Pattern: Layered Architecture

```
┌─────────────────────────────────────┐
│   Presentation Layer (API Routes)   │  ← FastAPI routers
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer (Services)   │  ← Business logic
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Domain Layer (Models & Schemas)   │  ← Entities & DTOs
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│ Infrastructure Layer (Repositories) │  ← Database access
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          PostgreSQL Database        │
└─────────────────────────────────────┘
```

## Folder Structure

```
/app/backend/
├── server.py                 # Main FastAPI application
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
├── alembic.ini              # Database migration config
├── config/
│   ├── __init__.py
│   ├── settings.py          # App configuration
│   └── database.py          # Database connection
├── models/                   # SQLAlchemy models (Domain Layer)
│   ├── __init__.py
│   ├── user.py
│   ├── business.py
│   ├── staff.py
│   ├── service.py
│   ├── appointment.py
│   ├── review.py
│   └── favorite.py
├── schemas/                  # Pydantic schemas (DTOs)
│   ├── __init__.py
│   ├── user.py
│   ├── business.py
│   ├── appointment.py
│   ├── review.py
│   └── common.py
├── repositories/             # Data access layer
│   ├── __init__.py
│   ├── base.py
│   ├── user_repository.py
│   ├── business_repository.py
│   ├── appointment_repository.py
│   └── review_repository.py
├── services/                 # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py
│   ├── business_service.py
│   ├── appointment_service.py
│   ├── review_service.py
│   ├── email_service.py
│   ├── storage_service.py
│   └── maps_service.py
├── api/                      # API routes (Presentation Layer)
│   ├── __init__.py
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── businesses.py
│   │   ├── appointments.py
│   │   ├── reviews.py
│   │   ├── favorites.py
│   │   ├── search.py
│   │   └── admin.py
├── core/                     # Core utilities
│   ├── __init__.py
│   ├── security.py          # JWT, password hashing
│   ├── dependencies.py      # FastAPI dependencies
│   ├── exceptions.py        # Custom exceptions
│   └── middleware.py        # Custom middleware
├── migrations/               # Alembic migrations
│   └── versions/
└── tests/                    # Unit and integration tests
    ├── __init__.py
    ├── test_auth.py
    ├── test_businesses.py
    └── test_appointments.py
```

## Layer Responsibilities

### 1. Presentation Layer (API Routes)
**Location**: `/api/v1/`
**Purpose**: Handle HTTP requests/responses

**Responsibilities**:
- Request validation (Pydantic)
- Response formatting
- Authentication/authorization checks
- Delegate to service layer

**Example** (`/api/v1/businesses.py`):
```python
@router.get("/businesses/{business_id}")
async def get_business(
    business_id: str,
    business_service: BusinessService = Depends(get_business_service)
):
    business = await business_service.get_business_by_id(business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business
```

### 2. Application Layer (Services)
**Location**: `/services/`
**Purpose**: Business logic and orchestration

**Responsibilities**:
- Implement business rules
- Coordinate between repositories
- Handle transactions
- Call external services (email, storage, maps)

**Example** (`/services/appointment_service.py`):
```python
class AppointmentService:
    async def create_appointment(self, appointment_data):
        # 1. Validate time slot availability
        is_available = await self.check_availability(...)
        if not is_available:
            raise SlotNotAvailableError()
        
        # 2. Create appointment
        appointment = await self.repo.create(appointment_data)
        
        # 3. Send confirmation email
        await self.email_service.send_booking_confirmation(...)
        
        # 4. Create notification
        await self.notification_service.create(...)
        
        return appointment
```

### 3. Domain Layer (Models & Schemas)
**Location**: `/models/` and `/schemas/`
**Purpose**: Define data structures

**Models** (SQLAlchemy ORM):
- Database table definitions
- Relationships
- Database-level validations

**Schemas** (Pydantic):
- API request/response shapes
- Data validation
- Serialization/deserialization

### 4. Infrastructure Layer (Repositories)
**Location**: `/repositories/`
**Purpose**: Database access abstraction

**Responsibilities**:
- CRUD operations
- Complex queries
- Transaction management
- Database-specific optimizations

**Example** (`/repositories/business_repository.py`):
```python
class BusinessRepository(BaseRepository):
    async def search_nearby(
        self, 
        latitude: float, 
        longitude: float, 
        radius_km: float
    ):
        # PostGIS query for geospatial search
        query = select(Business).where(
            func.ST_DWithin(
                func.ST_MakePoint(Business.longitude, Business.latitude),
                func.ST_MakePoint(longitude, latitude),
                radius_km * 1000
            )
        )
        result = await self.session.execute(query)
        return result.scalars().all()
```

## Dependency Injection

Using FastAPI's dependency injection system:

```python
# core/dependencies.py
async def get_db_session():
    async with async_session() as session:
        yield session

def get_business_repository(session: AsyncSession = Depends(get_db_session)):
    return BusinessRepository(session)

def get_business_service(
    repo: BusinessRepository = Depends(get_business_repository),
    storage: StorageService = Depends(get_storage_service)
):
    return BusinessService(repo, storage)
```

## Authentication & Authorization

### JWT Token Structure
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "role": "customer",
  "exp": 1234567890
}
```

### Token Management
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry, stored in httpOnly cookie
- **Token Blacklist**: Redis cache for logout (optional MVP feature)

### Authorization Middleware
```python
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await user_service.get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user

def require_role(required_role: str):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker
```

## Error Handling

### Custom Exceptions
```python
# core/exceptions.py
class BusinessNotFoundException(Exception):
    pass

class SlotNotAvailableException(Exception):
    pass

class UnauthorizedException(Exception):
    pass
```

### Global Exception Handler
```python
@app.exception_handler(BusinessNotFoundException)
async def business_not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Business not found"}
    )
```

## External Service Integration

### 1. Cloudinary (File Storage)
```python
# services/storage_service.py
class StorageService:
    def __init__(self):
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
            api_key=os.getenv("CLOUDINARY_API_KEY"),
            api_secret=os.getenv("CLOUDINARY_API_SECRET")
        )
    
    async def upload_image(self, file: UploadFile, folder: str) -> str:
        result = cloudinary.uploader.upload(
            file.file,
            folder=f"unibooking/{folder}",
            transformation=[
                {"width": 1200, "crop": "limit"},
                {"quality": "auto", "fetch_format": "auto"}
            ]
        )
        return result["secure_url"]
```

### 2. Resend (Email)
```python
# services/email_service.py
class EmailService:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
    
    async def send_booking_confirmation(self, to: str, appointment_data: dict):
        resend.api_key = self.api_key
        resend.Emails.send({
            "from": "noreply@unibooking.com",
            "to": to,
            "subject": "Booking Confirmation",
            "html": self._render_template("booking_confirmation.html", appointment_data)
        })
```

### 3. Google Maps (Geocoding & Places)
```python
# services/maps_service.py
class MapsService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        self.client = googlemaps.Client(key=self.api_key)
    
    async def geocode_address(self, address: str) -> tuple[float, float]:
        result = self.client.geocode(address)
        if result:
            location = result[0]["geometry"]["location"]
            return location["lat"], location["lng"]
        raise GeocodeException("Could not geocode address")
    
    async def search_nearby(self, lat: float, lng: float, radius: int, type: str):
        results = self.client.places_nearby(
            location=(lat, lng),
            radius=radius,
            type=type
        )
        return results["results"]
```

## Database Connection & Session Management

```python
# config/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True,
    pool_size=20,
    max_overflow=0
)

async_session = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
```

## API Versioning

All routes prefixed with `/api/v1/` to support future versioning:
```python
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_v1_router.include_router(business_router, prefix="/businesses", tags=["businesses"])
```

## Performance Optimizations

1. **Database Query Optimization**:
   - Use eager loading for relationships
   - Implement pagination for lists
   - Add appropriate indexes

2. **Caching** (Future):
   - Redis for session storage
   - Cache popular business listings
   - Cache geocoding results

3. **Async Operations**:
   - Use async/await throughout
   - Background tasks for emails

## Security Measures

1. **Input Validation**: Pydantic schemas
2. **SQL Injection**: SQLAlchemy parameterized queries
3. **XSS Protection**: Output encoding
4. **CORS**: Configured for frontend domain only
5. **Rate Limiting**: Slowapi middleware
6. **Password Security**: bcrypt with 12 rounds
7. **JWT Security**: RS256 algorithm (asymmetric)

## Logging & Monitoring

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response
```

## Testing Strategy

1. **Unit Tests**: Test services and repositories in isolation
2. **Integration Tests**: Test API endpoints
3. **Test Database**: Separate PostgreSQL instance
4. **Test Coverage**: Aim for 80%+ coverage

---

**Document Version**: 1.0
**Last Updated**: 2026-01-14