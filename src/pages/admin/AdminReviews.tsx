import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Review } from '../../types';
import { Star, ShieldAlert, EyeOff, CheckCircle2 } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const reviews = storageService.getReviews();

  const handleToggleModerate = (rev: Review) => {
    const isNowModerated = !rev.isModerated;
    const all = storageService.getReviews();
    const idx = all.findIndex((r) => r.id === rev.id);
    if (idx !== -1) {
      all[idx].isModerated = isNowModerated;
      localStorage.setItem('fixflow_reviews', JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('fixflow_data_changed'));
    }

    if (user) {
      storageService.logAdminAction(
        user,
        isNowModerated ? 'REVIEW_HIDDEN' : 'REVIEW_RESTORED',
        'Review',
        rev.id,
        `${isNowModerated ? 'Hidden' : 'Restored'} review by ${rev.customerName} on ${rev.serviceTitle}`
      );
    }

    showToast(isNowModerated ? 'Review hidden from public listings.' : 'Review restored.', 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Review Moderation & Compliance</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor customer feedback, investigate reported content, and uphold community standards.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 text-xs">{rev.customerName}</span>
                <span className="text-slate-400 text-xs">&middot;</span>
                <span className="text-blue-600 font-semibold text-xs">{rev.serviceTitle}</span>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
                {rev.isModerated && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    HIDDEN BY ADMIN
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-2xl">
                "{rev.comment}"
              </p>

              <div className="text-[10px] text-slate-400">
                Created: {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>

            <button
              onClick={() => handleToggleModerate(rev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                rev.isModerated
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                  : 'text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              {rev.isModerated ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Restore Review
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Hide from Public
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
