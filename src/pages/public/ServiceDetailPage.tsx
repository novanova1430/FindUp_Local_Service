import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import {
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  User,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = storageService.getServiceById(serviceId || '');
  const provider = service ? storageService.getProviderById(service.providerId) : undefined;
  const reviews = provider ? storageService.getReviewsByProviderId(provider.id) : [];

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
        <p className="text-xs text-slate-500">The service you requested does not exist or has been retired.</p>
        <Link
          to="/services"
          className="inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/customer/bookings/new?serviceId=${service.id}&providerId=${service.providerId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation & Breadcrumb trail */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/services'))}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-blue-600 rounded-xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Services</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/services" className="hover:text-blue-600 transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-slate-700">{service.category}</span>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate max-w-xs">{service.title}</span>
        </div>
      </div>

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image & Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs h-72 sm:h-96">
            <img
              src={service.imageUrl}
              alt={service.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800';
              }}
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold text-slate-900 shadow-sm">
              {service.category}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {service.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
          </div>

          {/* Included vs Excluded Scope Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> What's Included
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {service.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">&check;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" /> What's Excluded
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                {service.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">&times;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{faq.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Customer Reviews */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Customer Reviews ({reviews.length})</h3>
              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{provider?.rating.toFixed(1) || '5.0'} / 5.0</span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={rev.customerName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-800">{rev.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <div className="text-[10px] text-slate-400">
                      Verified Booking &middot; {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No reviews yet for this specific service.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Box & Provider Card */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Booking Action Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starting Rate</span>
                <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  ${service.price.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Estimated: {service.durationMinutes} mins</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Guaranteed arrival window</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Live availability calendar slot reservation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Pay demo fee after booking or upon service</span>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Provider Card Info */}
          {provider && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-start gap-3.5">
                <img
                  src={provider.avatarUrl}
                  alt={provider.fullName}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{provider.fullName}</h4>
                    {provider.verified && <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                  <div className="text-xs text-blue-700 font-medium truncate">{provider.title}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {provider.rating.toFixed(1)}
                    </span>
                    <span>&middot;</span>
                    <span>{provider.experienceYears} yrs experience</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{provider.bio}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {provider.serviceCity}
                </span>
                <Link
                  to={`/providers/${provider.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  View Full Profile &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
