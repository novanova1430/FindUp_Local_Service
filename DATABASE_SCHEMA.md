# FixFlow Database Schema & Architecture Guide

This document details the PostgreSQL relational schema designed for **FixFlow**. The database enforces ACID guarantees, strict normalization (3NF), row-level concurrency locks (`SELECT FOR UPDATE`), and cascading referential integrity.

---

## 📊 Entity Relationship Diagram (Conceptual)

```
       +-----------------------+
       |   custom_user         |
       +-----------------------+
       | id (PK, UUID/Int)     |
       | email (Unique)        |
       | role (Enum)           |
       | password (Hashed)     |
       +-----------+-----------+
                   |
         +---------+---------+
         | (1:1)             | (1:1)
         v                   v
+-----------------+   +-------------------------+
| customer_profile|   |    provider_profile     |
+-----------------+   +-------------------------+
| id (PK)         |   | id (PK)                 |
| user_id (FK)    |   | user_id (FK)            |
| address_line    |   | category_id (FK)        |
| city, state, zip|   | verification_status     |
+--------+--------+   | hourly_rate, rating     |
         | (1:N)      +------------+------------+
         v                         | (1:N)
+-----------------+                |
| saved_address   |                +-------------------+--------------------+
+-----------------+                |                   |                    |
                                   v                   v                    v
                        +--------------------+  +---------------+  +--------------------+
                        |provider_work_hours |  |provider_black-|  |    service_item    |
                        +--------------------+  |   out_dates   |  +--------------------+
                        | provider_id (FK)   |  +---------------+  | id (PK)            |
                        | day_of_week        |                     | category_id (FK)   |
                        | start_time         |                     | provider_id (FK,opt|
                        | end_time           |                     | base_price         |
                        +--------------------+                     +---------+----------+
                                                                             |
                                      +--------------------------------------+
                                      |
                                      v
                             +------------------------+
                             |        booking         |
                             +------------------------+
                             | id (PK)                |
                             | customer_id (FK)       |
                             | provider_id (FK)       |
                             | service_id (FK)        |
                             | booking_date (Date)    |
                             | time_slot (Varchar)    |
                             | status (Enum)          |
                             | total_amount           |
                             | platform_fee           |
                             | provider_payout        |
                             +-----------+------------+
                                         |
                            +------------+------------+
                            | (1:1)                   | (1:1)
                            v                         v
                 +--------------------+     +--------------------+
                 |      payment       |     |       review       |
                 +--------------------+     +--------------------+
                 | id (PK)            |     | id (PK)            |
                 | booking_id (FK, uq)|     | booking_id (FK, uq)|
                 | transaction_id (uq)|     | customer_id (FK)   |
                 | amount, status     |     | provider_id (FK)   |
                 | payment_method     |     | rating (1-5), comm.|
                 +--------------------+     +--------------------+
```

---

## 🗄️ Detailed Table Specifications

### 1. `accounts_customuser`
Stores universal login credentials and base user identities.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Internal unique user ID |
| `email` | VarChar(255) | Unique, Not Null, Index | Case-insensitive login identifier |
| `password` | VarChar(128) | Not Null | PBKDF2 with SHA-256 password hash |
| `role` | VarChar(20) | Choices: `CUSTOMER`, `PROVIDER`, `ADMIN` | Role-based access control discriminator |
| `first_name` | VarChar(150) | Not Null, Default: `""` | User's given name |
| `last_name` | VarChar(150) | Not Null, Default: `""` | User's family name |
| `phone` | VarChar(20) | Nullable | Primary contact number |
| `avatar` | VarChar(255) | Nullable | File path to profile photo |
| `is_verified` | Boolean | Default: `False` (True for customers/admins) | Verification indicator |
| `is_active` | Boolean | Default: `True` | Used for account suspension |
| `date_joined` | Timestamp with TZ | Auto-set on creation | Account registration timestamp |

---

### 2. `customers_customerprofile`
Holds customer-specific metadata.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Unique customer profile ID |
| `user_id` | BigInt | OneToOneField(`accounts_customuser`), On Delete: CASCADE | Associated user account |
| `address_line` | VarChar(255) | Default: `""` | Default street address |
| `city` | VarChar(100) | Default: `"Metropolis"` | Service city |
| `state` | VarChar(100) | Default: `"NY"` | State / Province |
| `postal_code` | VarChar(20) | Default: `"10001"` | Postal code |
| `latitude` | Decimal(9,6) | Nullable | Geolocation latitude |
| `longitude` | Decimal(9,6) | Nullable | Geolocation longitude |

---

