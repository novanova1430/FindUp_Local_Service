from rest_framework import serializers
from apps.accounts.models import CustomUser
from apps.providers.models import ProviderProfile
from apps.bookings.models import Booking
from apps.payments.models import Payment


class AdminProviderVerificationSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['APPROVED', 'REJECTED', 'SUSPENDED'])
    notes = serializers.CharField(required=False, allow_blank=True, default='')


class AdminCustomerActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['SUSPEND', 'ACTIVATE'])
    reason = serializers.CharField(required=False, allow_blank=True, default='')


class AdminStatsSerializer(serializers.Serializer):
    total_customers = serializers.IntegerField()
    total_providers = serializers.IntegerField()
    pending_verifications = serializers.IntegerField()
    total_bookings = serializers.IntegerField()
    active_bookings = serializers.IntegerField()
    completed_bookings = serializers.IntegerField()
    gross_volume = serializers.DecimalField(max_digits=12, decimal_places=2)
    platform_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
