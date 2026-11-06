import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DemoSwitcher } from './DemoSwitcher';
import { Menu, Shield, ArrowLeft } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.split('/').filter(Boolean);
  const pageTitle = currentPath[currentPath.length - 1]
    ? currentPath[currentPath.length - 1].replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    : 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar role="admin" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dedicated Previous Page Back Button */}
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate('/admin/dashboard');
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#473C33] bg-[#FEC868] hover:bg-[#FDA769] border border-amber-300/80 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer group shrink-0 active:scale-95"
              title="Go back to previous page (முந்தைய பக்கம்)"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#473C33] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                <Shield className="w-3.5 h-3.5" /> Super Admin
              </span>
              <span>/</span>
              <Link to="/admin/dashboard" className="font-medium text-slate-400 hover:text-blue-600 transition-colors">
                Admin
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DemoSwitcher />
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
