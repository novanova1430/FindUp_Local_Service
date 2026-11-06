from rest_framework import serializers
from .models import Review
from apps.accounts.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    provider_name = serializers.CharField(source='provider.business_name', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'booking', 'customer', 'provider', 'provider_name',
            'service', 'service_name', 'rating', 'comment', 'is_visible', 'created_at'
        ]
        read_only_fields = ['id', 'customer', 'provider', 'service', 'created_at']
