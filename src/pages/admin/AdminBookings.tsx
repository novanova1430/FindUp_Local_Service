import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { Booking, BookingStatus } from '../../types';
import { StatusBadge } from '../../components/common/Badge';
import { BookingDetailsModal } from '../../components/modals/BookingDetailsModal';
import { Search, Calendar, Filter, Eye } from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const bookings = storageService.getBookings();

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Platform Bookings Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global dispatch records, scheduling audits, and resolution oversight.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
          >
            <option value="ALL">All Statuses ({bookings.length})</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Declined</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ref, customer, pro..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{b.bookingReference}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900 line-clamp-1">
                    {b.serviceTitle}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">{b.customerName}</td>
                  <td className="py-3 px-4 font-sans text-slate-700">{b.providerName}</td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {b.date} · {b.timeSlot}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    ${b.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <StatusBadge status={b.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setModalOpen(true);
                      }}
                      className="p-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BookingDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
};
