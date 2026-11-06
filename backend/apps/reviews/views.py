from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Avg
from .models import Review
from .serializers import ReviewSerializer
from apps.bookings.models import Booking


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        provider_id = self.request.query_params.get('provider')
        if provider_id:
            return Review.objects.filter(provider_id=provider_id, is_visible=True)
        return Review.objects.filter(is_visible=True)

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking_id')
        rating = int(request.data.get('rating', 5))
        comment = request.data.get('comment', '')

        booking = generics.get_object_or_404(Booking, id=booking_id, customer=request.user)

        if Review.objects.filter(booking=booking).exists():
            return Response({"error": "A review for this booking already exists."}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            booking=booking,
            customer=request.user,
            provider=booking.provider,
            service=booking.service,
            rating=rating,
            comment=comment
        )

        # Recalculate provider average rating
        provider = booking.provider
        agg = Review.objects.filter(provider=provider, is_visible=True).aggregate(avg=Avg('rating'))
        provider.rating = round(agg['avg'] or 5.0, 2)
        provider.total_reviews = Review.objects.filter(provider=provider, is_visible=True).count()
        provider.save()

        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class ReviewToggleVisibilityView(generics.UpdateAPIView):
    """Admin moderation tool to hide/unhide reviews."""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        review = self.get_object()
        review.is_visible = not review.is_visible
        review.save()
        return Response(ReviewSerializer(review).data)
