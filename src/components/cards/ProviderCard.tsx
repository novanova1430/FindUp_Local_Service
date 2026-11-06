import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProviderProfile } from '../../types';
import { ShieldCheck, Star, MapPin, Award, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

interface ProviderCardProps {
  provider: ProviderProfile;
  isFavorite?: boolean;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, isFavorite = false }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to save favorites.', 'info');
      navigate('/login');
      return;
    }
    const added = storageService.toggleFavoriteProvider(user.id, provider.id);
    showToast(added ? `${provider.fullName} added to favorites` : `Removed from favorites`, 'info');
  };

  const isApproved = provider.status === 'APPROVED';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={provider.avatarUrl}
                alt={provider.fullName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                }}
              />
              {provider.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-xs"
                  title="Verified Professional"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {provider.fullName}
                </h3>
              </div>
              <p className="text-xs text-blue-700 font-medium">{provider.title}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {provider.serviceCity}
                </span>
                <span aria-hidden="true">&middot;</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-400" />
                  {provider.experienceYears} yrs exp
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {provider.bio}
        </p>

        {/* Skills pill-less list */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] text-slate-500">
          {provider.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
              {skill}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="text-slate-400 self-center">+{provider.skills.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</span>
            </div>
            {provider.reviewCount > 0 && (
              <span className="text-slate-400 font-mono text-[11px]">({provider.reviewCount})</span>
            )}
          </div>
          <div className="text-xs font-semibold text-slate-900 mt-0.5">
            From <span className="font-mono text-sm">${provider.startingPrice}</span>/hr
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/providers/${provider.id}`}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Profile
          </Link>

          {isApproved ? (
            <button
              onClick={() => navigate(`/customer/bookings/new?providerId=${provider.id}`)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              Book
            </button>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md">
              Awaiting Approval
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
