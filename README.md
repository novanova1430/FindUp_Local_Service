# FixFlow – Local Service Booking & Management Platform

[![Framework](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Styling](https://img.shields.io/badge/CSS-Tailwind_CSS_v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Backend](https://img.shields.io/badge/Backend-Python_Django_5_+_DRF-092E20?style=flat&logo=django)](https://www.djangoproject.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

FixFlow is a production-grade, enterprise-ready full-stack local service marketplace connecting homeowners with verified local trade professionals (plumbers, electricians, HVAC technicians, house cleaners, carpenters).

The project is structured with a modern decoupled architecture:
1. **Interactive Frontend Web App (React 19 + TypeScript + Tailwind CSS)**:
   - Live interactive demo with local client persistence engine (`storageService.ts`), seed dataset, and 1-click Quick Role Switcher.
   - Decoupled `apiClient.ts` that seamlessly switches between the in-browser simulated engine and the live Django backend API at any configurable URL.
2. **Production Backend (`/backend/` - Python Django 5 + Django REST Framework + PostgreSQL)**:
   - Full RESTful API with atomic database locking, double-booking prevention, role-based access control (RBAC), JWT authentication, transaction accounting, and provider verification workflow.

---

## 🌟 Key Features by Role

### 1. Customer Experience
- **Service Discovery**: Multi-filter catalog with category tabs, search by name/description, sort by price and duration, and verified badges.
- **7-Step Booking Wizard**:
  - Step 1: Service Package Selection (base price & duration inspection)
  - Step 2: Verified Provider Selection (rating, experience, hourly rate)
  - Step 3: Date & Real-time Slot Picker (with double-booking slot validation)
  - Step 4: Service Address & Saved Address quick-selection
  - Step 5: Special Instructions & job notes
  - Step 6: Order Summary & Itemized Breakdown (service fee, platform fee)
  - Step 7: Secure Simulated Payment (Card, Instant UPI, Cash on Delivery)
- **Customer Hub**: Active bookings tracking (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`), cancellation, review submission with 1-5 star ratings, saved favorites, address manager, and notifications.

### 2. Service Provider Portal
- **Dashboard**: Real-time KPI counters (active jobs, total earnings, average rating, completion rate) and upcoming appointments.
- **Booking Requests**: Review incoming customer requests with atomic conflict checks before accepting or rejecting with reason.
- **Working Hours & Availability Engine**:
  - Weekly schedule configurator (Mon-Sun) with customizable slot duration (30/60/90 mins).
  - Blackout calendar for vacations, holidays, and sick days.
  - Quick availability toggle ("Available for new jobs" vs "Busy").
- **Financial Ledger**: Completed job payouts, itemized platform commission deduction (10%), and transaction history.
- **Service Offerings**: Create, edit, and price custom service packages.

### 3. Administrator Control Center
- **Executive Metrics**: Total registered customers, active providers, pending verifications, gross platform volume, and net commission revenue.
- **Provider Verification Pipeline**:
  - Detailed inspector for provider credential submissions (licenses, insurance, business registration).
  - Approve or Reject with documented reasons.
  - One-click provider suspension and reactivation.
- **Customer Moderation**: Account status toggles (Active vs Suspended) with audit logging.
- **Category & Global Service Management**: Create and reorganize trade categories with custom iconography.
- **Global Booking & Financial Ledger**: Master directory of all platform bookings with status filtering.
- **Review Moderation**: Hide or reinstate customer reviews.
- **CSV Data Export**: One-click reports for Bookings, Financials, and Provider Directory.
- **Platform Fee Configuration**: Real-time commission rate controls and live API client connection switch.

---

## 🏛️ System Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                 React 19 SPA (Vite + Tailwind CSS v4)                      |  |
|  |  +---------------------+  +----------------------+  +--------------------+  |  |
|  |  |   Customer Portal   |  |   Provider Portal    |  |  Admin Dashboard   |  |  |
|  |  +----------+----------+  +----------+-----------+  +---------+----------+  |  |
|  +-------------|------------------------|------------------------|-------------+  |
|                +------------------------+------------------------+                |
|                                         |                                         |
|                                v        v        v                                |
|                       +-----------------------------------+                       |
|                       |    apiClient.ts (Unified Layer)   |                       |
|                       +-----------------+-----------------+                       |
|                                         |                                         |
+-----------------------------------------|-----------------------------------------+
                                          |
                      +-------------------+-------------------+
                      |                                       |
        [Mode: In-Browser Demo]                     [Mode: Live Backend]
                      v                                       v
+------------------------------------+    +-----------------------------------------+
|     storageService.ts (Browser)    |    |      Django 5 + REST Framework (8000)   |
|  * localStorage engine             |    |  * SimpleJWT Auth Guard                 |
|  * Atomic slot validation          |    |  * apps.accounts / apps.bookings        |
|  * Event: fixflow_data_changed     |    |  * apps.providers / apps.services       |
|  * Realistic multi-user seed       |    |  * BookingService (select_for_update)   |
+------------------------------------+    +--------------------+--------------------+
                                                               |
                                                               v
                                                  +-------------------------+
                                                  |   PostgreSQL Database   |
                                                  |   * ACID Transactions   |
                                                  |   * Row-Level Locking   |
                                                  |   * Normalized Schema   |
                                                  +-------------------------+
```

---

## 🔑 Demo Access Credentials

The web application includes a 1-click **Quick Role Switcher** in the top navigation bar. You can also sign in manually with any of these pre-seeded accounts:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@fixflow.demo` | `AdminPass123!` | Full moderation, verifications, financial ledger & system settings |
| **Customer** | `customer@fixflow.demo` | `CustomerPass123!` | Active customer with previous bookings and saved addresses |
| **Provider (Approved)**| `provider@fixflow.demo` | `ProviderPass123!` | "Apex Pro Mechanical" with live bookings, earnings, and working schedule |
| **Provider (Pending)** | `samuel.green@example.com` | `ProviderPass123!` | "Green Leaf Landscaping" awaiting admin document verification |

---

## 📂 Project Directory Structure

```
├── backend/                        # Complete Python Django 5 REST backend
│   ├── config/                     # Django project configuration & settings
│   │   ├── __init__.py
│   │   ├── settings.py             # PostgreSQL, JWT, and CORS settings
│   │   ├── urls.py                 # Master /api/v1/ route declarations
│   │   └── wsgi.py
│   ├── apps/                       # Modular Django apps
│   │   ├── accounts/               # CustomUser model (email-based), JWT views
│   │   ├── customers/              # CustomerProfile & SavedAddress models
│   │   ├── providers/              # ProviderProfile, WorkingHours, BlackoutDate
│   │   ├── services/               # ServiceCategory & ServiceItem models
│   │   ├── bookings/               # Booking model & BookingService atomic locking
│   │   ├── payments/               # Payment transaction ledger
│   │   ├── reviews/                # Customer reviews & ratings
│   │   ├── notifications/          # Real-time user alert records
│   │   └── administration/         # Admin stats, verification & moderation views
│   ├── manage.py                   # Django CLI entry point
│   ├── requirements.txt            # Python dependencies (Django, djangorestframework, etc.)
│   ├── seed_data.py                # Database population script
│   └── .env.example                # Backend environment configuration
│
├── src/                            # Frontend React 19 application
│   ├── assets/images/              # High-fidelity service & provider photography
│   ├── components/                 # Reusable UI component library
│   │   ├── cards/                  # ServiceCard, ProviderCard, BookingCard
│   │   ├── common/                 # Badge, StatCard, EmptyState, Modal
│   │   ├── layout/                 # Navbar, Sidebar, Footer, DemoSwitcher, Layouts
│   │   └── modals/                 # PaymentModal, ReviewModal, BookingDetailsModal
│   ├── context/                    # AuthContext (role state) & ToastContext
│   ├── data/                       # mockData.ts (rich realistic multi-user initial seed)
│   ├── pages/                      # Page views organized by portal
│   │   ├── admin/                  # Dashboard, Providers, Customers, Categories, etc.
│   │   ├── auth/                   # Login, Customer/Provider Register, Forgot Password
│   │   ├── customer/               # Dashboard, 7-step BookingWizard, Bookings, Reviews
│   │   ├── provider/               # Dashboard, Requests, Bookings, Schedule, Earnings
│   │   └── public/                 # Home, Services directory, Provider directory
│   ├── routes/                     # ProtectedRoute & AppRoutes
│   ├── services/                   # storageService.ts & apiClient.ts
│   ├── types/                      # Comprehensive TypeScript interfaces
│   ├── App.tsx                     # Main application entry point
│   └── main.tsx                    # React DOM root
│
├── API_DOCUMENTATION.md            # Complete RESTful API endpoint reference
├── DATABASE_SCHEMA.md              # Relational schema ER & constraints reference
├── SETUP_GUIDE.md                  # Local development setup guide (PostgreSQL + React)
├── TESTING_GUIDE.md                # Testing scenarios and commands
└── POSTMAN_COLLECTION.json         # Ready-to-import Postman API collection
```

---

## ⚡ Quick Start (Local Development)

### Frontend (React + Vite)
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
# App will run at http://localhost:3000
```

### Backend (Django + PostgreSQL)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Copy .env.example and configure PostgreSQL credentials
cp .env.example .env

# 5. Run migrations & seed demo data
python manage.py migrate
python manage.py shell < seed_data.py

# 6. Start Django development server
python manage.py runserver 8000
# API will run at http://127.0.0.1:8000/api/v1/
```

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed PostgreSQL installation instructions.
