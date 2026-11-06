import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Booking, BookingStatus } from '../../types';
import { BookingCard } from '../../components/cards/BookingCard';
import { BookingDetailsModal } from '../../components/modals/BookingDetailsModal';
import { PaymentModal } from '../../components/modals/PaymentModal';
import { ReviewModal } from '../../components/modals/ReviewModal';
import { Modal } from '../../components/common/Modal';
import { Calendar, Search, Filter } from 'lucide-react';

export const CustomerBookings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const allBookings = storageService.getBookings();

  const myBookings = useMemo(() => {
    if (!user) return [];
    return allBookings.filter((b) => b.customerId === user.id);
  }, [allBookings, user]);

  const filteredBookings = useMemo(() => {
    return myBookings.filter((b) => {
      const matchTab = activeTab === 'ALL' || b.status === activeTab;
      const matchSearch =
        !searchQuery.trim() ||
        b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.providerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [myBookings, activeTab, searchQuery]);

  // Actions
  const handleOpenDetails = (b: Booking) => {
    setSelectedBooking(b);
    setDetailsModalOpen(true);
  };

  const handleOpenPay = (b: Booking) => {
    setSelectedBooking(b);
    setPaymentModalOpen(true);
  };

  const handleOpenReview = (b: Booking) => {
    setSelectedBooking(b);
    setReviewModalOpen(true);
  };

  const handleOpenCancel = (b: Booking) => {
    setSelectedBooking(b);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;
    const res = storageService.updateBookingStatus(
      selectedBooking.id,
      'CANCELLED',
      cancelReason || 'Cancelled by customer',
      user?.id
    );

    if (res.success) {
      showToast('Booking has been cancelled.', 'info');
      setCancelModalOpen(false);
    } else {
      showToast(res.error || 'Failed to cancel booking.', 'error');
    }
  };

  const tabs: { key: string; label: string; count: number }[] = [
    { key: 'ALL', label: 'All', count: myBookings.length },
    { key: 'PENDING', label: 'Pending', count: myBookings.filter((b) => b.status === 'PENDING').length },
    { key: 'CONFIRMED', label: 'Confirmed', count: myBookings.filter((b) => b.status === 'CONFIRMED').length },
    { key: 'IN_PROGRESS', label: 'In Progress', count: myBookings.filter((b) => b.status === 'IN_PROGRESS').length },
    { key: 'COMPLETED', label: 'Completed', count: myBookings.filter((b) => b.status === 'COMPLETED').length },
    { key: 'CANCELLED', label: 'Cancelled', count: myBookings.filter((b) => b.status === 'CANCELLED').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Appointments & Bookings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, track, reschedule, or settle payments for your home services.
        </p>
      </div>

      {/* Tabs and search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref or service..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userRole="customer"
              onViewDetails={handleOpenDetails}
              onPayNow={handleOpenPay}
              onReview={handleOpenReview}
              onCancel={handleOpenCancel}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Bookings Found</h3>
          <p className="text-xs text-slate-500">
            No bookings found under the <span className="font-semibold">{activeTab}</span> filter.
          </p>
        </div>
      )}

      {/* Modals */}
      <BookingDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
        onPayNow={handleOpenPay}
        onCancel={handleOpenCancel}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        booking={selectedBooking}
        onPaymentComplete={() => {}}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={selectedBooking}
        onReviewSubmitted={() => {}}
      />

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        subtitle={`Booking Reference: ${selectedBooking?.bookingReference}`}
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to cancel this appointment with{' '}
            <span className="font-bold text-slate-800">{selectedBooking?.providerName}</span> on{' '}
            <span className="font-mono text-slate-800">{selectedBooking?.date}</span>?
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cancellation Reason (Optional)
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="E.g. Schedule change, resolved issue..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
