from django.db import models
from django.conf import settings


class Booking(models.Model):
    class BookingStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Provider Confirmation'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        REJECTED = 'REJECTED', 'Rejected'

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_bookings'
    )
    provider = models.ForeignKey(
        'providers.ProviderProfile',
        on_delete=models.CASCADE,
        related_name='provider_bookings'
    )
    service = models.ForeignKey(
        'services.ServiceItem',
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    booking_date = models.DateField()
    time_slot = models.CharField(max_length=20)  # e.g., '10:00 AM'
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING
    )
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=20)
    notes = models.TextField(blank=True, default='')

    # Financials
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    provider_payout = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    # Rejection or cancellation reasons
    cancellation_reason = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-booking_date', '-created_at']
        indexes = [
            models.Index(fields=['provider', 'booking_date', 'time_slot']),
            models.Index(fields=['status']),
            models.Index(fields=['customer', 'status']),
        ]

    def __str__(self):
        return f"Booking #{self.id} - {self.service.name} for {self.customer.email} ({self.status})"
