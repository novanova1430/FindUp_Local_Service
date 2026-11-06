import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Download, FileText, Calendar, DollarSign, Users, ShieldCheck } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('bookings');

  const bookings = storageService.getBookings();
  const providers = storageService.getProviders();
  const customers = storageService.getUsers().filter((u) => u.role === 'customer');
  const payments = storageService.getPayments();

  const handleExport = (type: string) => {
    let rows: string[][] = [];
    let filename = `fixflow_${type}_report.csv`;

    if (type === 'bookings') {
      rows = [
        ['Booking Reference', 'Customer', 'Provider', 'Service', 'Date', 'Time Slot', 'Amount', 'Status', 'Payment'],
        ...bookings.map((b) => [
          b.bookingReference,
          b.customerName,
          b.providerName,
          b.serviceTitle,
          b.date,
          b.timeSlot,
          b.totalAmount.toFixed(2),
          b.status,
          b.paymentStatus,
        ]),
      ];
    } else if (type === 'providers') {
      rows = [
        ['Provider Name', 'Email', 'Phone', 'Title', 'Category', 'Experience', 'City', 'Status', 'Rating'],
        ...providers.map((p) => [
          p.fullName,
          p.email,
          p.phone,
          p.title,
          p.category,
          String(p.experienceYears),
          p.serviceCity,
          p.status,
          p.rating.toFixed(1),
        ]),
      ];
    } else if (type === 'revenue') {
      rows = [
        ['Transaction ID', 'Booking Ref', 'Customer', 'Amount', 'Platform Cut (10%)', 'Net Provider', 'Method', 'Status', 'Date'],
        ...payments.map((p) => [
          p.transactionReference,
          p.bookingReference,
          p.customerName,
          p.amount.toFixed(2),
          p.platformFee.toFixed(2),
          p.providerShare.toFixed(2),
          p.paymentMethod,
          p.status,
          new Date(p.createdAt).toLocaleDateString(),
        ]),
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filename} successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Analytics & Data Export</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Generate comprehensive audit exports and business intelligence sheets in CSV format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Full Bookings Ledger</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete CSV containing reference IDs, service packages, customer addresses, schedule timestamps, and
              cancellation statuses.
            </p>
          </div>
          <button
            onClick={() => handleExport('bookings')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export Bookings CSV
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Provider Compliance Directory</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export specialist certification states, approval timestamps, rating averages, review volumes, and covered
              districts.
            </p>
          </div>
          <button
            onClick={() => handleExport('providers')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export Providers CSV
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Revenue & Fee Reconciliation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export all payment transactions with gross charges, 10% platform cuts, net provider disbursements, and
              gateway methods.
            </p>
          </div>
          <button
            onClick={() => handleExport('revenue')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export Revenue CSV
          </button>
        </div>
      </div>
    </div>
  );
};
