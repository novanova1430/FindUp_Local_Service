# FixFlow Testing & Validation Guide

This guide covers testing strategies for both the **Django Backend** and the **React Frontend**, including automated unit testing and manual multi-role scenario validation.

---

## 🧪 1. Backend Automated Testing

### Running Django Unit Tests
Navigate to the `backend/` directory with your virtual environment activated:

```bash
cd backend
python manage.py test
```

To run test suites for specific apps:
```bash
# Test booking concurrency and double-booking prevention
python manage.py test apps.bookings

# Test accounts authentication and JWT token creation
python manage.py test apps.accounts
```

---

## 🔒 2. Critical Test Scenarios

### Scenario A: Double-Booking Prevention (Concurrency Lock)
- **Objective**: Verify that two customers cannot simultaneously book the same provider for the same date and time slot.
- **Automated Verification**:
  In `apps/bookings/services.py`, `BookingService.create_booking` wraps operations inside `@transaction.atomic` and invokes `.select_for_update()` on `Booking` records.
- **Manual Verification**:
  1. Log in as Customer `customer@fixflow.demo`.
  2. Book "Emergency Pipe Leak Diagnosis" with "Apex Pro Mechanical" on **tomorrow's date** at **10:00 AM**.
  3. Notice booking is successfully created in `PENDING` status.
  4. Now switch to a different customer account or use another tab/incognito window.
  5. Attempt to book the exact same provider, date, and 10:00 AM slot.
  6. **Expected Result**: The slot is disabled in the Booking Wizard UI. Attempting to submit via API yields HTTP 400: *"Time slot '10:00 AM' has already been reserved for this provider."*

### Scenario B: Provider Verification Pipeline
- **Objective**: Ensure unverified providers cannot accept public bookings until vetted by an Administrator.
- **Manual Verification**:
  1. Switch to Provider `samuel.green@example.com` (Status: `PENDING`).
  2. Notice the yellow banner: *"Your profile is currently under review by our administration team."*
  3. Switch to Administrator `admin@fixflow.demo`.
  4. Navigate to **Service Providers** in Admin sidebar.
  5. Locate Samuel Green and click **Review Application**.
  6. Inspect business credentials and click **Approve Provider**.
  7. Switch back to Samuel Green: notice the profile is now verified and active.

### Scenario C: Provider Acceptance & Conflict Resolution
- **Objective**: Provider receives booking request, inspects details, and approves it.
- **Manual Verification**:
  1. As a Customer, submit a booking request.
  2. Switch to Provider `provider@fixflow.demo`.
  3. Navigate to **Booking Requests** (notice live badge count).
  4. Click **Accept Booking**.
  5. Status updates to `CONFIRMED`.
  6. Customer receives a real-time notification in their notification drawer.

---

## ⚛️ 3. Frontend Lint & Build Testing

Run Vite typecheck and compilation:
```bash
npm run build
```

Run ESLint check:
```bash
npm run lint
```
Both commands must complete with 0 errors.
