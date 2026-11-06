from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    booking_service_name = serializers.CharField(source='booking.service.name', read_only=True)
    provider_name = serializers.CharField(source='booking.provider.business_name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_service_name', 'customer', 'customer_email',
            'provider_name', 'transaction_id', 'amount', 'platform_fee',
            'provider_payout', 'payment_method', 'status', 'paid_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'paid_at']
