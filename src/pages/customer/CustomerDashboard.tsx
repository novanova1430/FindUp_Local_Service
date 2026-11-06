import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import { BookingCard } from '../../components/cards/BookingCard';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { ServiceCard } from '../../components/cards/ServiceCard';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, customerProfile } = useAuth();
  const navigate = useNavigate();

  const allBookings = storageService.getBookings();
  const myBookings = useMemo(() => {
    if (!user) return [];
    return allBookings.filter((b) => b.customerId === user.id);
  }, [allBookings, user]);

  // Dynamic statistics calculated directly from booking records
  const stats = useMemo(() => {
    return {
      total: myBookings.length,
      pending: myBookings.filter((b) => b.status === 'PENDING').length,
      confirmed: myBookings.filter((b) => b.status === 'CONFIRMED').length,
      inProgress: myBookings.filter((b) => b.status === 'IN_PROGRESS').length,
      completed: myBookings.filter((b) => b.status === 'COMPLETED').length,
      cancelled: myBookings.filter((b) => b.status === 'CANCELLED').length,
    };
  }, [myBookings]);

  // Upcoming appointment (confirmed or pending, closest future date)
  const upcomingBooking = useMemo(() => {
    return myBookings
      .filter((b) => ['CONFIRMED', 'PENDING', 'IN_PROGRESS'].includes(b.status))
      .sort((a, b) => a.date.localeCompare(b.date))[0];
  }, [myBookings]);

  const recentBookings = myBookings.slice(0, 3);

  // Recommended services
  const recommendedServices = storageService.getServices().filter((s) => s.isActive).slice(0, 3);

  // Favorite providers
  const favoriteProviderIds = customerProfile?.favoriteProviderIds || [];
  const favoriteProviders = storageService
    .getProviders()
    .filter((p) => favoriteProviderIds.includes(p.id));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Customer Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'David'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Track appointments, inspect job completion, and book verified service specialists across Metro City.
          </p>
        </div>

        <button
          onClick={() => navigate('/customer/bookings/new')}
          className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-blue-900 bg-white hover:bg-blue-50 shadow-md transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Book New Service</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          subtitle="All platform requests"
          icon={Calendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          subtitle="Awaiting provider accept"
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="Confirmed Jobs"
          value={stats.confirmed + stats.inProgress}
          subtitle="Ready for arrival"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Completed Jobs"
          value={stats.completed}
          subtitle="Verified & finished"
          icon={CheckCircle2}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Upcoming appointment callout if present */}
      {upcomingBooking && (
        <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs bg-gradient-to-r from-blue-50/40 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  Upcoming Appointment
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {upcomingBooking.serviceTitle}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>With {upcomingBooking.providerName}</span>
                  <span>&middot;</span>
                  <span className="font-mono text-slate-700 font-semibold">{upcomingBooking.date}</span>
                  <span>&middot;</span>
                  <span>{upcomingBooking.timeSlot}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/customer/bookings"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                Manage Appointment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Service Bookings</h2>
            <p className="text-xs text-slate-500">Your latest appointment requests and service status</p>
          </div>
          <Link
            to="/customer/bookings"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            All Bookings ({myBookings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onViewDetails={() => navigate('/customer/bookings')}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">You haven't scheduled any services yet.</p>
            <button
              onClick={() => navigate('/customer/bookings/new')}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
            >
              Book Your First Service
            </button>
          </div>
        )}
      </div>

      {/* Recommended Services Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended Services for Your Home</h2>
            <p className="text-xs text-slate-500">Popular maintenance & repair packages</p>
          </div>
          <Link
            to="/customer/services"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Explore All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Favorite Providers */}
      {favoriteProviders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Saved Favorite Specialists</h2>
              <p className="text-xs text-slate-500">Quickly re-book your preferred verified providers</p>
            </div>
            <Link
              to="/customer/favorites"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({favoriteProviders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} isFavorite={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
