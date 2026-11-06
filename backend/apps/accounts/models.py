from django.contrib.auth.models import AbstractUser
from django.db import models

class UserRole(models.TextChoices):
    CUSTOMER = 'customer', 'Customer'
    PROVIDER = 'provider', 'Service Provider'
    ADMIN = 'admin', 'Administrator'

class User(AbstractUser):
    """
    Custom FixFlow User Model.
    Email acts as unique identifier alongside username.
    """
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.CUSTOMER)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'fixflow_users'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.role})"
