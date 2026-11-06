import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { CreditCard, Search, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const payments = storageService.getPayments();

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      return (
        !searchQuery.trim() ||
        p.transactionReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.providerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [payments, searchQuery]);

  const totalProcessed = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalFeeCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.platformFee, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Payment Transactions Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable transaction records, simulated payment gateway responses, and platform fee splits.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search txn ID, booking, customer..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Total Settled GMV</div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              ${totalProcessed.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">FindUp Revenue Retained</div>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
              ${totalFeeCollected.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Txn Reference</th>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Gross</th>
                <th className="py-3 px-4 text-right">Platform Cut</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{t.transactionReference}</td>
                  <td className="py-3 px-4 text-slate-600">{t.bookingReference}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">{t.customerName}</td>
                  <td className="py-3 px-4 font-sans text-slate-700">{t.providerName}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded">
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${t.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold">
                    +${t.platformFee.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'REFUNDED'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
