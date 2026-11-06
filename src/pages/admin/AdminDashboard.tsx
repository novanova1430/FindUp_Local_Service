import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import {
  Users,
  ShieldCheck,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
  FolderTree,
  AlertTriangle,
  FileText,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const users = storageService.getUsers();
  const providers = storageService.getProviders();
  const bookings = storageService.getBookings();
  const payments = storageService.getPayments();
  const categories = storageService.getCategories();
  const auditLogs = storageService.getAuditLogs().slice(0, 5);

  const customers = users.filter((u) => u.role === 'customer');
  const pendingProviders = providers.filter((p) => p.status === 'PENDING');
  const approvedProviders = providers.filter((p) => p.status === 'APPROVED');

  const stats = useMemo(() => {
    const totalRevenue = payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);

    const platformCut = payments
      .filter((p) => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.platformFee, 0);

    return {
      customersCount: customers.length,
      providersCount: providers.length,
      pendingProvidersCount: pendingProviders.length,
      bookingsCount: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
      completedBookings: bookings.filter((b) => b.status === 'COMPLETED').length,
      totalRevenue,
      platformCut,
    };
  }, [customers, providers, pendingProviders, bookings, payments]);

  // Recent activity feed
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Super Administrator Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            FindUp Platform Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Monitor platform-wide dispatch, verify provider trade licenses, and oversee financial volume.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/providers"
            className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md transition-colors flex items-center gap-2"
          >
            <span>Review Applications</span>
            {pendingProviders.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-purple-900 flex items-center justify-center text-[10px] font-mono">
                {pendingProviders.length}
              </span>
            )}
          </Link>
          <Link
            to="/admin/reports"
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Customers"
          value={stats.customersCount}
          subtitle="Registered accounts"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Verified Providers"
          value={approvedProviders.length}
          subtitle={`${stats.pendingProvidersCount} awaiting approval`}
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Platform Jobs"
          value={stats.bookingsCount}
          subtitle={`${stats.completedBookings} completed successfully`}
          icon={Calendar}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Demo GMV Volume"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          subtitle={`$${stats.platformCut.toFixed(2)} net platform cut`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Pending Provider Approvals Alert Banner */}
      {pendingProviders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-900">
                {pendingProviders.length} Provider Application(s) Awaiting Review
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                New trade specialists have submitted their licensing credentials. Verification required before they
                appear on public listings.
              </p>
            </div>
          </div>
          <Link
            to="/admin/providers"
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shrink-0 text-center"
          >
            Review & Approve Now &rarr;
          </Link>
        </div>
      )}

      {/* 2-Column Section: Category Distribution & Recent Platform Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Recent Bookings Audit */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Platform Bookings</h2>
              <p className="text-xs text-slate-500">Live service transactions across Metro City</p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({bookings.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.bookingReference}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 line-clamp-1">{b.serviceTitle}</td>
                    <td className="py-3 px-3 text-slate-600">{b.customerName}</td>
                    <td className="py-3 px-3 text-slate-600">{b.providerName}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ${b.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (5 cols): Categories Breakdown & Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Categories Popularity */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-600" /> Active Service Categories
              </h3>
              <Link to="/admin/categories" className="text-xs text-blue-600 font-semibold hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <div key={cat.id} className="flex items-center justify-between text-xs py-1">
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400">
                      {storageService.getServices().filter((s) => s.category === cat.name).length} services
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log Snippet */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Administrator Audit Trail
            </h3>

            {auditLogs.length > 0 ? (
              <div className="space-y-3 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="font-bold text-purple-700">{log.action}</span>
                      <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No actions recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
