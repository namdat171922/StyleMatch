# UniBooking - API Design

## Base URL
```
https://appointment-hub-754.preview.emergentagent.com/api/v1
```

## Authentication

All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message (optional)"
}
```

### Error Response
```json
{
  "error": "Error message",
  "detail": "Detailed error information (optional)",
  "code": "ERROR_CODE"
}
```

### Paginated Response
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

---

## 1. Authentication Endpoints

### POST /api/v1/auth/register
Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+65 9123 4567",
  "role": "customer"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "customer",
    "email_verified": false
  },
  "message": "Registration successful. Please check your email to verify your account."
}
```

### POST /api/v1/auth/login
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "customer"
    }
  }
}
```

### POST /api/v1/auth/google
Login or register with Google OAuth.

**Request Body**:
```json
{
  "token": "google_oauth_token"
}
```

**Response**: Same as login

### POST /api/v1/auth/refresh
Refresh access token.

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**: Same as login

### POST /api/v1/auth/verify-email
Verify email address.

**Request Body**:
```json
{
  "token": "verification_token"
}
```

### POST /api/v1/auth/forgot-password
Request password reset.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

### POST /api/v1/auth/reset-password
Reset password with token.

**Request Body**:
```json
{
  "token": "reset_token",
  "new_password": "NewSecurePass123!"
}
```

### GET /api/v1/auth/me
Get current user profile. **[Auth Required]**

**Response**:
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "+65 9123 4567",
    "role": "customer",
    "avatar_url": "https://...",
    "email_verified": true,
    "created_at": "2026-01-14T10:00:00Z"
  }
}
```

---

## 2. Business Endpoints

### GET /api/v1/businesses
Search and list businesses.

**Query Parameters**:
- `query` (string): Search term
- `category` (string): hair_salon, barbershop, nail_salon, spa, tattoo, beauty_clinic
- `lat` (float): User latitude
- `lng` (float): User longitude
- `radius` (float): Search radius in km (default: 10)
- `min_rating` (float): Minimum rating (1-5)
- `max_price` (float): Maximum service price
- `open_now` (boolean): Only show businesses open now
- `available_today` (boolean): Only show businesses with availability today
- `sort` (string): distance, rating, price_low, price_high, newest
- `page` (int): Page number (default: 1)
- `per_page` (int): Results per page (default: 20)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Elegant Hair Salon",
      "slug": "elegant-hair-salon",
      "category": "hair_salon",
      "cover_image_url": "https://...",
      "address": "123 Orchard Road",
      "city": "Singapore",
      "latitude": 1.3048,
      "longitude": 103.8318,
      "average_rating": 4.8,
      "total_reviews": 156,
      "distance_km": 2.3,
      "price_range": "$$",
      "is_open_now": true
    }
  ],
  "pagination": { ... }
}
```

### GET /api/v1/businesses/{business_id}
Get business details.

**Response**:
```json
{
  "data": {
    "id": "uuid",
    "name": "Elegant Hair Salon",
    "slug": "elegant-hair-salon",
    "description": "Premium hair salon with experienced stylists...",
    "category": "hair_salon",
    "cover_image_url": "https://...",
    "gallery": [
      {"id": "uuid", "url": "https://...", "caption": "Our salon"}
    ],
    "address": "123 Orchard Road, #02-34",
    "city": "Singapore",
    "postal_code": "238858",
    "latitude": 1.3048,
    "longitude": 103.8318,
    "phone": "+65 6123 4567",
    "email": "info@eleganthair.com",
    "website": "https://eleganthair.com",
    "average_rating": 4.8,
    "total_reviews": 156,
    "total_bookings": 2340,
    "business_hours": [
      {"day_of_week": 1, "open_time": "09:00", "close_time": "20:00"}
    ],
    "services": [...],
    "staff": [...],
    "portfolio": [...],
    "created_at": "2025-06-10T10:00:00Z"
  }
}
```

### GET /api/v1/businesses/{business_id}/portfolio
Get business portfolio images.

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "image_url": "https://...",
      "caption": "Balayage highlight by Sarah",
      "tags": ["balayage", "blonde"],
      "staff_id": "uuid",
      "staff_name": "Sarah Lee",
      "created_at": "2026-01-10T10:00:00Z"
    }
  ]
}
```

