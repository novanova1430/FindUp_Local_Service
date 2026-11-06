import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerFavorites: React.FC = () => {
  const { customerProfile } = useAuth();
  const favoriteIds = customerProfile?.favoriteProviderIds || [];

  const providers = storageService
    .getProviders()
    .filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Saved Favorite Specialists</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Quickly re-hire your trusted service providers without searching again.
        </p>
      </div>

      {providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} isFavorite={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Saved Providers Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any specialist card in the provider directory to save them here for quick access.
          </p>
          <Link
            to="/providers"
            className="inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Explore Providers
          </Link>
        </div>
      )}
    </div>
  );
};
