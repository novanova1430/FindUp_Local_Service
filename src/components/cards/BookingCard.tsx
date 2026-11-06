import React from 'react';
import { Booking } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Calendar, Clock, MapPin, DollarSign, CreditCard, Star, XCircle } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
  onPayNow?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
  onReview?: (booking: Booking) => void;
  userRole?: 'customer' | 'provider' | 'admin';
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onPayNow,
  onCancel,
  onReview,
  userRole = 'customer',
}) => {
  const canPay = userRole === 'customer' && booking.paymentStatus === 'PENDING' && booking.status !== 'CANCELLED';
  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);
  const canReview = userRole === 'customer' && booking.status === 'COMPLETED' && !booking.reviewed;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800">{booking.bookingReference}</span>
            <span className="text-xs text-slate-400">&middot;</span>
            <span className="text-xs text-slate-500 font-medium">{booking.serviceCategory}</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-1">{booking.serviceTitle}</h4>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={booking.status} />
          {booking.paymentStatus === 'SUCCESS' ? (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
              PAID
            </span>
          ) : booking.paymentStatus === 'PENDING' ? (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              UNPAID
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {booking.paymentStatus}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 text-xs text-slate-600">
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            {userRole === 'provider' ? 'Customer' : 'Provider'}
          </div>
          <div className="font-semibold text-slate-900">
            {userRole === 'provider' ? booking.customerName : booking.providerName}
          </div>
          <div className="text-[11px] text-slate-500">
            {userRole === 'provider' ? booking.customerPhone : booking.providerTitle}
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Appointment</div>
          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{booking.timeSlot}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Service Location</div>
          <div className="flex items-start gap-1.5 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{booking.serviceAddress}, {booking.serviceCity}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Total Charged:</span>
          <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
            ${booking.totalAmount.toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400">(incl. ${booking.platformFee.toFixed(2)} fee)</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canPay && onPayNow && (
            <button
              onClick={() => onPayNow(booking)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pay Demo Amount
            </button>
          )}

          {canReview && onReview && (
            <button
              onClick={() => onReview(booking)}
              className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Write Review
            </button>
          )}

          {canCancel && onCancel && (
            <button
              onClick={() => onCancel(booking)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}

          <button
            onClick={() => onViewDetails(booking)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
