from rest_framework import serializers
from .models import Booking
from apps.accounts.serializers import UserSerializer
from apps.services.serializers import ServiceItemSerializer
from apps.providers.serializers import ProviderProfileSerializer


class BookingSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    provider = ProviderProfileSerializer(read_only=True)
    service = ServiceItemSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'provider', 'service', 'booking_date',
            'time_slot', 'status', 'street_address', 'city', 'state',
            'zip_code', 'notes', 'total_amount', 'platform_fee',
            'provider_payout', 'cancellation_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'customer', 'provider', 'service', 'platform_fee',
            'provider_payout', 'created_at', 'updated_at'
        ]


class CreateBookingSerializer(serializers.Serializer):
    provider_id = serializers.IntegerField(required=True)
    service_id = serializers.IntegerField(required=True)
    booking_date = serializers.DateField(required=True)
    time_slot = serializers.CharField(max_length=20, required=True)
    street_address = serializers.CharField(max_length=255, required=True)
    city = serializers.CharField(max_length=100, required=True)
    state = serializers.CharField(max_length=50, required=True)
    zip_code = serializers.CharField(max_length=20, required=True)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0.00)


class BookingActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['ACCEPT', 'REJECT', 'START', 'COMPLETE', 'CANCEL'])
    reason = serializers.CharField(required=False, allow_blank=True, default='')
