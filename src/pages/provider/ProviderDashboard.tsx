import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import {
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  Star,
  Inbox,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const { user, providerProfile } = useAuth();
  const navigate = useNavigate();

  const allBookings = storageService.getBookings();
  const myBookings = useMemo(() => {
    if (!providerProfile) return [];
    return allBookings.filter((b) => b.providerId === providerProfile.id);
  }, [allBookings, providerProfile]);

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = myBookings.length;
    const pending = myBookings.filter((b) => b.status === 'PENDING').length;
    const confirmed = myBookings.filter((b) => b.status === 'CONFIRMED').length;
    const completed = myBookings.filter((b) => b.status === 'COMPLETED').length;
    const cancelled = myBookings.filter((b) => b.status === 'CANCELLED' || b.status === 'REJECTED').length;

    // Gross completed service value minus 10% platform fee
    const grossEarnings = myBookings
      .filter((b) => b.status === 'COMPLETED')
      .reduce((acc, b) => acc + b.serviceCharge, 0);
    const platformFee = Number((grossEarnings * 0.1).toFixed(2));
    const netEarnings = Number((grossEarnings - platformFee).toFixed(2));

    return { total, pending, confirmed, completed, cancelled, netEarnings };
  }, [myBookings]);

  const pendingRequests = myBookings.filter((b) => b.status === 'PENDING').slice(0, 3);
  const upcomingAppointments = myBookings
    .filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))
    .slice(0, 3);

  const reviews = providerProfile ? storageService.getReviewsByProviderId(providerProfile.id).slice(0, 3) : [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Specialist Operations Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {providerProfile?.fullName || 'Specialist'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Manage incoming dispatch requests, accept customer appointments, and review net demo payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/provider/availability')}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Update Availability
          </button>
          <button
            onClick={() => navigate('/provider/services')}
            className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
          >
            Manage Services
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          subtitle="All platform jobs"
          icon={Calendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          subtitle="Awaiting your response"
          icon={Inbox}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Net Earnings"
          value={`$${stats.netEarnings.toFixed(2)}`}
          subtitle="After 10% platform fee"
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Average Rating"
          value={`${providerProfile?.rating.toFixed(1) || '5.0'} ★`}
          subtitle={`${providerProfile?.reviewCount || 0} verified reviews`}
          icon={Star}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Pending Requests Alert section */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Inbox className="w-4 h-4 text-amber-600" />
              <span>Incoming Booking Requests ({stats.pending})</span>
            </div>
            <Link
              to="/provider/requests"
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1"
            >
              Review All Requests <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span>{req.bookingReference}</span>
                    <span className="font-bold text-slate-900">${req.serviceCharge}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{req.serviceTitle}</h4>
                  <div className="text-[11px] text-slate-600 mt-1">Customer: {req.customerName}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {req.date} · {req.timeSlot}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate('/provider/requests')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Grid: Upcoming Appointments & Customer Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Confirmed Appointments */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Confirmed Appointments</h2>
              <p className="text-xs text-slate-500">Upcoming schedule ready for service execution</p>
            </div>
            <Link
              to="/provider/bookings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800">{appt.bookingReference}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {appt.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{appt.serviceTitle}</h4>
                  <div className="text-xs text-slate-600">
                    Client: <span className="font-semibold text-slate-800">{appt.customerName}</span> ·{' '}
                    {appt.serviceAddress}, {appt.serviceCity}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-mono text-slate-600">
                      {appt.date} · {appt.timeSlot}
                    </span>
                    <span className="font-mono font-bold text-slate-900">${appt.serviceCharge.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No confirmed appointments scheduled.
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Recent Customer Reviews */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Customer Reviews</h2>
              <p className="text-xs text-slate-500">Verified feedback from completed jobs</p>
            </div>
            <Link
              to="/provider/reviews"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Reviews <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-bold text-slate-800">{rev.customerName}</div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  <div className="text-[10px] text-slate-400">
                    {rev.serviceTitle} &middot; {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              No reviews received yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
