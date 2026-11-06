from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Booking
from .serializers import BookingSerializer, CreateBookingSerializer, BookingActionSerializer
from .services import BookingService
from apps.accounts.permissions import IsCustomer, IsProvider


class BookingListView(generics.ListCreateAPIView):
    """
    List bookings relevant to user role or create a new booking for customers.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Booking.objects.filter(customer=user).select_related('provider', 'service', 'customer')
        elif user.role == 'PROVIDER':
            return Booking.objects.filter(provider__user=user).select_related('provider', 'service', 'customer')
        elif user.role == 'ADMIN' or user.is_superuser:
            return Booking.objects.all().select_related('provider', 'service', 'customer')
        return Booking.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = CreateBookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        booking = BookingService.create_booking(
            customer=request.user,
            provider_id=data['provider_id'],
            service_id=data['service_id'],
            booking_date=data['booking_date'],
            time_slot=data['time_slot'],
            street_address=data['street_address'],
            city=data['city'],
            state=data['state'],
            zip_code=data['zip_code'],
            notes=data.get('notes', ''),
            total_amount=data.get('total_amount', 0)
        )

        output_serializer = BookingSerializer(booking)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'CUSTOMER':
            return Booking.objects.filter(customer=user)
        elif user.role == 'PROVIDER':
            return Booking.objects.filter(provider__user=user)
        elif user.role == 'ADMIN' or user.is_superuser:
            return Booking.objects.all()
        return Booking.objects.none()


class BookingActionView(APIView):
    """
    Trigger workflow actions on a booking: ACCEPT, REJECT, START, COMPLETE, CANCEL.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        action_serializer = BookingActionSerializer(data=request.data)
        action_serializer.is_valid(raise_exception=True)
        action = action_serializer.validated_data['action']
        reason = action_serializer.validated_data.get('reason', '')

        if action == 'ACCEPT':
            booking = BookingService.accept_booking(pk, request.user)
        elif action == 'REJECT':
            booking = BookingService.reject_booking(pk, request.user, reason)
        elif action == 'START':
            booking = get_object_or_404(Booking, id=pk, provider__user=request.user)
            booking.status = Booking.BookingStatus.IN_PROGRESS
            booking.save()
        elif action == 'COMPLETE':
            booking = BookingService.complete_booking(pk, request.user)
        elif action == 'CANCEL':
            booking = get_object_or_404(Booking, id=pk)
            # check authorization
            if booking.customer != request.user and booking.provider.user != request.user and request.user.role != 'ADMIN':
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            booking.status = Booking.BookingStatus.CANCELLED
            booking.cancellation_reason = reason or "Cancelled by user"
            booking.save()
        else:
            return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(BookingSerializer(booking).data)