### GET /api/v1/businesses/{business_id}/services
Get business services.

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Women's Haircut",
      "description": "Includes wash, cut, and blow dry",
      "duration_minutes": 60,
      "price": 80.00,
      "category": "Hair Services"
    }
  ]
}
```

### GET /api/v1/businesses/{business_id}/staff
Get business staff.

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Lee",
      "photo_url": "https://...",
      "bio": "10 years of experience in hair styling",
      "specialties": "Balayage, Color Correction",
      "services": ["uuid1", "uuid2"]
    }
  ]
}
```

### GET /api/v1/businesses/{business_id}/reviews
Get business reviews.

**Query Parameters**:
- `page` (int)
- `per_page` (int)
- `min_rating` (int): Filter by minimum rating

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Amazing service! Sarah did a great job.",
      "customer_name": "Emily T.",
      "customer_avatar": "https://...",
      "images": ["https://..."],
      "is_verified": true,
      "created_at": "2026-01-12T14:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### GET /api/v1/businesses/{business_id}/availability
Check staff/time availability for booking.

**Query Parameters**:
- `service_id` (uuid): Required
- `staff_id` (uuid): Optional
- `date` (date): YYYY-MM-DD

**Response**:
```json
{
  "data": {
    "date": "2026-01-20",
    "available_slots": [
      {
        "staff_id": "uuid",
        "staff_name": "Sarah Lee",
        "times": ["09:00", "10:00", "11:00", "14:00", "15:00"]
      }
    ]
  }
}
```

### POST /api/v1/businesses
Create a new business. **[Auth Required: business_owner]**

**Request Body**:
```json
{
  "name": "Elegant Hair Salon",
  "description": "Premium hair salon...",
  "category": "hair_salon",
  "address": "123 Orchard Road, #02-34",
  "city": "Singapore",
  "postal_code": "238858",
  "phone": "+65 6123 4567",
  "email": "info@eleganthair.com"
}
```

### PUT /api/v1/businesses/{business_id}
Update business details. **[Auth Required: owner]**

### POST /api/v1/businesses/{business_id}/images
Upload business images. **[Auth Required: owner]**

**Form Data**:
- `file`: Image file
- `type`: cover | gallery | logo

---

## 3. Appointment Endpoints

### POST /api/v1/appointments
Create a new appointment. **[Auth Required: customer]**

**Request Body**:
```json
{
  "business_id": "uuid",
  "service_id": "uuid",
  "staff_id": "uuid",
  "appointment_date": "2026-01-20",
  "start_time": "14:00",
  "customer_notes": "First time customer"
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "uuid",
    "business_name": "Elegant Hair Salon",
    "service_name": "Women's Haircut",
    "staff_name": "Sarah Lee",
    "appointment_date": "2026-01-20",
    "start_time": "14:00",
    "end_time": "15:00",
    "status": "pending",
    "created_at": "2026-01-14T10:00:00Z"
  },
  "message": "Appointment booked successfully!"
}
```

### GET /api/v1/appointments
Get user's appointments. **[Auth Required]**

**Query Parameters**:
- `status` (string): pending, confirmed, completed, cancelled
- `upcoming` (boolean): Only upcoming appointments
- `page` (int)
- `per_page` (int)

### GET /api/v1/appointments/{appointment_id}
Get appointment details. **[Auth Required]**

### PATCH /api/v1/appointments/{appointment_id}
Update appointment status. **[Auth Required]**

**Request Body**:
```json
{
  "status": "confirmed" | "cancelled" | "completed",
  "cancellation_reason": "string" // Required if status=cancelled
}
```

