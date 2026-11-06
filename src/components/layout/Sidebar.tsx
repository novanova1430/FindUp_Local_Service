import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import {
  Wrench,
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Heart,
  Star,
  Bell,
  User,
  Settings,
  Inbox,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  ShieldCheck,
  FolderTree,
  CreditCard,
  FileText,
  AlertTriangle,
  LogOut,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  role: 'customer' | 'provider' | 'admin';
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen, onClose }) => {
  const { user, logout, providerProfile } = useAuth();
  const navigate = useNavigate();

  // Calculate live badge counts
  const unreadNotifs = user ? storageService.getNotifications(user.id).filter((n) => !n.read).length : 0;
  const pendingRequestsCount =
    role === 'provider' && providerProfile
      ? storageService.getBookings().filter((b) => b.providerId === providerProfile.id && b.status === 'PENDING').length
      : 0;
  const pendingProvidersCount =
    role === 'admin' ? storageService.getProviders().filter((p) => p.status === 'PENDING').length : 0;

  const customerNav = [
    { label: 'Overview', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'Browse Services', path: '/customer/services', icon: Briefcase },
    { label: 'Book Appointment', path: '/customer/bookings/new', icon: PlusCircle },
    { label: 'My Bookings', path: '/customer/bookings', icon: Calendar },
    { label: 'Saved Favorites', path: '/customer/favorites', icon: Heart },
    { label: 'My Reviews', path: '/customer/reviews', icon: Star },
    { label: 'Notifications', path: '/customer/notifications', icon: Bell, badge: unreadNotifs },
    { label: 'Profile & Address', path: '/customer/profile', icon: User },
  ];

  const providerNav = [
    { label: 'Overview', path: '/provider/dashboard', icon: LayoutDashboard },
    { label: 'Booking Requests', path: '/provider/requests', icon: Inbox, badge: pendingRequestsCount },
    { label: 'Appointments', path: '/provider/bookings', icon: Calendar },
    { label: 'My Services', path: '/provider/services', icon: Briefcase },
    { label: 'Availability', path: '/provider/availability', icon: Clock },
    { label: 'Earnings', path: '/provider/earnings', icon: DollarSign },
    { label: 'Reviews', path: '/provider/reviews', icon: Star },
    { label: 'Public Profile', path: '/provider/profile', icon: User },
    { label: 'Notifications', path: '/provider/notifications', icon: Bell, badge: unreadNotifs },
    { label: 'Settings', path: '/provider/settings', icon: Settings },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Providers', path: '/admin/providers', icon: ShieldCheck, badge: pendingProvidersCount },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'All Services', path: '/admin/services', icon: Briefcase },
    { label: 'All Bookings', path: '/admin/bookings', icon: Calendar },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reviews & Issues', path: '/admin/reviews', icon: AlertTriangle },
    { label: 'Reports & Export', path: '/admin/reports', icon: FileText },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminNav : role === 'provider' ? providerNav : customerNav;

  const roleTitle =
    role === 'admin' ? 'Administrator' : role === 'provider' ? 'Service Provider' : 'Customer Account';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out active:scale-95">
              <Wrench className="w-4 h-4 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none group-hover:text-blue-400 transition-colors">
                Find<span className="text-blue-400">Up</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase leading-none mt-1">
                {roleTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path.endsWith('/dashboard')}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </div>

        {/* User bar & footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-2 py-1.5">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.fullName}</div>
                <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Link
              to="/"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              title="Return to Public Home"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Website
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-md transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
