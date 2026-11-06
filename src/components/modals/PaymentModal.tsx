import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Booking, PaymentMethod } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { CreditCard, QrCode, Banknote, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPaymentComplete: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPaymentComplete,
}) => {
  const { showToast } = useToast();
  const [method, setMethod] = useState<PaymentMethod>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!booking) return null;

  const handleSimulate = (simulateSuccess: boolean) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = storageService.simulatePayment(booking.id, method, simulateSuccess);
      setIsProcessing(false);

      if (res.success) {
        showToast(
          `Demo Payment Successful! Ref: ${res.transaction?.transactionReference}`,
          'success'
        );
        onPaymentComplete();
        onClose();
      } else {
        showToast(`Demo Payment Failed: ${res.error}`, 'error');
        onPaymentComplete();
      }
    }, 700);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Demo Payment"
      subtitle={`Booking Reference: ${booking.bookingReference}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Important Demo Mode Notice Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="leading-relaxed">
            <span className="font-bold">DEMO PAYMENT SIMULATOR:</span> No real card details, banking PINs, or money
            are ever collected or charged. This interface simulates full transaction ledger records for portfolio
            testing.
          </div>
        </div>

        {/* Booking Summary */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Service:</span>
            <span className="font-semibold text-slate-800">{booking.serviceTitle}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Provider:</span>
            <span className="font-semibold text-slate-800">{booking.providerName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Date & Time:</span>
            <span className="text-slate-800 font-mono">
              {booking.date} · {booking.timeSlot}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
            <span>Total Payable:</span>
            <span className="font-mono text-base text-blue-600">
              ${booking.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Method selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Demo Payment Channel
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setMethod('CARD')}
              className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                method === 'CARD'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-semibold">Demo Card</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('UPI')}
              className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                method === 'UPI'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-semibold">Demo UPI</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('CASH')}
              className={`p-3 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                method === 'CASH'
                  ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Banknote className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-semibold">Pay On Service</span>
            </button>
          </div>
        </div>

        {/* Simulated input fields (purely cosmetic to demonstrate real-world UI design) */}
        {method === 'CARD' && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="text-[11px] font-semibold text-slate-500">Demo Card Placeholder</div>
            <div className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
              •••• •••• •••• 4242 &nbsp;|&nbsp; Exp: 12/28 &nbsp;|&nbsp; CVV: •••
            </div>
          </div>
        )}

        {method === 'UPI' && (
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
            <div className="text-[11px] font-semibold text-slate-500">Demo Virtual Payment Address (VPA)</div>
            <div className="font-mono text-slate-700 bg-white p-2 rounded border border-slate-200">
              findup.demo@instantpay
            </div>
          </div>
        )}

        {/* Simulation Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            disabled={isProcessing}
            onClick={() => handleSimulate(true)}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isProcessing ? 'Processing Transaction...' : 'Simulate Successful Payment'}
          </button>

          <button
            disabled={isProcessing}
            onClick={() => handleSimulate(false)}
            className="py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Simulate Failure
          </button>
        </div>
      </div>
    </Modal>
  );
};
