import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { BookingDetailsModal } from '../../components/modals/BookingDetailsModal';
import { Calendar, Clock, MapPin, Play, CheckCircle2, XCircle, Search } from 'lucide-react';

export const ProviderBookings: React.FC = () => {
  const { providerProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const allBookings = storageService.getBookings();
  const myBookings = useMemo(() => {
    if (!providerProfile) return [];
    return allBookings.filter((b) => b.providerId === providerProfile.id);
  }, [allBookings, providerProfile]);

  const filteredBookings = useMemo(() => {
    return myBookings.filter((b) => {
      const matchTab = activeTab === 'ALL' || b.status === activeTab;
      const matchSearch =
        !searchQuery.trim() ||
        b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [myBookings, activeTab, searchQuery]);

  const handleStartService = (booking: Booking) => {
    const res = storageService.updateBookingStatus(booking.id, 'IN_PROGRESS');
    if (res.success) {
      showToast(`Job ${booking.bookingReference} status changed to IN PROGRESS.`, 'info');
    } else {
      showToast(res.error || 'Failed to update status.', 'error');
    }
  };

  const handleCompleteService = (booking: Booking) => {
    const res = storageService.updateBookingStatus(booking.id, 'COMPLETED');
    if (res.success) {
      showToast(`Service completed! Customer has been invited to leave a review.`, 'success');
    } else {
      showToast(res.error || 'Failed to update status.', 'error');
    }
  };

  const tabs = [
    { key: 'ALL', label: 'All', count: myBookings.length },
    { key: 'CONFIRMED', label: 'Confirmed', count: myBookings.filter((b) => b.status === 'CONFIRMED').length },
    { key: 'IN_PROGRESS', label: 'In Progress', count: myBookings.filter((b) => b.status === 'IN_PROGRESS').length },
    { key: 'COMPLETED', label: 'Completed', count: myBookings.filter((b) => b.status === 'COMPLETED').length },
    { key: 'CANCELLED', label: 'Cancelled', count: myBookings.filter((b) => b.status === 'CANCELLED').length },
    { key: 'REJECTED', label: 'Declined', count: myBookings.filter((b) => b.status === 'REJECTED').length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Provider Service Dispatch</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track active jobs, initiate service timers, and complete work orders.
        </p>
      </div>

      {/* Tabs and search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref or customer..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{b.bookingReference}</span>
                    <span className="text-xs text-slate-400">&middot;</span>
                    <span className="text-xs text-blue-700 font-semibold">{b.serviceCategory}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{b.serviceTitle}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={b.status} />
                  <span className="text-sm font-bold font-mono text-slate-900 ml-2">
                    ${b.serviceCharge.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Customer Details</span>
                  <div className="font-semibold text-slate-800 mt-0.5">{b.customerName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{b.customerPhone}</div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Appointment</span>
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.timeSlot}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Address</span>
                  <div className="flex items-start gap-1.5 text-slate-700 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{b.serviceAddress}, {b.serviceCity}</span>
                  </div>
                </div>
              </div>

              {b.specialInstructions && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Special Instructions:</span> "{b.specialInstructions}"
                </div>
              )}

              {/* Status workflow transitions */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSelectedBooking(b);
                    setDetailsModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  View Details
                </button>

                <div className="flex items-center gap-2">
                  {b.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleStartService(b)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" /> Start Service
                    </button>
                  )}

                  {b.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleCompleteService(b)}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Completed
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Finished & Earned
                    </span>
                  )}
                </div>
              </div>
            </div>
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

      <BookingDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
};