### DELETE /api/v1/appointments/{appointment_id}
Cancel appointment. **[Auth Required]**

---

## 4. Review Endpoints

### POST /api/v1/reviews
Submit a review. **[Auth Required: customer]**

**Request Body**:
```json
{
  "business_id": "uuid",
  "appointment_id": "uuid",
  "rating": 5,
  "comment": "Amazing service!"
}
```

### POST /api/v1/reviews/{review_id}/images
Upload review images. **[Auth Required]**

**Form Data**:
- `files`: Image files (max 5)

### PUT /api/v1/reviews/{review_id}
Update review. **[Auth Required: owner]**

### DELETE /api/v1/reviews/{review_id}
Delete review. **[Auth Required: owner or admin]**

---

## 5. Favorite Endpoints

### POST /api/v1/favorites
Add business to favorites. **[Auth Required: customer]**

**Request Body**:
```json
{
  "business_id": "uuid"
}
```

### GET /api/v1/favorites
Get user's favorite businesses. **[Auth Required: customer]**

### DELETE /api/v1/favorites/{business_id}
Remove from favorites. **[Auth Required: customer]**

---

## 6. Service Endpoints

### POST /api/v1/businesses/{business_id}/services
Add service. **[Auth Required: owner]**

**Request Body**:
```json
{
  "name": "Women's Haircut",
  "description": "Includes wash, cut, and blow dry",
  "duration_minutes": 60,
  "price": 80.00,
  "category": "Hair Services"
}
```

### PUT /api/v1/services/{service_id}
Update service. **[Auth Required: owner]**

### DELETE /api/v1/services/{service_id}
Delete service. **[Auth Required: owner]**

---

## 7. Staff Endpoints

### POST /api/v1/businesses/{business_id}/staff
Add staff member. **[Auth Required: owner]**

**Request Body**:
```json
{
  "name": "Sarah Lee",
  "bio": "10 years of experience",
  "specialties": "Balayage, Color Correction",
  "service_ids": ["uuid1", "uuid2"]
}
```

### PUT /api/v1/staff/{staff_id}
Update staff. **[Auth Required: owner]**

### DELETE /api/v1/staff/{staff_id}
Delete staff. **[Auth Required: owner]**

### POST /api/v1/staff/{staff_id}/photo
Upload staff photo. **[Auth Required: owner]**

---

## 8. Search Endpoints

### GET /api/v1/search
Unified search endpoint.

**Query Parameters**:
- `q` (string): Search query
- `type` (string): business | service | all
- `lat`, `lng`, `radius`: Location filters

**Response**:
```json
{
  "data": {
    "businesses": [...],
    "services": [...]
  }
}
```

---

## 9. Admin Endpoints

### GET /api/v1/admin/businesses/pending
Get pending business approvals. **[Auth Required: admin]**

### POST /api/v1/admin/businesses/{business_id}/approve
Approve business. **[Auth Required: admin]**

### POST /api/v1/admin/businesses/{business_id}/reject
Reject business. **[Auth Required: admin]**

### GET /api/v1/admin/users
List all users. **[Auth Required: admin]**

### PATCH /api/v1/admin/users/{user_id}
Update user status. **[Auth Required: admin]**

### GET /api/v1/admin/statistics
Get platform statistics. **[Auth Required: admin]**

**Response**:
```json
{
  "data": {
    "total_users": 10000,
    "total_businesses": 500,
    "total_appointments": 50000,
    "total_reviews": 8000,
    "pending_businesses": 12
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `INVALID_CREDENTIALS` | Invalid email/password |
| `EMAIL_EXISTS` | Email already registered |
| `BUSINESS_NOT_FOUND` | Business not found |
| `SLOT_NOT_AVAILABLE` | Time slot not available |
| `UNAUTHORIZED` | Insufficient permissions |
| `VALIDATION_ERROR` | Input validation failed |
| `RATE_LIMIT_EXCEEDED` | Too many requests |

---

**Document Version**: 1.0
**Last Updated**: 2026-01-14