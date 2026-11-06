from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer injecting role, full name, and avatar into the token payload
    and authentication response.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'role': self.user.role,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'phone': self.user.phone,
            'avatar': self.user.avatar.url if self.user.avatar else None,
            'is_active': self.user.is_active,
        }
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'role', 'first_name', 'last_name',
            'phone', 'avatar', 'is_verified', 'is_active', 'date_joined'
        ]
        read_only_fields = ['id', 'role', 'is_verified', 'is_active', 'date_joined']


class RegisterCustomerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=User.Role.CUSTOMER,
            is_verified=True  # Customers are auto-verified
        )
        return user


class RegisterProviderSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    business_name = serializers.CharField(write_only=True, required=True)
    category_id = serializers.IntegerField(write_only=True, required=True)
    experience_years = serializers.IntegerField(write_only=True, default=1)
    service_radius_km = serializers.IntegerField(write_only=True, default=15)
    hourly_rate = serializers.DecimalField(write_only=True, max_digits=10, decimal_places=2, default=50.00)

    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name', 'phone',
            'business_name', 'category_id', 'experience_years', 'service_radius_km', 'hourly_rate'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        from apps.providers.models import ProviderProfile
        from apps.services.models import ServiceCategory

        validated_data.pop('password_confirm')
        business_name = validated_data.pop('business_name')
        category_id = validated_data.pop('category_id')
        experience_years = validated_data.pop('experience_years')
        service_radius_km = validated_data.pop('service_radius_km')
        hourly_rate = validated_data.pop('hourly_rate')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=User.Role.PROVIDER,
            is_verified=False  # Must be approved by administrator
        )

        category = ServiceCategory.objects.get(id=category_id)

        ProviderProfile.objects.create(
            user=user,
            business_name=business_name,
            category=category,
            experience_years=experience_years,
            service_radius_km=service_radius_km,
            hourly_rate=hourly_rate,
            verification_status='PENDING'
        )

        return user
