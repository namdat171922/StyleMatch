# UniBooking MVP - Product Requirements Document

## 1. Executive Summary

UniBooking is a service-booking marketplace connecting customers with service providers (salons, barbershops, spas, beauty clinics, tattoo studios). The platform emphasizes visual discovery, fast booking (<30s), and portfolio-driven decisions.

**Target Market**: Southeast Asia, University startup environments
**Differentiation**: Portfolio-first discovery + Map integration + Sub-30s booking

## 2. User Personas

### Persona 1: Sarah - The Beauty Enthusiast
- Age: 25-34
- Uses: Mobile-first
- Goal: Find stylists through portfolio work, not just reviews
- Pain Point: Can't preview actual work quality before booking
- Behavior: Books 2-3 times per month, willing to travel for quality

### Persona 2: David - The Busy Professional
- Age: 28-40
- Uses: Quick mobile bookings during commute
- Goal: Book haircut in under 1 minute
- Pain Point: Complex booking flows waste time
- Behavior: Needs same-day availability, values convenience

### Persona 3: Maria - Salon Owner
- Age: 30-45
- Uses: Tablet/Desktop for management
- Goal: Showcase work quality to attract premium clients
- Pain Point: Competitors look the same online
- Behavior: Posts portfolio weekly, responds to bookings within 1 hour

## 3. User Journeys

### Journey 1: First-Time Booking
1. Sarah discovers UniBooking through social media
2. Opens homepage → sees visually rich business grid + map
3. Clicks category "Hair Salon"
4. Browses portfolio images in grid view
5. Clicks salon with appealing work
6. Views full business profile + portfolio gallery
7. Sees staff profiles with their individual portfolios
8. Clicks "Book Now" → Selects Service → Staff → Time → Confirms
9. Receives confirmation email
10. Adds business to favorites

### Journey 2: Repeat Booking
1. David opens app → Already logged in
2. Searches "barber near me"
3. Filters by "Available Today" + "Open Now"
4. Recognizes favorite barber from map pins
5. Books in 20 seconds (Service → Time → Confirm)
6. Receives SMS confirmation

### Journey 3: Business Onboarding
1. Maria hears about UniBooking from peer
2. Registers business account
3. Fills business profile (name, description, location, hours)
4. Adds services with prices
5. Adds staff members
6. Uploads 10-15 portfolio images (before/after)
7. Profile goes live
8. Starts receiving bookings within 24 hours

## 4. MVP Features Breakdown

### 4.1 Customer Features (Priority 1)

**Authentication**
- Email/Password registration
- Email verification
- JWT token-based auth
- Google OAuth login
- Password reset flow
- Remember me

**Discovery & Search**
- Homepage with categories
- Search bar (business name, service type, location)
- Filters: Price range, Rating (4+ stars), Distance, Open now, Available today
- Sort: Distance, Rating, Price (low-high), Newest
- Map view with business pins
- Nearby businesses (geolocation)

**Business Profile Viewing**
- Cover image + gallery
- Business description
- Services list with prices
- Staff profiles with photos
- Portfolio gallery (masonry layout)
- Reviews with photos
- Location map
- Opening hours
- Contact info
- Favorite button

**Booking Flow (Max 4 Steps, <30s)**
- Step 1: Select Service (with duration + price)
- Step 2: Select Staff (optional: "Any Available")
- Step 3: Select Date & Time (calendar view, available slots only)
- Step 4: Confirm (review details, add notes)
- Booking confirmation page
- Email confirmation

**Booking Management**
- View upcoming bookings
- View past bookings
- Cancel booking (with cancellation policy)
- Rebook same service

**Favorites**
- Save favorite businesses
- Quick access to favorites
- Remove from favorites

**Reviews**
- Submit star rating (1-5)
- Write text review
- Upload photos (up to 5)
- Edit/delete own reviews
- Only verified bookings can review

### 4.2 Business Features (Priority 1)

**Business Registration & Profile**
- Register business account
- Business verification (manual admin approval)
- Edit business profile
- Upload cover image + gallery
- Set business hours
- Set location (address + coordinates)
- Add business description
- Add contact info

**Service Management**
- Add/edit/delete services
- Set service name, description, duration, price
- Categorize services
- Set service availability

**Staff Management**
- Add/edit/delete staff members
- Staff profile: name, photo, bio, specialties
- Assign services to staff
- Set staff working hours

**Portfolio Management**
- Upload portfolio images (before/after)
- Add captions/tags to images
- Organize into collections
- Delete images
- Bulk upload

**Appointment Management**
- View calendar of all appointments
- View appointment details
- Mark appointments as completed
- Cancel appointments (with reason)
- View no-show history

**Dashboard Analytics (Simple)**
- Total bookings this month
- Revenue estimate
- Top services
- Customer count
- Recent reviews

### 4.3 Admin Features (Priority 2)

**User Management**
- View all customers
- View customer details
- Suspend/activate accounts
- Search users

**Business Management**
- View pending business registrations
- Approve/reject businesses
- View all businesses
- Suspend/activate businesses
- Edit business details (if needed)

**Review Moderation**
- View all reviews
- Flag inappropriate reviews
- Delete reviews (with reason)
- View reported reviews

**Platform Statistics**
- Total users
- Total businesses
- Total bookings
- Revenue estimates
- Growth metrics

## 5. Key User Flows

