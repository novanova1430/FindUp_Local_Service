from rest_framework import serializers
from .models import ServiceCategory, ServiceItem


class ServiceCategorySerializer(serializers.ModelSerializer):
    services_count = serializers.IntegerField(source='services.count', read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'image', 'is_active', 'order', 'services_count']


class ServiceItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = ServiceItem
        fields = [
            'id', 'category', 'category_name', 'category_slug', 'provider',
            'name', 'description', 'base_price', 'pricing_type',
            'estimated_duration_minutes', 'image_url', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
