import React from 'react';
import { BookingStatus, PaymentStatus, ProviderStatus } from '../../types';

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | ProviderStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';

  if (['CONFIRMED', 'APPROVED', 'SUCCESS', 'COMPLETED'].includes(s)) {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['PENDING', 'IN_PROGRESS'].includes(s)) {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['REJECTED', 'CANCELLED', 'FAILED', 'SUSPENDED'].includes(s)) {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['REFUNDED'].includes(s)) {
    styles = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-semibold rounded-md border ${padding} ${styles}`}>
      {s.replace(/_/g, ' ')}
    </span>
  );
};
