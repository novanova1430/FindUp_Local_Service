from rest_framework import serializers
from .models import ProviderProfile, ProviderWorkingHours, ProviderBlackoutDate
from apps.accounts.serializers import UserSerializer
from apps.services.serializers import ServiceCategorySerializer


class ProviderWorkingHoursSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = ProviderWorkingHours
        fields = ['id', 'day_of_week', 'day_name', 'start_time', 'end_time', 'slot_duration_minutes', 'is_active']


class ProviderBlackoutDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderBlackoutDate
        fields = ['id', 'date', 'reason']


class ProviderProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = ServiceCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    working_hours = ProviderWorkingHoursSerializer(many=True, read_only=True)
    blackout_dates = ProviderBlackoutDateSerializer(many=True, read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            'id', 'user', 'business_name', 'category', 'category_id', 'bio',
            'experience_years', 'service_radius_km', 'hourly_rate',
            'rating', 'total_reviews', 'completed_jobs',
            'verification_status', 'verification_notes', 'verified_at',
            'document_url', 'is_available', 'working_hours', 'blackout_dates',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'rating', 'total_reviews', 'completed_jobs',
            'verification_status', 'verification_notes', 'verified_at',
            'created_at', 'updated_at'
        ]

    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        if category_id:
            from apps.services.models import ServiceCategory
            instance.category = ServiceCategory.objects.get(id=category_id)
        return super().update(instance, validated_data)