### 3. `providers_providerprofile`
Holds verified service provider business metadata and operational parameters.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Unique provider ID |
| `user_id` | BigInt | OneToOneField(`accounts_customuser`), On Delete: CASCADE | Associated user account |
| `business_name` | VarChar(200) | Not Null | Trade business name |
| `category_id` | BigInt | ForeignKey(`services_servicecategory`), On Delete: SET_NULL | Primary trade category |
| `bio` | Text | Default: `""` | Professional biography |
| `experience_years`| Integer | Unsigned, Default: 1 | Years in trade practice |
| `service_radius_km`| Integer | Unsigned, Default: 15 | Coverage radius from base |
| `hourly_rate` | Decimal(10,2) | Default: 50.00 | Standard hourly rate |
| `rating` | Decimal(3,2) | Default: 5.00 | Aggregate rating (1.00 - 5.00) |
| `total_reviews` | Integer | Unsigned, Default: 0 | Number of completed reviews |
| `completed_jobs`| Integer | Unsigned, Default: 0 | Number of successful bookings |
| `verification_status`| VarChar(20) | Choices: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED` | Platform verification status |
| `verification_notes`| Text | Default: `""` | Admin reason notes |
| `verified_at` | Timestamp | Nullable | Date approved by administrator |
| `document_url` | VarChar(500) | Default: `""` | Secure license / insurance document |
| `is_available` | Boolean | Default: `True` | Working availability toggle |

---

### 4. `services_servicecategory`
Defines available trade categories.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Category ID |
| `name` | VarChar(100) | Unique, Not Null | Category display name (e.g. Plumbing) |
| `slug` | SlugField(120) | Unique, Not Null | URL-safe identifier |
| `description` | Text | Default: `""` | Category description |
| `icon` | VarChar(50) | Default: `"Wrench"` | Lucide icon name |
| `order` | Integer | Default: 0 | Display priority ordering |
| `is_active` | Boolean | Default: `True` | Category visibility flag |

---

### 5. `services_serviceitem`
Specific service packages bookable by customers.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Service ID |
| `category_id` | BigInt | ForeignKey(`services_servicecategory`), On Delete: CASCADE | Parent category |
| `provider_id` | BigInt | ForeignKey(`providers_providerprofile`), Nullable | Specific provider or Global Template |
| `name` | VarChar(200) | Not Null | Service package title |
| `description` | Text | Not Null | Scope of work details |
| `base_price` | Decimal(10,2) | Not Null | Starting or fixed price |
| `pricing_type` | VarChar(20) | Choices: `FIXED`, `HOURLY`, `CUSTOM` | Pricing model |
| `estimated_duration_minutes`| Integer | Default: 60 | Estimated job duration |
| `is_active` | Boolean | Default: `True` | Active status |

---

### 6. `bookings_booking`
Core transaction table tracking appointments and status lifecycle.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Booking reference ID |
| `customer_id` | BigInt | ForeignKey(`accounts_customuser`), On Delete: CASCADE | Purchasing customer |
| `provider_id` | BigInt | ForeignKey(`providers_providerprofile`), On Delete: CASCADE | Assigned provider |
| `service_id` | BigInt | ForeignKey(`services_serviceitem`), On Delete: CASCADE | Chosen service package |
| `booking_date` | Date | Not Null, Index | Scheduled service date |
| `time_slot` | VarChar(20) | Not Null | Time slot (e.g. `"10:00 AM"`) |
| `status` | VarChar(20) | Choices: `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `REJECTED` | Status machine state |
| `street_address`| VarChar(255) | Not Null | Job location street |
| `city` | VarChar(100) | Not Null | Job location city |
| `state` | VarChar(50) | Not Null | State / Region |
| `zip_code` | VarChar(20) | Not Null | Postal Code |
| `total_amount` | Decimal(10,2) | Not Null | Total customer payment |
| `platform_fee` | Decimal(10,2) | Default: 0.00 | 10% platform commission |
| `provider_payout`| Decimal(10,2) | Default: 0.00 | Net provider earnings |
| `cancellation_reason`| Text | Default: `""` | Reason if rejected or cancelled |

#### Database Indexes & Constraints:
- `INDEX (provider_id, booking_date, time_slot)`: Accelerates double-booking collision checks.
- `INDEX (status)`: Fast filtering for provider request counters and admin metrics.
- `INDEX (customer_id, status)`: Fast customer bookings history queries.

---

### 7. `payments_payment`
Financial accounting records.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Payment ID |
| `booking_id` | BigInt | OneToOneField(`bookings_booking`), On Delete: CASCADE | Linked booking |
| `customer_id` | BigInt | ForeignKey(`accounts_customuser`), On Delete: CASCADE | Payer |
| `transaction_id`| VarChar(100) | Unique, Not Null | Unique gateway / demo transaction ID |
| `amount` | Decimal(10,2) | Not Null | Total amount charged |
| `platform_fee` | Decimal(10,2) | Not Null | Commission retained |
| `provider_payout`| Decimal(10,2) | Not Null | Disbursed amount |
| `payment_method`| VarChar(20) | Choices: `CARD`, `UPI`, `CASH` | Payment mechanism |
| `status` | VarChar(20) | Choices: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` | Settlement status |
| `paid_at` | Timestamp | Auto-now-add | Timestamp of transaction |

---

### 8. `reviews_review`
Customer ratings and testimonials.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BigInt | Primary Key, Auto-increment | Review ID |
| `booking_id` | BigInt | OneToOneField(`bookings_booking`), On Delete: CASCADE | Verified completed booking |
| `customer_id` | BigInt | ForeignKey(`accounts_customuser`), On Delete: CASCADE | Review author |
| `provider_id` | BigInt | ForeignKey(`providers_providerprofile`), On Delete: CASCADE | Reviewed provider |
| `service_id` | BigInt | ForeignKey(`services_serviceitem`), On Delete: CASCADE | Reviewed service |
| `rating` | Integer | Min: 1, Max: 5 | Star score |
| `comment` | Text | Not Null | Written review |
| `is_visible` | Boolean | Default: `True` | Admin moderation flag |
| `created_at` | Timestamp | Auto-now-add | Review submission date |
