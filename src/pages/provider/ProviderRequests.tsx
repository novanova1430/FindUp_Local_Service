import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Booking } from '../../types';
import { BookingDetailsModal } from '../../components/modals/BookingDetailsModal';
import { Modal } from '../../components/common/Modal';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  AlertCircle,
} from 'lucide-react';

export const ProviderRequests: React.FC = () => {
  const { providerProfile } = useAuth();
  const { showToast } = useToast();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const allBookings = storageService.getBookings();
  const pendingRequests = providerProfile
    ? allBookings.filter((b) => b.providerId === providerProfile.id && b.status === 'PENDING')
    : [];

  const handleAccept = (booking: Booking) => {
    // Attempt status transition to CONFIRMED (this internally performs the double-booking check!)
    const res = storageService.updateBookingStatus(booking.id, 'CONFIRMED');

    if (res.success) {
      showToast(`Appointment ${booking.bookingReference} confirmed! Customer notified.`, 'success');
    } else {
      showToast(res.error || 'Cannot accept: Double booking conflict.', 'error');
    }
  };

  const handleOpenReject = (booking: Booking) => {
    setSelectedBooking(booking);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedBooking) return;
    const res = storageService.updateBookingStatus(
      selectedBooking.id,
      'REJECTED',
      rejectReason || 'Provider unavailable for requested slot.'
    );

    if (res.success) {
      showToast(`Booking request ${selectedBooking.bookingReference} declined.`, 'info');
      setRejectModalOpen(false);
    } else {
      showToast(res.error || 'Failed to reject request.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Incoming Booking Requests</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review customer service requests. Accepting a booking automatically reserves your slot and confirms dispatch.
        </p>
      </div>

      {pendingRequests.length > 0 ? (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{req.bookingReference}</span>
                    <span className="text-xs text-slate-400">&middot;</span>
                    <span className="text-xs text-blue-700 font-semibold">{req.serviceCategory}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{req.serviceTitle}</h3>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Service Value</div>
                  <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                    ${req.serviceCharge.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Customer</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{req.customerName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{req.customerPhone}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Requested Schedule</span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{req.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{req.timeSlot}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Location</span>
                  <div className="flex items-start gap-1.5 text-slate-700 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{req.serviceAddress}, {req.serviceCity}</span>
                  </div>
                </div>
              </div>

              {req.specialInstructions && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Client Instructions:</span> "{req.specialInstructions}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedBooking(req);
                    setDetailsModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Inspect Full Details
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenReject(req)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Decline Request
                  </button>
                  <button
                    onClick={() => handleAccept(req)}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Accept & Confirm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Pending Requests</h3>
          <p className="text-xs text-slate-500">
            You're all caught up! New customer service requests will appear here immediately.
          </p>
        </div>
      )}

      {/* Details Modal */}
      <BookingDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
      />

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Decline Booking Request"
        subtitle={`Booking: ${selectedBooking?.bookingReference}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Decline request from <span className="font-bold text-slate-800">{selectedBooking?.customerName}</span> for{' '}
            <span className="font-mono text-slate-800">{selectedBooking?.date}</span>?
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Decline Reason (Sent to Customer)
            </label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. Fully booked during this window, travel distance outside service area..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReject}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Confirm Decline
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
