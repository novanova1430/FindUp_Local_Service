from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.utils import timezone
from apps.accounts.models import CustomUser
from apps.providers.models import ProviderProfile
from apps.bookings.models import Booking
from apps.payments.models import Payment
from apps.accounts.permissions import IsAdministrator
from apps.providers.serializers import ProviderProfileSerializer
from apps.accounts.serializers import UserSerializer
from .serializers import AdminProviderVerificationSerializer, AdminCustomerActionSerializer, AdminStatsSerializer


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdministrator]

    def get(self, request):
        total_customers = CustomUser.objects.filter(role=CustomUser.Role.CUSTOMER).count()
        total_providers = CustomUser.objects.filter(role=CustomUser.Role.PROVIDER).count()
        pending_verifications = ProviderProfile.objects.filter(verification_status='PENDING').count()

        total_bookings = Booking.objects.count()
        active_bookings = Booking.objects.filter(status__in=['PENDING', 'CONFIRMED', 'IN_PROGRESS']).count()
        completed_bookings = Booking.objects.filter(status='COMPLETED').count()

        gross_volume = Payment.objects.filter(status='COMPLETED').aggregate(total=Sum('amount'))['total'] or 0.00
        platform_revenue = Payment.objects.filter(status='COMPLETED').aggregate(total=Sum('platform_fee'))['total'] or 0.00

        data = {
            'total_customers': total_customers,
            'total_providers': total_providers,
            'pending_verifications': pending_verifications,
            'total_bookings': total_bookings,
            'active_bookings': active_bookings,
            'completed_bookings': completed_bookings,
            'gross_volume': gross_volume,
            'platform_revenue': platform_revenue,
        }
        return Response(data)


class AdminProviderListView(generics.ListAPIView):
    queryset = ProviderProfile.objects.all().select_related('user', 'category')
    serializer_class = ProviderProfileSerializer
    permission_classes = [IsAdministrator]


class AdminProviderVerificationView(APIView):
    permission_classes = [IsAdministrator]

    def post(self, request, pk):
        serializer = AdminProviderVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        provider = generics.get_object_or_404(ProviderProfile, id=pk)

        new_status = serializer.validated_data['status']
        notes = serializer.validated_data.get('notes', '')

        provider.verification_status = new_status
        provider.verification_notes = notes
        if new_status == 'APPROVED':
            provider.verified_at = timezone.now()
            provider.user.is_verified = True
            provider.user.save()
        elif new_status == 'REJECTED':
            provider.user.is_verified = False
            provider.user.save()
        elif new_status == 'SUSPENDED':
            provider.is_available = False

        provider.save()
        return Response(ProviderProfileSerializer(provider).data)


class AdminCustomerListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role=CustomUser.Role.CUSTOMER)
    serializer_class = UserSerializer
    permission_classes = [IsAdministrator]


class AdminCustomerActionView(APIView):
    permission_classes = [IsAdministrator]

    def post(self, request, pk):
        serializer = AdminCustomerActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = generics.get_object_or_404(CustomUser, id=pk, role=CustomUser.Role.CUSTOMER)

        action = serializer.validated_data['action']
        if action == 'SUSPEND':
            customer.is_active = False
        elif action == 'ACTIVATE':
            customer.is_active = True
        customer.save()

        return Response(UserSerializer(customer).data)
