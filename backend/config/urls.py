"""
FixFlow API Route URL Configuration
Versioned REST APIs under /api/v1/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # FixFlow REST API v1
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/customer/', include('apps.customers.urls')),
    path('api/v1/provider/', include('apps.providers.urls')),
    path('api/v1/services/', include('apps.services.urls')),
    path('api/v1/bookings/', include('apps.bookings.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/reviews/', include('apps.reviews.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/administration/', include('apps.administration.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
