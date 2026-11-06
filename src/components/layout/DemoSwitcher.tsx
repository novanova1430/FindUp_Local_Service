import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, UserCheck, Briefcase, RotateCcw, Server, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoSwitcher: React.FC = () => {
  const { user, role, quickSwitch } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const settings = storageService.getSettings();

  const handleSwitch = (target: 'customer' | 'provider' | 'admin' | 'guest') => {
    quickSwitch(target);
    setIsOpen(false);
    if (target === 'customer') {
      showToast('Switched to Demo Customer: David Miller', 'info');
      navigate('/customer/dashboard');
    } else if (target === 'provider') {
      showToast('Switched to Demo Provider: Sarah Jenkins (Plumber)', 'info');
      navigate('/provider/dashboard');
    } else if (target === 'admin') {
      showToast('Switched to Demo Administrator', 'info');
      navigate('/admin/dashboard');
    } else {
      showToast('Logged out to Guest Mode', 'info');
      navigate('/');
    }
  };

  const handleResetData = () => {
    storageService.resetDemoData();
    showToast('Demo dataset has been restored to default seed!', 'success');
    setIsOpen(false);
  };

  const currentLabel =
    role === 'admin'
      ? 'Admin (Full Access)'
      : role === 'provider'
      ? 'Provider (Sarah J.)'
      : role === 'customer'
      ? 'Customer (David M.)'
      : 'Guest / Visitor';

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0"
        title="Quick Role Switcher for Evaluators"
      >
        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
        <span className="font-mono text-[11px] text-blue-700">ROLE:</span>
        <span>{currentLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-blue-700" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl border border-slate-200 p-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">Demo Role Switcher</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Instantly test any portal with verified credentials
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => handleSwitch('customer')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  role === 'customer' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Customer Portal</div>
                    <div className="text-[10px] text-slate-400">customer@fixflow.demo</div>
                  </div>
                </div>
                {role === 'customer' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleSwitch('provider')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  role === 'provider' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-medium">Provider Portal</div>
                    <div className="text-[10px] text-slate-400">provider@fixflow.demo</div>
                  </div>
                </div>
                {role === 'provider' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleSwitch('admin')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  role === 'admin' ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Admin Portal</div>
                    <div className="text-[10px] text-slate-400">admin@fixflow.demo</div>
                  </div>
                </div>
                {role === 'admin' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                onClick={() => handleSwitch('guest')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                  !user ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">
                    G
                  </div>
                  <div>
                    <div className="font-medium">Public / Guest Mode</div>
                    <div className="text-[10px] text-slate-400">Unauthenticated visitor</div>
                  </div>
                </div>
                {!user && <Check className="w-4 h-4 text-slate-700" />}
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 py-1 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-400" /> Engine:
                </span>
                <span className="font-mono text-emerald-700 font-medium">Local Browser Seed</span>
              </div>
              <button
                onClick={handleResetData}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-left"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Demo Data
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
