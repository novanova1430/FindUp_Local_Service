import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatCard } from '../../components/common/StatCard';
import { DollarSign, CreditCard, ShieldAlert, Download, ArrowUpRight } from 'lucide-react';

export const ProviderEarnings: React.FC = () => {
  const { providerProfile } = useAuth();

  const allPayments = storageService.getPayments();
  const myTransactions = useMemo(() => {
    if (!providerProfile) return [];
    return allPayments.filter((p) => p.providerId === providerProfile.id);
  }, [allPayments, providerProfile]);

  const allBookings = storageService.getBookings();
  const myCompletedBookings = useMemo(() => {
    if (!providerProfile) return [];
    return allBookings.filter((b) => b.providerId === providerProfile.id && b.status === 'COMPLETED');
  }, [allBookings, providerProfile]);

  // Calculations
  const grossCompleted = myCompletedBookings.reduce((sum, b) => sum + b.serviceCharge, 0);
  const platformFees = Number((grossCompleted * 0.1).toFixed(2));
  const netEarnings = Number((grossCompleted - platformFees).toFixed(2));

  const pendingPaymentsAmount = allBookings
    .filter(
      (b) =>
        b.providerId === providerProfile?.id &&
        b.paymentStatus === 'PENDING' &&
        b.status !== 'CANCELLED'
    )
    .reduce((sum, b) => sum + b.serviceCharge, 0);

  const handleExportCsv = () => {
    const rows = [
      ['Transaction Reference', 'Booking Reference', 'Customer', 'Gross Amount', 'Platform Fee (10%)', 'Net Provider Share', 'Date', 'Status'],
      ...myTransactions.map((t) => [
        t.transactionReference,
        t.bookingReference,
        t.customerName,
        t.amount.toFixed(2),
        t.platformFee.toFixed(2),
        t.providerShare.toFixed(2),
        new Date(t.createdAt).toLocaleDateString(),
        t.status,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fixflow_earnings_${providerProfile?.fullName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Earnings & Financial Statements</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track gross billings, 10% platform facilitation fee deduction, and net earnings.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Demo notice */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">DEMO FINANCIAL LEDGER:</span> These figures represent calculated simulated
          records based on completed jobs. No real bank accounts or funds transfers are executed.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Gross Completed Value"
          value={`$${grossCompleted.toFixed(2)}`}
          subtitle="All finished services"
          icon={DollarSign}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Platform Facilitation (10%)"
          value={`$${platformFees.toFixed(2)}`}
          subtitle="FindUp service fee"
          icon={CreditCard}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Net Demo Earnings"
          value={`$${netEarnings.toFixed(2)}`}
          subtitle="Ready for payout release"
          icon={ArrowUpRight}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Pending Receivables"
          value={`$${pendingPaymentsAmount.toFixed(2)}`}
          subtitle="Booked but unsettled"
          icon={DollarSign}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Payment Transaction Records</h2>
          <span className="text-xs text-slate-400 font-mono">{myTransactions.length} transactions</span>
        </div>

        {myTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Booking</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-right">Gross</th>
                  <th className="py-3 px-4 text-right">Fee (10%)</th>
                  <th className="py-3 px-4 text-right">Net Share</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {myTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{tx.transactionReference}</td>
                    <td className="py-3 px-4 text-slate-600">{tx.bookingReference}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-800">{tx.customerName}</td>
                    <td className="py-3 px-4 text-right text-slate-700">${tx.amount.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-rose-600">-${tx.platformFee.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      ${tx.providerShare.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No completed payment transactions recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
