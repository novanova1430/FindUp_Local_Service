import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Settings, Lock, Bell, Shield, Save } from 'lucide-react';

export const ProviderSettings: React.FC = () => {
  const { providerProfile } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsDispatch: true,
    weeklyDigest: false,
  });

  const [passwordState, setPasswordState] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Notification dispatch preferences updated.', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    showToast('Password updated successfully (Demo simulation).', 'success');
    setPasswordState({ newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Provider Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure security, dispatch alerts, and partner account status.
        </p>
      </div>

      {/* Account Status Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-600" /> Platform Verification Status
        </h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <div className="font-semibold text-slate-800">
              Account Registration Status:{' '}
              <span className="font-mono text-emerald-700 font-bold ml-1">
                {providerProfile?.status || 'APPROVED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Verified by FindUp Compliance team. Licensed for commercial and residential dispatch.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Dispatch Notifications */}
      <form
        onSubmit={handleSaveNotifications}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" /> Dispatch Alerts & Notifications
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">Instant Email Notifications</div>
              <div className="text-[11px] text-slate-500">Receive booking requests and reschedules in your inbox</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900">SMS Appointment Reminders</div>
              <div className="text-[11px] text-slate-500">Get text message 2 hours before scheduled slot</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsDispatch}
              onChange={(e) => setNotifications({ ...notifications, smsDispatch: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save Preferences
          </button>
        </div>
      </form>

      {/* Password Form */}
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" /> Change Security Password
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={passwordState.newPassword}
              onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
              placeholder="At least 6 characters"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={passwordState.confirmPassword}
              onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
              placeholder="Repeat password"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};
