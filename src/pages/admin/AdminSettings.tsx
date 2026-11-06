import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Settings, Save, Server, Shield, FileText, RotateCcw } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const currentSettings = storageService.getSettings();
  const auditLogs = storageService.getAuditLogs();

  const [platformFee, setPlatformFee] = useState(currentSettings.platformFeePercentage);
  const [cancelHours, setCancelHours] = useState(currentSettings.allowCancellationHoursBefore);
  const [demoMode, setDemoMode] = useState(currentSettings.demoMode);
  const [apiUrl, setApiUrl] = useState(currentSettings.djangoApiUrl);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateSettings({
      platformFeePercentage: Number(platformFee),
      allowCancellationHoursBefore: Number(cancelHours),
      demoMode,
      djangoApiUrl: apiUrl,
    });

    if (user) {
      storageService.logAdminAction(
        user,
        'PLATFORM_SETTINGS_UPDATED',
        'Settings',
        'config',
        `Platform fee set to ${platformFee}%, Cancellation window set to ${cancelHours}h, Demo mode: ${demoMode}`
      );
    }

    showToast('Platform configuration saved successfully!', 'success');
  };

  const handleResetSeed = () => {
    if (window.confirm('Reset all demo data back to initial seed state? This resets bookings, reviews, and test accounts.')) {
      storageService.resetDemoData();
      showToast('All demo records reset to initial seed state.', 'info');
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Platform Settings & Architecture</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure platform business policies, fee structures, and runtime API target.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" /> Marketplace Policy Configuration
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Platform Facilitation Fee (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="1"
                required
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Retained by FindUp on each completed transaction for platform operations.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Free Cancellation Window (Hours Before Appointment)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                required
                value={cancelHours}
                onChange={(e) => setCancelHours(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Hours required before scheduled slot for unconditional penalty-free cancellation.
              </p>
            </div>

            {/* Runtime Mode Selector */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-purple-600" /> Backend Engine Mode
              </h4>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-800">Client Demo Persistence Engine</div>
                    <div className="text-[11px] text-slate-500">
                      Active: LocalStorage database with state transactions & double-booking checks
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Django REST API Endpoint Base URL
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="http://localhost:8000/api/v1"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When switching out of client demo mode, apiClient routes all calls to this DRF instance.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetSeed}
                className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Records
              </button>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Platform Policies
              </button>
            </div>
          </form>
        </div>

        {/* Right Audit Log (5 cols) */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Administrator Audit Log
            </h3>
            <span className="text-[10px] font-mono text-slate-400">{auditLogs.length} entries</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-700 font-mono text-[10px]">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">{log.details}</p>
                <div className="text-[10px] text-slate-400">By: {log.adminEmail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
