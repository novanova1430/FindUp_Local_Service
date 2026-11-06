import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ServiceItem } from '../../types';
import { Clock, Star, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group">
      {/* Image Container with Fallback */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-xs">
          {service.category}
        </div>
        <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-300" />
          <span>{service.durationMinutes}m</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">{service.providerName}</span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{service.providerRating?.toFixed(1) || '4.9'}</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {service.title}
          </h3>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Starting at</div>
            <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">
              ${service.price.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/services/${service.id}`}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => navigate(`/customer/bookings/new?serviceId=${service.id}&providerId=${service.providerId}`)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              Book <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
