# UniBooking - Database Design

## Database: PostgreSQL

## Schema Design

### 1. users
Stores all user accounts (customers, business owners, staff, admins)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL for OAuth-only users
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'customer', -- customer, business_owner, staff, admin
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    google_id VARCHAR(255) UNIQUE, -- For Google OAuth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_role ON users(role);
```

### 2. businesses
Stores business/service provider information

```sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- hair_salon, barbershop, nail_salon, spa, tattoo, beauty_clinic
    cover_image_url TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Singapore',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX idx_businesses_approved ON businesses(is_approved, is_active);
```

### 3. business_hours
Stores operating hours for businesses

```sql
CREATE TABLE business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_hours_business ON business_hours(business_id);
CREATE UNIQUE INDEX idx_business_hours_unique ON business_hours(business_id, day_of_week);
```

### 4. business_images
Stores additional images for business galleries

```sql
CREATE TABLE business_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_images_business ON business_images(business_id);
```

### 5. staff
Stores staff members of businesses

```sql
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional link to user account
    name VARCHAR(255) NOT NULL,
    photo_url TEXT,
    bio TEXT,
    specialties TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_business ON staff(business_id);
CREATE INDEX idx_staff_user ON staff(user_id);
```

### 6. staff_schedules
Stores working schedules for staff

```sql
CREATE TABLE staff_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_schedules_staff ON staff_schedules(staff_id);
```

### 7. services
Stores services offered by businesses

```sql
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_services_active ON services(is_active);
```

### 8. staff_services
Many-to-many relationship between staff and services

```sql
CREATE TABLE staff_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, service_id)
);

CREATE INDEX idx_staff_services_staff ON staff_services(staff_id);
CREATE INDEX idx_staff_services_service ON staff_services(service_id);
```

### 9. portfolio_images
Stores portfolio images for businesses and staff

```sql
CREATE TABLE portfolio_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    tags TEXT[], -- PostgreSQL array for tags
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolio_business ON portfolio_images(business_id);
CREATE INDEX idx_portfolio_staff ON portfolio_images(staff_id);
```

### 10. appointments
Stores all booking appointments

```sql
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, confirmed, completed, cancelled, no_show
    customer_notes TEXT,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES users(id),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_business ON appointments(business_id);
CREATE INDEX idx_appointments_staff ON appointments(staff_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_datetime ON appointments(appointment_date, start_time);
```

### 11. reviews
Stores customer reviews for businesses

```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- True if reviewed after completed appointment
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(appointment_id) -- One review per appointment
);

CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
CREATE INDEX idx_reviews_verified ON reviews(is_verified);
CREATE INDEX idx_reviews_flagged ON reviews(is_flagged);
```

### 12. review_images
Stores images attached to reviews

```sql
CREATE TABLE review_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_review_images_review ON review_images(review_id);
```

### 13. favorites
Stores customer favorite businesses

```sql
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, business_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_business ON favorites(business_id);
```

### 14. notifications
Stores user notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- booking_confirmed, booking_cancelled, review_request, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Additional data as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
```

### 15. email_verifications
Stores email verification tokens

```sql
CREATE TABLE email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email_verifications_token ON email_verifications(token);
CREATE INDEX idx_email_verifications_user ON email_verifications(user_id);
```

### 16. password_resets
Stores password reset tokens

```sql
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_user ON password_resets(user_id);
```

## Entity Relationship Diagram (ERD)

```
users
  ├─> businesses (owner_id)
  ├─> staff (user_id)
  ├─> appointments (customer_id)
  ├─> reviews (customer_id)
  ├─> favorites (user_id)
  ├─> notifications (user_id)
  ├─> email_verifications (user_id)
  └─> password_resets (user_id)

businesses
  ├─> business_hours (business_id)
  ├─> business_images (business_id)
  ├─> staff (business_id)
  ├─> services (business_id)
  ├─> portfolio_images (business_id)
  ├─> appointments (business_id)
  ├─> reviews (business_id)
  └─> favorites (business_id)

staff
  ├─> staff_schedules (staff_id)
  ├─> staff_services (staff_id)
  ├─> portfolio_images (staff_id)
  └─> appointments (staff_id)

services
  ├─> staff_services (service_id)
  └─> appointments (service_id)

appointments
  └─> reviews (appointment_id)

reviews
  └─> review_images (review_id)
```

## Key Relationships

1. **One-to-Many**:
   - User → Businesses (owner)
   - Business → Staff
   - Business → Services
   - Business → Portfolio Images
   - Business → Appointments
   - Business → Reviews
   - User → Appointments (customer)
   - User → Reviews
   - Review → Review Images

2. **Many-to-Many**:
   - Staff ↔ Services (via staff_services)

3. **Self-Referencing**:
   - None in MVP

## Data Integrity Rules

1. **Cascading Deletes**:
   - Deleting a business deletes all related staff, services, appointments, reviews
   - Deleting a user deletes their appointments, reviews, favorites

2. **Soft Deletes** (via is_active flag):
   - Users
   - Businesses
   - Staff
   - Services

3. **Constraints**:
   - Email must be unique per user
   - Business slug must be unique
   - One review per appointment
   - One favorite per user-business pair
   - Rating must be 1-5

## Indexing Strategy

**Primary Indexes** (for frequent queries):
- User email lookups
- Business searches by category, location
- Appointment queries by date, customer, business, staff
- Review lookups by business

**Composite Indexes**:
- appointments(appointment_date, start_time) for time slot queries
- businesses(is_approved, is_active) for listing active businesses

## Migration Strategy

1. Create all tables with UUID primary keys
2. Set up foreign key constraints
3. Create indexes
4. Seed initial data:
   - Admin user
   - Sample categories
   - Sample businesses for testing

---

**Document Version**: 1.0
**Last Updated**: 2026-01-14