import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DemoSwitcher } from './DemoSwitcher';
import { Wrench, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'provider') return '/provider/dashboard';
    if (role === 'customer') return '/customer/dashboard';
    return '/login';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark with Pop Hover Effect */}
          <Link to="/" className="flex items-center gap-2.5 text-[#473C33] whitespace-nowrap shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#ABC270] flex items-center justify-center text-white shadow-sm group-hover:bg-[#8FA752] group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out active:scale-95">
              <Wrench className="w-5 h-5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#473C33] leading-none">
                Find<span className="text-[#ABC270]">Up</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide leading-none mt-0.5">
                Local Services
              </span>
            </div>
          </Link>

          {/* Zone 2: 4-5 single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <Link
              to="/"
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/services') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Explore Services
            </Link>
            <Link
              to="/providers"
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
                isActive('/providers') ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Verified Providers
            </Link>
            <a
              href="#how-it-works"
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#how-it-works');
                }
              }}
            >
              How It Works
            </a>
          </nav>

          {/* Zone 3: Demo Switcher & Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Demo Persona Switcher */}
            <DemoSwitcher />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-xl border border-slate-200 p-1.5 z-50 text-slate-800">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <div className="text-xs font-bold text-slate-900 truncate">{user.fullName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1 inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {user.role.toUpperCase()}
                        </div>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        My Dashboard
                      </Link>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register/customer"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Services
          </Link>
          <Link
            to="/providers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Verified Providers
          </Link>
          {user ? (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-blue-600 bg-blue-50"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register/customer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg"
              >
                Join as Customer
              </Link>
              <Link
                to="/register/provider"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg"
              >
                Become a Service Provider
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
