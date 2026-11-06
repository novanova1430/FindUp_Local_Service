import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Clock, Calendar, Check, Save, Lock, AlertCircle } from 'lucide-react';

export const ProviderAvailability: React.FC = () => {
  const { providerProfile } = useAuth();
  const { showToast } = useToast();

  const [workingDays, setWorkingDays] = useState<number[]>(
    providerProfile?.workingHours.workingDays || [1, 2, 3, 4, 5]
  );
  const [startTime, setStartTime] = useState(providerProfile?.workingHours.start || '08:00');
  const [endTime, setEndTime] = useState(providerProfile?.workingHours.end || '18:00');
  const [slotDuration, setSlotDuration] = useState(
    providerProfile?.workingHours.slotDurationMinutes || 90
  );
  const [blockedDates, setBlockedDates] = useState<string[]>(
    providerProfile?.blockedDates || ['2026-11-20']
  );
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Fetch confirmed and pending bookings for this provider to show current commitments
  const allBookings = storageService.getBookings();
  const activeBookings = providerProfile
    ? allBookings.filter(
        (b) => b.providerId === providerProfile.id && ['CONFIRMED', 'PENDING', 'IN_PROGRESS'].includes(b.status)
      )
    : [];

  const daysOfWeek = [
    { index: 0, label: 'Sunday' },
    { index: 1, label: 'Monday' },
    { index: 2, label: 'Tuesday' },
    { index: 3, label: 'Wednesday' },
    { index: 4, label: 'Thursday' },
    { index: 5, label: 'Friday' },
    { index: 6, label: 'Saturday' },
  ];

  const toggleDay = (index: number) => {
    if (workingDays.includes(index)) {
      setWorkingDays(workingDays.filter((d) => d !== index));
    } else {
      setWorkingDays([...workingDays, index].sort());
    }
  };

  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      showToast('Date already blocked.', 'info');
      return;
    }
    setBlockedDates([...blockedDates, newBlockedDate].sort());
    setNewBlockedDate('');
    showToast(`Date ${newBlockedDate} added to blocked calendar.`, 'info');
  };

  const handleRemoveBlockedDate = (date: string) => {
    setBlockedDates(blockedDates.filter((d) => d !== date));
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerProfile) return;

    storageService.updateProvider(providerProfile.id, {
      workingHours: {
        start: startTime,
        end: endTime,
        workingDays,
        slotDurationMinutes: slotDuration,
      },
      blockedDates,
    });

    showToast('Weekly schedule & availability saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Availability & Dispatch Schedule</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure active working days, daily hours, slot intervals, and blackout dates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left (8 cols): Schedule Form */}
        <div className="md:col-span-8 space-y-6">
          <form
            onSubmit={handleSaveSchedule}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6"
          >
            {/* Working days */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Active Working Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => {
                  const isChecked = workingDays.includes(day.index);
                  return (
                    <button
                      key={day.index}
                      type="button"
                      onClick={() => toggleDay(day.index)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <span>{day.label}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Slot Interval (Min)
                </label>
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
                >
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes (Recommended)</option>
                  <option value={120}>120 Minutes</option>
                  <option value={180}>180 Minutes</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Working Schedule
              </button>
            </div>
          </form>

          {/* Block Specific Dates */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Block Specific Unavailable Dates (Vacation/Off-days)
            </h3>

            <form onSubmit={handleAddBlockedDate} className="flex gap-2">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-slate-800"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors"
              >
                Block Date
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {blockedDates.map((date) => (
                <span
                  key={date}
                  className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2"
                >
                  <span>{date}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="text-rose-400 hover:text-rose-700 font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right (4 cols): Current Confirmed Slots */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" /> Currently Booked Slots ({activeBookings.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              The platform automatically locks these slots from public booking.
            </p>

            {activeBookings.length > 0 ? (
              <div className="space-y-2 pt-1 max-h-80 overflow-y-auto">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="font-semibold text-slate-800">{b.customerName}</div>
                    <div className="font-mono text-slate-600 text-[11px]">
                      {b.date} · {b.timeSlot}
                    </div>
                    <div className="text-[10px] text-blue-600 font-medium">{b.serviceTitle}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">No active commitments booked.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
