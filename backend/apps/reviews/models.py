from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    booking = models.OneToOneField(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='review'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='customer_reviews'
    )
    provider = models.ForeignKey(
        'providers.ProviderProfile',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    service = models.ForeignKey(
        'services.ServiceItem',
        on_delete=models.CASCADE,
        related_name='service_reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.customer.email} for {self.provider.business_name} ({self.rating}★)"
