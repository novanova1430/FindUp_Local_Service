import React from 'react';
import { Modal } from '../common/Modal';
import { Booking } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Calendar, Clock, MapPin, User, FileText, DollarSign, CheckCircle2 } from 'lucide-react';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPayNow?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPayNow,
  onCancel,
}) => {
  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Details"
      subtitle={`Reference: ${booking.bookingReference}`}
      maxWidth="lg"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Status bar */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Booking Status</div>
            <div className="mt-1">
              <StatusBadge status={booking.status} />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Payment Status</div>
            <div className="mt-1">
              <StatusBadge status={booking.paymentStatus} />
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Created On</div>
            <div className="mt-1 font-mono text-slate-600">
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* 2-col info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Service & Provider */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" /> Service & Provider
            </h4>
            <div className="space-y-1">
              <div className="font-semibold text-slate-900 text-sm">{booking.serviceTitle}</div>
              <div className="text-slate-500">Category: {booking.serviceCategory}</div>
            </div>
            <div className="pt-2 border-t border-slate-100 space-y-0.5">
              <div className="font-semibold text-slate-800">{booking.providerName}</div>
              <div className="text-[11px] text-slate-500">{booking.providerTitle}</div>
            </div>
          </div>

          {/* Customer & Address */}
          <div className="p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Service Location
            </h4>
            <div className="space-y-1">
              <div className="font-semibold text-slate-900">{booking.customerName}</div>
              <div className="text-slate-600">{booking.serviceAddress}</div>
              <div className="text-slate-500">
                {booking.serviceCity}, {booking.servicePincode}
              </div>
              <div className="text-slate-500 font-mono text-[11px]">Phone: {booking.customerPhone}</div>
            </div>
          </div>
        </div>

        {/* Schedule & Notes */}
        <div className="p-4 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Appointment Schedule
          </h4>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{booking.timeSlot}</span>
            </div>
          </div>
          {booking.specialInstructions && (
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
                Special Instructions
              </div>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {booking.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* Cost breakdown */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Pricing Breakdown
          </h4>
          <div className="flex justify-between text-slate-600">
            <span>Service Base Charge:</span>
            <span className="font-mono">${booking.serviceCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Platform Service Fee (10%):</span>
            <span className="font-mono">${booking.platformFee.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
            <span>Total Amount:</span>
            <span className="font-mono text-base text-blue-600">${booking.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Cancellation Reason if cancelled */}
        {booking.cancellationReason && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
            <span className="font-bold">Cancellation Reason:</span> {booking.cancellationReason}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          {booking.paymentStatus === 'PENDING' && booking.status !== 'CANCELLED' && onPayNow && (
            <button
              onClick={() => {
                onClose();
                onPayNow(booking);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              Pay Demo Amount
            </button>
          )}

          {['PENDING', 'CONFIRMED'].includes(booking.status) && onCancel && (
            <button
              onClick={() => {
                onClose();
                onCancel(booking);
              }}
              className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              Cancel Booking
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
