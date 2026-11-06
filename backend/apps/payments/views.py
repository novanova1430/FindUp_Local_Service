from rest_framework import generics, permissions, status
from rest_framework.response import Response
import uuid
from .models import Payment
from .serializers import PaymentSerializer
from apps.bookings.models import Booking


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN' or user.is_superuser:
            return Payment.objects.all().select_related('booking', 'customer', 'booking__service', 'booking__provider')
        elif user.role == 'CUSTOMER':
            return Payment.objects.filter(customer=user)
        elif user.role == 'PROVIDER':
            return Payment.objects.filter(booking__provider__user=user)
        return Payment.objects.none()


class ProcessPaymentView(generics.CreateAPIView):
    """Simulate processing a payment for a booking."""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        payment_method = request.data.get('payment_method', 'CARD')
        booking = generics.get_object_or_404(Booking, id=booking_id)

        fee_rate = 0.10
        total = float(booking.total_amount)
        fee = round(total * fee_rate, 2)
        payout = round(total - fee, 2)

        payment, _ = Payment.objects.update_or_create(
            booking=booking,
            defaults={
                'customer': request.user,
                'transaction_id': f"TXN-{uuid.uuid4().hex[:10].upper()}",
                'amount': total,
                'platform_fee': fee,
                'provider_payout': payout,
                'payment_method': payment_method,
                'status': Payment.PaymentStatus.COMPLETED
            }
        )

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
