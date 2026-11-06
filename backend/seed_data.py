"""
FixFlow Database Seeding Script for Django + PostgreSQL
Populates standard demo users, categories, services, and sample bookings.
Usage:
    python manage.py shell < seed_data.py
"""

import os
import django

# Configure django environment if run directly
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
try:
    django.setup()
except Exception:
    pass

from django.contrib.auth import get_user_model
from apps.providers.models import ProviderProfile, ProviderWorkingHours
from apps.services.models import ServiceCategory, ServiceItem
from apps.bookings.models import Booking
from apps.payments.models import Payment
from apps.reviews.models import Review

User = get_user_model()

print("Seeding FixFlow database...")

# 1. Admin
admin_user, created = User.objects.get_or_create(
    email="admin@fixflow.demo",
    defaults={
        "first_name": "Eleanor",
        "last_name": "Vance",
        "role": User.Role.ADMIN,
        "is_staff": True,
        "is_superuser": True,
        "is_verified": True,
        "phone": "+1 (555) 019-2834"
    }
)
if created:
    admin_user.set_password("AdminPass123!")
    admin_user.save()
    print("Created Admin: admin@fixflow.demo")

# 2. Customer
customer_user, created = User.objects.get_or_create(
    email="customer@fixflow.demo",
    defaults={
        "first_name": "Sarah",
        "last_name": "Jenkins",
        "role": User.Role.CUSTOMER,
        "is_verified": True,
        "phone": "+1 (555) 234-5678"
    }
)
if created:
    customer_user.set_password("CustomerPass123!")
    customer_user.save()
    print("Created Customer: customer@fixflow.demo")

# 3. Provider
provider_user, created = User.objects.get_or_create(
    email="provider@fixflow.demo",
    defaults={
        "first_name": "Marcus",
        "last_name": "Vance",
        "role": User.Role.PROVIDER,
        "is_verified": True,
        "phone": "+1 (555) 345-6789"
    }
)
if created:
    provider_user.set_password("ProviderPass123!")
    provider_user.save()
    print("Created Provider: provider@fixflow.demo")

# 4. Categories
categories_data = [
    ("Plumbing", "plumbing", "Wrench", "Pipes, leak repairs, unclogging, and fixtures"),
    ("Electrical", "electrical", "Zap", "Wiring, panels, circuit breakers, and lighting fixtures"),
    ("HVAC & AC", "hvac", "Thermometer", "Air conditioning, central heating, and ventilation maintenance"),
    ("Home Cleaning", "cleaning", "Sparkles", "Deep house cleaning, move-in/out sanitization, and upholstery"),
    ("Carpentry", "carpentry", "Hammer", "Custom cabinetry, furniture repair, shelving, and wood flooring"),
    ("Painting", "painting", "Paintbrush", "Interior and exterior wall painting, priming, and drywall repair"),
    ("Appliance Repair", "appliance-repair", "Cpu", "Refrigerators, washing machines, ovens, and dryers"),
    ("Locksmith", "locksmith", "Key", "Emergency lockouts, deadbolt installation, and smart keypads"),
    ("Gardening & Landscaping", "gardening-landscaping", "Trees", "Lawn manicuring, shrub shaping, and seasonal garden care"),
    ("Smart Security & CCTV", "smart-security", "ShieldCheck", "4K CCTV cameras, smart doorbells, and digital locks"),
    ("Solar Panel Maintenance", "solar-energy", "SunMedium", "De-ionized solar panel wash and inverter diagnostics"),
    ("Roof & Waterproofing", "waterproofing", "Droplets", "Terrace membrane sealing and leak-proofing"),
]

cat_map = {}
for name, slug, icon, desc in categories_data:
    cat, _ = ServiceCategory.objects.get_or_create(
        slug=slug,
        defaults={"name": name, "icon": icon, "description": desc, "is_active": True}
    )
    cat_map[slug] = cat

# 5. Link Provider Profile
provider_profile, _ = ProviderProfile.objects.get_or_create(
    user=provider_user,
    defaults={
        "business_name": "Apex Pro Mechanical & Plumbing",
        "category": cat_map["plumbing"],
        "bio": "Licensed master plumber with 12+ years experience in high-rise and suburban residential systems.",
        "experience_years": 12,
        "service_radius_km": 25,
        "hourly_rate": 85.00,
        "rating": 4.95,
        "total_reviews": 48,
        "completed_jobs": 142,
        "verification_status": ProviderProfile.VerificationStatus.APPROVED,
        "is_available": True
    }
)

# 6. Provider Working Hours (Mon - Sat)
for day in range(6):
    ProviderWorkingHours.objects.get_or_create(
        provider=provider_profile,
        day_of_week=day,
        defaults={"start_time": "08:00:00", "end_time": "18:00:00", "slot_duration_minutes": 60, "is_active": True}
    )

# 7. Sample Services
services_data = [
    ("Emergency Pipe Leak Diagnosis & Repair", "plumbing", 95.00, 60, "Rapid detection and resolution of ruptured copper pipes, PVC joints, and water main leaks."),
    ("Water Heater Flush & Element Replacement", "plumbing", 140.00, 90, "Annual sediment flushing, sacrificial anode rod replacement, and thermostat calibration."),
    ("Main Electrical Panel 200A Upgrade", "electrical", 450.00, 180, "Full sub-panel replacement with modern arc-fault circuit interrupters."),
    ("EV Charging Station Installation", "electrical", 280.00, 120, "Level-2 dedicated 240V NEMA 14-50 circuit breaker installation and cabling."),
    ("Whole-Home Deep Clean & Disinfection", "cleaning", 160.00, 240, "Comprehensive 55-point sanitization checklist across all rooms, appliances, and bathrooms."),
    ("Multi-Split AC Precision Tune-Up & Refrigerant", "hvac", 120.00, 90, "Evaporator coil cleaning, blower wheel wash, condensate line flush, and R410A check."),
]

for title, cat_slug, price, dur, desc in services_data:
    ServiceItem.objects.get_or_create(
        name=title,
        defaults={
            "category": cat_map[cat_slug],
            "provider": provider_profile if cat_slug == "plumbing" else None,
            "base_price": price,
            "pricing_type": ServiceItem.PricingType.FIXED,
            "estimated_duration_minutes": dur,
            "description": desc,
            "is_active": True
        }
    )

print("Database seeding completed successfully!")
