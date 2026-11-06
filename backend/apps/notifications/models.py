from django.db import models
from django.conf import settings


class Notification(models.Model):
    class NotificationType(models.TextChoices):
        BOOKING = 'BOOKING', 'Booking Alert'
        PAYMENT = 'PAYMENT', 'Payment Alert'
        SYSTEM = 'SYSTEM', 'System Alert'
        VERIFICATION = 'VERIFICATION', 'Verification Alert'

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient.email} - {self.title} ({'Read' if self.is_read else 'Unread'})"
