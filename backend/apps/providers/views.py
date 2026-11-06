from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import ProviderProfile, ProviderWorkingHours, ProviderBlackoutDate
from .serializers import (
    ProviderProfileSerializer,
    ProviderWorkingHoursSerializer,
    ProviderBlackoutDateSerializer
)
from apps.accounts.permissions import IsProvider, IsAdministrator


class PublicProviderListView(generics.ListAPIView):
    """Public list of approved providers."""
    queryset = ProviderProfile.objects.filter(verification_status=ProviderProfile.VerificationStatus.APPROVED)
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.AllowAny]


class PublicProviderDetailView(generics.RetrieveAPIView):
    """Public details of an individual provider."""
    queryset = ProviderProfile.objects.filter(verification_status=ProviderProfile.VerificationStatus.APPROVED)
    serializer_class = ProviderProfileSerializer
    permission_classes = [permissions.AllowAny]


class ProviderDashboardProfileView(generics.RetrieveUpdateAPIView):
    """Provider's own profile management."""
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsProvider]

    def get_object(self):
        profile, _ = ProviderProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'business_name': f"{self.request.user.first_name}'s Services"}
        )
        return profile


class ProviderWorkingHoursView(APIView):
    """Manage weekly working schedule."""
    permission_classes = [IsProvider]

    def get(self, request):
        profile = request.user.provider_profile
        hours = profile.working_hours.all()
        return Response(ProviderWorkingHoursSerializer(hours, many=True).data)

    def put(self, request):
        profile = request.user.provider_profile
        data = request.data
        if not isinstance(data, list):
            return Response({"error": "Expected a list of working hour entries"}, status=status.HTTP_400_BAD_REQUEST)

        # Update or create each day
        for item in data:
            day = item.get('day_of_week')
            ProviderWorkingHours.objects.update_or_create(
                provider=profile,
                day_of_week=day,
                defaults={
                    'start_time': item.get('start_time', '09:00:00'),
                    'end_time': item.get('end_time', '18:00:00'),
                    'slot_duration_minutes': item.get('slot_duration_minutes', 60),
                    'is_active': item.get('is_active', True)
                }
            )

        updated_hours = profile.working_hours.all()
        return Response(ProviderWorkingHoursSerializer(updated_hours, many=True).data)


class ProviderBlackoutDatesView(generics.ListCreateAPIView):
    """Manage blackout dates."""
    serializer_class = ProviderBlackoutDateSerializer
    permission_classes = [IsProvider]

    def get_queryset(self):
        return self.request.user.provider_profile.blackout_dates.all()

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user.provider_profile)
