# FixFlow REST API Documentation (v1)

Base URL: `http://127.0.0.1:8000/api/v1`

All authenticated endpoints require an `Authorization` header containing the JWT Bearer token:
```http
Authorization: Bearer <access_token>
```

---

## 🔐 1. Authentication Endpoints

### Login (Obtain JWT)
- **POST** `/auth/login/`
- **Request Body**:
  ```json
  {
    "email": "customer@fixflow.demo",
    "password": "CustomerPass123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "refresh": "eyJhbGciOi...",
    "access": "eyJhbGciOi...",
    "user": {
      "id": 2,
      "email": "customer@fixflow.demo",
      "role": "CUSTOMER",
      "first_name": "Sarah",
      "last_name": "Jenkins",
      "phone": "+1 (555) 234-5678",
      "avatar": null,
      "is_active": true
    }
  }
  ```

### Refresh JWT Token
- **POST** `/auth/token/refresh/`
- **Request Body**:
  ```json
  {
    "refresh": "eyJhbGciOi..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access": "eyJhbGciOi..."
  }
  ```

### Customer Self-Registration
- **POST** `/auth/register/customer/`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!",
    "first_name": "David",
    "last_name": "Miller",
    "phone": "+1 555-987-6543"
  }
  ```
- **Response (201 Created)**

### Provider Registration
- **POST** `/auth/register/provider/`
- **Request Body**:
  ```json
  {
    "email": "electric.pro@example.com",
    "password": "SecurePassword123!",
    "password_confirm": "SecurePassword123!",
    "first_name": "Thomas",
    "last_name": "Edison",
    "phone": "+1 555-456-7890",
    "business_name": "Edison Electrical Services",
    "category_id": 2,
    "experience_years": 8,
    "service_radius_km": 30,
    "hourly_rate": 90.00
  }
  ```
- **Response (201 Created)**: Creates provider account with `verification_status="PENDING"`.

---

## 🛠️ 2. Service Catalog Endpoints

### List Categories
- **GET** `/services/categories/`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "name": "Plumbing",
      "slug": "plumbing",
      "description": "Pipes, leak repairs, and unclogging",
      "icon": "Wrench",
      "services_count": 4
    }
  ]
  ```

### List Services (with Filtering)
- **GET** `/services/?category=1&search=leak&ordering=base_price`
- **Response (200 OK)**:
  ```json
  [
    {
      "id": 1,
      "category": 1,
      "category_name": "Plumbing",
      "category_slug": "plumbing",
      "name": "Emergency Pipe Leak Diagnosis & Repair",
      "description": "Rapid detection and resolution of ruptured copper pipes.",
      "base_price": "95.00",
      "pricing_type": "FIXED",
      "estimated_duration_minutes": 60,
      "is_active": true
    }
  ]
  ```

---

## 👷 3. Provider Endpoints

### Public Providers Directory
- **GET** `/provider/public/`
- **Response (200 OK)**: Returns all providers with `verification_status="APPROVED"`.

### Provider Profile & Schedule (Authenticated Provider)
- **GET** `/provider/me/`
- **GET** `/provider/me/working-hours/`
- **PUT** `/provider/me/working-hours/`
  ```json
  [
    {
      "day_of_week": 0,
      "start_time": "08:00:00",
      "end_time": "18:00:00",
      "slot_duration_minutes": 60,
      "is_active": true
    }
  ]
  ```
- **POST** `/provider/me/blackout-dates/`
  ```json
  {
    "date": "2026-11-26",
    "reason": "Thanksgiving Holiday"
  }
  ```

---

## 📅 4. Booking Endpoints (Core Transaction Engine)

### List Bookings (Role-Scoped)
- **GET** `/bookings/`
- *Customers* see their own bookings.
- *Providers* see incoming booking requests and scheduled appointments.
- *Admins* see global platform directory.

### Create New Booking (Customer)
- **POST** `/bookings/`
- **Request Body**:
  ```json
  {
    "provider_id": 1,
    "service_id": 1,
    "booking_date": "2026-11-15",
    "time_slot": "10:00 AM",
    "street_address": "742 Evergreen Terrace",
    "city": "Springfield",
    "state": "OR",
    "zip_code": "97477",
    "notes": "Back door entry, dogs in backyard will be put away.",
    "total_amount": 95.00
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `"Time slot '10:00 AM' on 2026-11-15 has already been reserved for this provider."`
  - `400 Bad Request`: `"The provider is unavailable on this date (scheduled blackout)."`
- **Response (201 Created)**: Booking created in `PENDING` status.

### Provider Booking Action
- **POST** `/bookings/<id>/action/`
- **Accept Booking**:
  ```json
  {
    "action": "ACCEPT"
  }
  ```
- **Reject Booking**:
  ```json
  {
    "action": "REJECT",
    "reason": "Schedule conflict with an emergency commercial repair."
  }
  ```
- **Start Job**:
  ```json
  {
    "action": "START"
  }
  ```
- **Complete Job**:
  ```json
  {
    "action": "COMPLETE"
  }
  ```

---

## 💳 5. Payment Endpoints

### Process Payment
- **POST** `/payments/process/`
- **Request Body**:
  ```json
  {
    "booking_id": 12,
    "payment_method": "CARD"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": 8,
    "booking": 12,
    "transaction_id": "TXN-8A9F1B2C3D",
    "amount": "95.00",
    "platform_fee": "9.50",
    "provider_payout": "85.50",
    "payment_method": "CARD",
    "status": "COMPLETED",
    "paid_at": "2026-11-05T12:00:00Z"
  }
  ```

---

## ⭐ 6. Reviews & Ratings

### Submit Verified Review
- **POST** `/reviews/`
- **Request Body**:
  ```json
  {
    "booking_id": 12,
    "rating": 5,
    "comment": "Prompt arrival, diagnosed leak under sink in 10 minutes, cleanly soldered pipe. 10/10!"
  }
  ```

---

## 🛡️ 7. Administration Endpoints

### Platform KPI Metrics
- **GET** `/administration/stats/`
- **Response (200 OK)**:
  ```json
  {
    "total_customers": 42,
    "total_providers": 18,
    "pending_verifications": 3,
    "total_bookings": 156,
    "active_bookings": 14,
    "completed_bookings": 128,
    "gross_volume": "18450.00",
    "platform_revenue": "1845.00"
  }
  ```

### Verify Provider
- **POST** `/administration/providers/<id>/verify/`
- **Request Body**:
  ```json
  {
    "status": "APPROVED",
    "notes": "Verified Master Plumber license #NY-PL-89241 and commercial liability insurance policy."
  }
  ```
