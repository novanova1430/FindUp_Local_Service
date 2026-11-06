from rest_framework import serializers
from .models import CustomerProfile, SavedAddress
from apps.accounts.serializers import UserSerializer


class SavedAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedAddress
        fields = ['id', 'title', 'street', 'city', 'state', 'postal_code', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']


class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    saved_addresses = SavedAddressSerializer(many=True, read_only=True)

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'user', 'address_line', 'city', 'state', 'postal_code',
            'latitude', 'longitude', 'saved_addresses', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
