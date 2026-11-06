from django.db import transaction
from rest_framework.exceptions import ValidationError
from .models import Booking
from apps.notifications.models import Notification


class BookingService:
    """
    Domain service handling atomic booking lifecycle, double-booking prevention,
    and business rule enforcement.
    """

    ACTIVE_STATUSES = [
        Booking.BookingStatus.PENDING,
        Booking.BookingStatus.CONFIRMED,
        Booking.BookingStatus.IN_PROGRESS
    ]

    @classmethod
    @transaction.atomic
    def create_booking(cls, customer, provider_id, service_id, booking_date, time_slot,
                       street_address, city, state, zip_code, notes='', total_amount=0):
        from apps.providers.models import ProviderProfile, ProviderBlackoutDate
        from apps.services.models import ServiceItem

        # Lock provider row to serialize concurrent booking attempts
        provider = ProviderProfile.objects.select_for_update().get(id=provider_id)
        service = ServiceItem.objects.get(id=service_id)

        # 1. Check if provider is available overall
        if not provider.is_available:
            raise ValidationError("This provider is currently marked as unavailable for new bookings.")

        # 2. Check provider verification
        if provider.verification_status != ProviderProfile.VerificationStatus.APPROVED:
            raise ValidationError("This provider is not currently authorized to accept bookings.")

        # 3. Check blackout dates
        if ProviderBlackoutDate.objects.filter(provider=provider, date=booking_date).exists():
            raise ValidationError(f"The provider is unavailable on {booking_date} (scheduled blackout).")

        # 4. Enforce strict double-booking prevention with concurrency lock
        conflicting_booking = Booking.objects.select_for_update().filter(
            provider=provider,
            booking_date=booking_date,
            time_slot=time_slot,
            status__in=cls.ACTIVE_STATUSES
        ).first()

        if conflicting_booking:
            raise ValidationError(
                f"Time slot '{time_slot}' on {booking_date} has already been reserved for this provider."
            )

        # 5. Calculate platform fee and provider payout (e.g. 10% platform fee)
        fee_rate = 0.10
        total_dec = float(total_amount if total_amount > 0 else service.base_price)
        platform_fee = round(total_dec * fee_rate, 2)
        provider_payout = round(total_dec - platform_fee, 2)

        # 6. Create booking
        booking = Booking.objects.create(
            customer=customer,
            provider=provider,
            service=service,
            booking_date=booking_date,
            time_slot=time_slot,
            street_address=street_address,
            city=city,
            state=state,
            zip_code=zip_code,
            notes=notes,
            total_amount=total_dec,
            platform_fee=platform_fee,
            provider_payout=provider_payout,
            status=Booking.BookingStatus.PENDING
        )

        # 7. Notify provider
        Notification.objects.create(
            recipient=provider.user,
            title="New Booking Request",
            message=f"You received a new booking for {service.name} on {booking_date} at {time_slot}.",
            notification_type='BOOKING'
        )

        return booking

    @classmethod
    @transaction.atomic
    def accept_booking(cls, booking_id, provider_user):
        """Provider accepts a pending booking after verifying conflict."""
        booking = Booking.objects.select_for_update().get(id=booking_id)

        if booking.provider.user != provider_user:
            raise ValidationError("You do not have permission to manage this booking.")

        if booking.status != Booking.BookingStatus.PENDING:
            raise ValidationError(f"Cannot accept booking in '{booking.status}' status.")

        # Ensure no other booking was confirmed for the exact slot
        existing = Booking.objects.filter(
            provider=booking.provider,
            booking_date=booking.booking_date,
            time_slot=booking.time_slot,
            status=Booking.BookingStatus.CONFIRMED
        ).exclude(id=booking.id).first()

        if existing:
            raise ValidationError("You have another confirmed booking for this exact time slot.")

        booking.status = Booking.BookingStatus.CONFIRMED
        booking.save()

        Notification.objects.create(
            recipient=booking.customer,
            title="Booking Confirmed!",
            message=f"{booking.provider.business_name} has accepted your booking for {booking.service.name}.",
            notification_type='BOOKING'
        )

        return booking

    @classmethod
    @transaction.atomic
    def reject_booking(cls, booking_id, provider_user, reason=''):
        """Provider declines a pending booking."""
        booking = Booking.objects.select_for_update().get(id=booking_id)

        if booking.provider.user != provider_user:
            raise ValidationError("You do not have permission to manage this booking.")

        if booking.status != Booking.BookingStatus.PENDING:
            raise ValidationError(f"Cannot reject booking in '{booking.status}' status.")

        booking.status = Booking.BookingStatus.REJECTED
        booking.cancellation_reason = reason or "Declined by provider"
        booking.save()

        Notification.objects.create(
            recipient=booking.customer,
            title="Booking Declined",
            message=f"{booking.provider.business_name} could not accept your booking: {booking.cancellation_reason}",
            notification_type='BOOKING'
        )

        return booking

    @classmethod
    @transaction.atomic
    def complete_booking(cls, booking_id, provider_user):
        """Mark booking completed and increment provider stats."""
        booking = Booking.objects.select_for_update().get(id=booking_id)

        if booking.provider.user != provider_user:
            raise ValidationError("Unauthorized.")

        if booking.status not in [Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.IN_PROGRESS]:
            raise ValidationError(f"Cannot complete a booking that is '{booking.status}'.")

        booking.status = Booking.BookingStatus.COMPLETED
        booking.save()

        # Update provider stats
        provider = booking.provider
        provider.completed_jobs += 1
        provider.save()

        Notification.objects.create(
            recipient=booking.customer,
            title="Service Completed",
            message=f"Your service '{booking.service.name}' was marked complete. Please leave a review!",
            notification_type='BOOKING'
        )

        return booking