### Flow 1: Search → Book (Target: <30 seconds)
```
Homepage → Search "nail salon" 
→ Apply filter "Available Today" 
→ Click business card 
→ Click "Book Now" 
→ Select "Gel Manicure" 
→ Select "Any Available" staff 
→ Select today 3:00 PM 
→ Confirm 
→ Done (22 seconds)
```

### Flow 2: Portfolio Discovery → Book
```
Homepage → Click "Tattoo" category 
→ Browse portfolio grid 
→ Click impressive tattoo image 
→ Opens business profile 
→ View artist's full portfolio 
→ Click "Book Consultation" 
→ Select artist 
→ Select date/time 
→ Confirm
```

### Flow 3: Business Setup
```
Register → Verify email 
→ Complete business profile 
→ Add 3 services 
→ Add 2 staff members 
→ Upload 12 portfolio images 
→ Submit for approval 
→ Wait for admin approval 
→ Profile goes live
```

## 6. Non-Functional Requirements

**Performance**
- Page load < 2 seconds
- Booking flow completion < 30 seconds
- Image optimization (WebP, lazy loading)
- API response time < 500ms (p95)

**Scalability**
- Support 10,000+ businesses
- Support 100,000+ users
- Handle 1,000 concurrent bookings

**Security**
- HTTPS everywhere
- JWT tokens with refresh
- Bcrypt password hashing
- Rate limiting on auth endpoints
- Input validation and sanitization
- CORS configuration
- SQL injection protection (use parameterized queries)
- XSS protection

**Usability**
- Mobile-first responsive design
- Touch-friendly (min 44x44px tap targets)
- Accessible (WCAG 2.1 AA)
- Clear error messages
- Loading states
- Offline state handling

**SEO**
- Meta tags for business profiles
- Open Graph tags
- Structured data (schema.org)
- Sitemap generation
- Canonical URLs

## 7. Out of Scope (Post-MVP)

- In-app messaging between customer and business
- Payment processing
- Subscription plans for businesses
- Mobile apps (Flutter)
- Advanced analytics
- Loyalty programs
- Gift cards
- Multi-location business support
- Waitlist functionality
- Service packages/combos
- Dynamic pricing
- AI-powered recommendations

## 8. Success Metrics

**Customer Engagement**
- Time to complete booking < 30 seconds (Target: 90% of bookings)
- Search-to-booking conversion rate > 15%
- Repeat booking rate > 40%

**Business Success**
- Average bookings per business > 20/month
- Portfolio upload rate > 80% of businesses
- Profile completion rate > 95%

**Platform Health**
- User retention (30-day) > 40%
- Business retention (30-day) > 60%
- Review submission rate > 30% of completed bookings

## 9. Technical Constraints

**Tech Stack (Adapted)**
- Frontend: React (with Next.js patterns) + TailwindCSS + Shadcn UI
- Backend: FastAPI (Python) + PostgreSQL
- File Storage: Cloudinary
- Email: Resend
- Maps: Google Maps API
- Hosting: Kubernetes (existing environment)

**API Design Principles**
- RESTful conventions
- Mobile-ready (efficient payloads)
- Versioned (/api/v1)
- Consistent error responses
- Pagination for lists
- CORS enabled

## 10. Design Principles

1. **Visual-First**: Images before text, portfolio before description
2. **Speed**: Every action should feel instant, booking < 30s
3. **Clarity**: No cognitive overload, clear CTAs
4. **Trust**: Reviews, photos, verified badges build confidence
5. **Mobile-First**: Design for thumb zones, optimize for small screens
6. **Premium**: High-quality imagery, generous spacing, refined typography
7. **Community**: Reviews and portfolios create social proof

## 11. Acceptance Criteria

### Customer Features
- [ ] User can register and login with email/password
- [ ] User can login with Google OAuth
- [ ] User can search and filter businesses
- [ ] Search results load in < 2 seconds
- [ ] User can view business profile with all details
- [ ] User can complete booking in < 30 seconds
- [ ] User can view booking history
- [ ] User can cancel upcoming booking
- [ ] User can save favorites
- [ ] User can submit review with photos

### Business Features
- [ ] Business can register and create profile
- [ ] Business can add/edit/delete services
- [ ] Business can add/edit/delete staff
- [ ] Business can upload portfolio images
- [ ] Business can view and manage appointments
- [ ] Business dashboard shows basic analytics

### Admin Features
- [ ] Admin can approve/reject business registrations
- [ ] Admin can view all users and businesses
- [ ] Admin can moderate reviews
- [ ] Admin can view platform statistics

### Technical
- [ ] All API endpoints have proper error handling
- [ ] All forms have validation
- [ ] Authentication works correctly with JWT
- [ ] Images are uploaded to Cloudinary
- [ ] Email notifications are sent via Resend
- [ ] Google Maps integration works
- [ ] Mobile responsive on all pages
- [ ] No console errors

## 12. Launch Checklist

- [ ] Seed database with sample businesses
- [ ] Create admin account
- [ ] Test complete booking flow
- [ ] Test all user roles
- [ ] Verify email sending
- [ ] Test map integration
- [ ] Security audit
- [ ] Performance testing
- [ ] Mobile testing (iOS + Android browsers)
- [ ] Cross-browser testing
- [ ] Create user documentation
- [ ] Set up monitoring

---

**Document Version**: 1.0
**Last Updated**: 2026-01-14
**Status**: Approved for Development