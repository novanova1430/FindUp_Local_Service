import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-50',
  trend,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {value}
          </div>
          {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};
