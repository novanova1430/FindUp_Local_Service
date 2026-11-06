import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ServiceCard } from '../../components/cards/ServiceCard';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';

export const ProviderDetailPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();

  const provider = storageService.getProviderById(providerId || '');
  const services = provider ? storageService.getServicesByProviderId(provider.id) : [];
  const reviews = provider ? storageService.getReviewsByProviderId(provider.id) : [];

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Provider Not Found</h2>
        <p className="text-xs text-slate-500">This specialist profile does not exist or has been removed.</p>
        <Link
          to="/providers"
          className="inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
        >
          Back to Providers
        </Link>
      </div>
    );
  }

  const isApproved = provider.status === 'APPROVED';

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/providers'))}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-blue-600 rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Providers</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/providers" className="hover:text-blue-600 transition-colors">
            Providers
          </Link>
          <span>/</span>
          <span className="text-slate-700">{provider.category}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900">{provider.fullName}</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={provider.avatarUrl}
                alt={provider.fullName}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-slate-100 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200';
                }}
              />
              {provider.verified && (
                <div
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-sm"
                  title="Verified Professional"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {provider.fullName}
                </h1>
                {isApproved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Specialist
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> Under Review
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-blue-700">{provider.title}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {provider.rating > 0 ? provider.rating.toFixed(1) : 'New'} ({provider.reviewCount} reviews)
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  {provider.experienceYears} Years Exp
                </span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {provider.serviceCity}
                </span>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="flex flex-col sm:items-end gap-2 w-full md:w-auto">
            <div className="text-xs text-slate-500">Hourly Starting Rate</div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              ${provider.startingPrice}
              <span className="text-xs font-normal text-slate-400">/hr</span>
            </div>

            {isApproved ? (
              <button
                onClick={() => navigate(`/customer/bookings/new?providerId=${provider.id}`)}
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-semibold text-xs text-slate-400 bg-slate-100 cursor-not-allowed"
              >
                Awaiting Admin Verification
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Bio, Skills, Services, Reviews */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bio */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">About {provider.fullName}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {provider.bio}
            </p>
          </div>

          {/* Skills */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Expertise & Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Services Offered */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Services Offered ({services.length})
            </h3>
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No active services listed yet.
              </div>
            )}
          </div>

          {/* Customer Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Customer Feedback & Ratings ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{provider.rating > 0 ? provider.rating.toFixed(1) : '5.0'} / 5.0</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={rev.customerName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{rev.customerName}</div>
                          <div className="text-[10px] text-slate-400">{rev.serviceTitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <div className="text-[10px] text-slate-400">
                      Verified Job &middot; {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No reviews recorded yet for this specialist.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Schedule, Location, Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Availability Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Working Hours & Schedule
            </h4>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Working Days:</span>
                <span className="font-semibold text-slate-800">
                  {provider.workingHours.workingDays.map((d) => dayNames[d]).join(', ')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Daily Hours:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {provider.workingHours.start} - {provider.workingHours.end}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Typical Slot Window:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {provider.workingHours.slotDurationMinutes} Minutes
                </span>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Covered Service Districts
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {provider.serviceAreas.map((area, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md font-medium">
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> FindUp Verified
            </div>
            <p className="leading-relaxed text-[11px] text-emerald-800">
              Professional identity, business registration, and trade certificates verified on file by FindUp Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
