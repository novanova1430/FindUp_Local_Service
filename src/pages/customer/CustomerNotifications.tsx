import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, Calendar, CreditCard, ShieldCheck } from 'lucide-react';

export const CustomerNotifications: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const notifications = user ? storageService.getNotifications(user.id) : [];

  const handleMarkAllRead = () => {
    if (user) {
      storageService.markAllNotificationsAsRead(user.id);
      showToast('All notifications marked as read.', 'info');
    }
  };

  const handleMarkSingleRead = (id: string) => {
    storageService.markNotificationAsRead(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'approval':
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates regarding appointment confirmations, completions, and receipts.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkSingleRead(notif.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                notif.read ? 'bg-white hover:bg-slate-50/60' : 'bg-blue-50/30 hover:bg-blue-50/60'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center"></span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500">You're completely caught up with your bookings.</p>
        </div>
      )}
    </div>
  );
};
