from django.db import models
from django.conf import settings


class ProviderProfile(models.Model):
    class VerificationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        SUSPENDED = 'SUSPENDED', 'Suspended'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='provider_profile'
    )
    business_name = models.CharField(max_length=200)
    category = models.ForeignKey(
        'services.ServiceCategory',
        on_delete=models.SET_NULL,
        null=True,
        related_name='providers'
    )
    bio = models.TextField(blank=True, default='')
    experience_years = models.PositiveIntegerField(default=1)
    service_radius_km = models.PositiveIntegerField(default=15)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_reviews = models.PositiveIntegerField(default=0)
    completed_jobs = models.PositiveIntegerField(default=0)
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )
    verification_notes = models.TextField(blank=True, default='')
    verified_at = models.DateTimeField(null=True, blank=True)
    document_url = models.CharField(max_length=500, blank=True, default='')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name} ({self.get_verification_status_display()})"


class ProviderWorkingHours(models.Model):
    DAYS_OF_WEEK = (
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    )

    provider = models.ForeignKey(
        ProviderProfile,
        on_delete=models.CASCADE,
        related_name='working_hours'
    )
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField(default='09:00:00')
    end_time = models.TimeField(default='18:00:00')
    slot_duration_minutes = models.PositiveIntegerField(default=60)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('provider', 'day_of_week')
        ordering = ['day_of_week']

    def __str__(self):
        return f"{self.provider.business_name} - Day {self.day_of_week}: {self.start_time}-{self.end_time}"


class ProviderBlackoutDate(models.Model):
    provider = models.ForeignKey(
        ProviderProfile,
        on_delete=models.CASCADE,
        related_name='blackout_dates'
    )
    date = models.DateField()
    reason = models.CharField(max_length=255, blank=True, default='Vacation / Off')

    class Meta:
        unique_together = ('provider', 'date')
        ordering = ['date']

    def __str__(self):
        return f"{self.provider.business_name} - Blackout: {self.date}"
