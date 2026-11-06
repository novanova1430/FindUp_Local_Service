import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ServiceItem, ProviderProfile } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  Check,
  Lock,
} from 'lucide-react';

const STANDARD_TIME_SLOTS = [
  '08:30 AM - 10:00 AM',
  '10:00 AM - 11:30 AM',
  '11:30 AM - 01:00 PM',
  '01:30 PM - 03:00 PM',
  '03:00 PM - 04:30 PM',
  '04:30 PM - 06:00 PM',
];

export const BookingWizard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, customerProfile } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);

  // Pre-selection from query params if passed
  const initialServiceId = searchParams.get('serviceId') || '';
  const initialProviderId = searchParams.get('providerId') || '';

  const allServices = storageService.getServices().filter((s) => s.isActive);
  const approvedProviders = storageService.getProviders().filter((p) => p.status === 'APPROVED');
  const categories = storageService.getCategories();

  // Wizard State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Address State (pre-filled from customer profile)
  const [addressData, setAddressData] = useState({
    customerName: user?.fullName || 'David Miller',
    customerPhone: user?.phone || '+1 (555) 321-9844',
    address: customerProfile?.address || '742 Evergreen Terrace, Apt 4B',
    city: customerProfile?.city || 'Metro City',
    pincode: customerProfile?.pincode || '94016',
    specialInstructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Auto initialize if query params given
  useEffect(() => {
    if (initialServiceId) {
      const foundSrv = allServices.find((s) => s.id === initialServiceId);
      if (foundSrv) {
        setSelectedService(foundSrv);
        setSelectedCategory(foundSrv.category);
      }
    }
    if (initialProviderId) {
      const foundProv = approvedProviders.find((p) => p.id === initialProviderId);
      if (foundProv) {
        setSelectedProvider(foundProv);
      }
    }
  }, [initialServiceId, initialProviderId]);

  // Generate valid next 14 calendar dates (excluding past dates)
  const availableDates = useMemo(() => {
    const dates: { dateString: string; display: string; dayOfWeek: number }[] = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const display = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      dates.push({ dateString, display, dayOfWeek: d.getDay() });
    }
    return dates;
  }, []);

  // Compute available slots dynamically based on existing bookings and double-booking checks!
  const slotsAvailability = useMemo(() => {
    if (!selectedProvider || !selectedDate) return [];

    return STANDARD_TIME_SLOTS.map((slot) => {
      const isAvailable = storageService.checkSlotAvailable(selectedProvider.id, selectedDate, slot);
      return {
        slot,
        isAvailable,
      };
    });
  }, [selectedProvider, selectedDate]);

  // Pricing calculations
  const serviceCharge = selectedService?.price || selectedProvider?.startingPrice || 85;
  const platformFee = Number((serviceCharge * 0.1).toFixed(2));
  const totalAmount = Number((serviceCharge + platformFee).toFixed(2));

  // Step 7: Confirm Booking
  const handleConfirmBooking = () => {
    if (!user) {
      showToast('Please sign in to confirm this booking.', 'error');
      navigate('/login');
      return;
    }
    if (!selectedService || !selectedProvider || !selectedDate || !selectedTimeSlot) {
      showToast('Please complete all booking steps.', 'error');
      return;
    }

    setBookingError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = storageService.createBooking({
        customerId: user.id,
        customerName: addressData.customerName,
        customerEmail: user.email,
        customerPhone: addressData.customerPhone,
        providerId: selectedProvider.id,
        providerName: selectedProvider.fullName,
        providerTitle: selectedProvider.title,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        serviceCategory: selectedService.category,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        serviceAddress: addressData.address,
        serviceCity: addressData.city,
        servicePincode: addressData.pincode,
        specialInstructions: addressData.specialInstructions,
        serviceCharge,
        platformFee,
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      });

      setIsSubmitting(false);

      if (res.success && res.booking) {
        showToast(
          `Booking ${res.booking.bookingReference} confirmed! Provider notified.`,
          'success'
        );
        navigate(`/customer/bookings`);
      } else {
        setBookingError(res.error || 'Double-booking conflict detected. Slot is no longer available.');
      }
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/customer/services');
            }
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-blue-600 rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer group"
          title="Go back (முந்தைய படி / பக்கம்)"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>{step > 1 ? `Back to Step ${step - 1}` : 'Back to Services'}</span>
        </button>

        <span className="text-xs font-semibold text-slate-400">Step {step} of 6</span>
      </div>

      {/* Wizard Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Book a Verified Service</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete the guided steps below to reserve your specialist appointment.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Service' },
            { num: 2, label: 'Provider' },
            { num: 3, label: 'Date' },
            { num: 4, label: 'Time' },
            { num: 5, label: 'Address' },
            { num: 6, label: 'Review' },
          ].map((st) => (
            <div key={st.num} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-colors ${
                  step === st.num
                    ? 'bg-blue-600 text-white shadow-sm'
                    : step > st.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
              </div>
              <span
                className={`text-[10px] hidden sm:inline ${
                  step === st.num ? 'font-bold text-blue-700' : 'text-slate-500'
                }`}
              >
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {bookingError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Reservation Conflict</div>
            <p className="mt-0.5">{bookingError}</p>
          </div>
        </div>
      )}

      {/* STEP 1: Select Service */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">STEP 1 – Select Service</h2>
              <p className="text-xs text-slate-500">Pick a service category and specific job requirement</p>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory === c.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allServices
              .filter((s) => selectedCategory === 'All' || s.category === selectedCategory)
              .map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      // Auto associate the provider of this service if approved
                      const prov = approvedProviders.find((p) => p.id === service.providerId);
                      if (prov) setSelectedProvider(prov);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span className="font-semibold text-blue-700">{service.category}</span>
                        <span className="font-mono">${service.price}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{service.title}</h4>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2">{service.description}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Duration: {service.durationMinutes}m</span>
                      {isSelected && (
                        <span className="font-bold text-blue-600 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Selected
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Continue to Select Provider <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Provider */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">STEP 2 – Select Provider</h2>
            <p className="text-xs text-slate-500">
              Only verified & approved specialists in {selectedService?.category} are shown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvedProviders
              .filter(
                (p) =>
                  !selectedService ||
                  p.category.toLowerCase() === selectedService.category.toLowerCase() ||
                  p.id === selectedService.providerId
              )
              .map((provider) => {
                const isSelected = selectedProvider?.id === provider.id;
                return (
                  <div
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={provider.avatarUrl}
                      alt={provider.fullName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{provider.fullName}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </div>
                      <p className="text-xs text-blue-700 font-medium truncate">{provider.title}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" /> {provider.rating.toFixed(1)}
                        </span>
                        <span>&middot;</span>
                        <span>${provider.startingPrice}/hr</span>
                        <span>&middot;</span>
                        <span>{provider.serviceCity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={!selectedProvider}
              onClick={() => setStep(3)}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Continue to Select Date <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Select Date */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">STEP 3 – Select Date</h2>
            <p className="text-xs text-slate-500">
              Choose an upcoming day. Past dates are automatically disabled.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {availableDates.map((item) => {
              const isSelected = selectedDate === item.dateString;
              // check if provider works this day
              const isWorkingDay =
                selectedProvider?.workingHours.workingDays.includes(item.dayOfWeek) ?? true;
              const isBlocked = selectedProvider?.blockedDates?.includes(item.dateString);
              const isDisabled = !isWorkingDay || isBlocked;

              return (
                <button
                  key={item.dateString}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    setSelectedDate(item.dateString);
                    setSelectedTimeSlot(''); // reset slot when date changes
                  }}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                    isDisabled
                      ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{item.display.split(',')[0]}</span>
                  <span className="text-sm font-bold mt-0.5">{item.display.split(' ')[1]}</span>
                  <span className="text-[10px] mt-0.5">{item.display.split(' ')[2]}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={!selectedDate}
              onClick={() => setStep(4)}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Continue to Select Time <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Select Time Slot */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">STEP 4 – Select Appointment Slot</h2>
            <p className="text-xs text-slate-500">
              Live schedule for {selectedDate}. Slots already occupied are blocked to prevent double-booking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {slotsAvailability.map(({ slot, isAvailable }) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`p-3.5 rounded-xl border text-center transition-all flex items-center justify-between ${
                    !isAvailable
                      ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-semibold font-mono">{slot}</span>
                  </div>
                  {!isAvailable && (
                    <span className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Booked
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={!selectedTimeSlot}
              onClick={() => setStep(5)}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Continue to Service Address <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Service Address */}
      {step === 5 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">STEP 5 – Enter Service Address</h2>
            <p className="text-xs text-slate-500">Where should the specialist arrive on the appointment date?</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={addressData.customerName}
                  onChange={(e) => setAddressData({ ...addressData, customerName: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={addressData.customerPhone}
                  onChange={(e) => setAddressData({ ...addressData, customerPhone: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={addressData.address}
                onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                placeholder="Apartment, suite, unit, or street number"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={addressData.city}
                  onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={addressData.pincode}
                  onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Special Instructions / Access Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={addressData.specialInstructions}
                onChange={(e) => setAddressData({ ...addressData, specialInstructions: e.target.value })}
                placeholder="Gate code, parking instructions, pet notice..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(4)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={!addressData.address || !addressData.customerName}
              onClick={() => setStep(6)}
              className="py-2.5 px-6 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              Review Booking Summary <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6 & 7: Booking Summary & Final Confirmation */}
      {step === 6 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">STEP 6 – Booking Summary</h2>
            <p className="text-xs text-slate-500">Verify all appointment parameters before final confirmation</p>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Selected Service</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedService?.title}</div>
                <div className="text-slate-500">{selectedService?.category}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Provider</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{selectedProvider?.fullName}</div>
                <div className="text-slate-500">{selectedProvider?.title}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Date & Window</span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5 font-mono">
                  {selectedDate} · {selectedTimeSlot}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Service Location</span>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {addressData.address}, {addressData.city} {addressData.pincode}
                </div>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Service Charge:</span>
                <span className="font-mono">${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Safety & Booking Fee (10%):</span>
                <span className="font-mono">${platformFee.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-base text-blue-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <span>
              Your card is not charged right now. You can simulate instant demo payment or pay on service completion!
            </span>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(5)}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="py-3 px-8 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Validating Slot Availability...' : 'Confirm & Reserve Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
