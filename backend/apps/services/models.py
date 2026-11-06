from django.db import models
from django.conf import settings


class ServiceCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, default='Wrench')
    image = models.ImageField(upload_to='categories/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Service Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class ServiceItem(models.Model):
    class PricingType(models.TextChoices):
        FIXED = 'FIXED', 'Fixed Price'
        HOURLY = 'HOURLY', 'Hourly Rate'
        CUSTOM = 'CUSTOM', 'Custom Quote'

    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name='services'
    )
    provider = models.ForeignKey(
        'providers.ProviderProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='offered_services',
        help_text='Null if global platform template service'
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    pricing_type = models.CharField(
        max_length=20,
        choices=PricingType.choices,
        default=PricingType.FIXED
    )
    estimated_duration_minutes = models.PositiveIntegerField(default=60)
    image = models.ImageField(upload_to='services/', null=True, blank=True)
    image_url = models.CharField(max_length=500, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} (${self.base_price})"
