import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Star } from 'lucide-react';

export const ProviderReviews: React.FC = () => {
  const { providerProfile } = useAuth();

  const reviews = providerProfile ? storageService.getReviewsByProviderId(providerProfile.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Client Reviews & Ratings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read verified customer feedback and maintain top quality service ratings.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-2xl font-bold font-mono text-slate-900">
            {providerProfile?.rating.toFixed(1) || '5.0'}
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <div className="text-[10px] text-slate-400">{reviews.length} Verified Reviews</div>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={rev.customerName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{rev.customerName}</h4>
                    <span className="text-[10px] text-blue-600 font-medium">{rev.serviceTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="ml-1 font-bold text-slate-700 font-mono">{rev.rating}/5</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                "{rev.comment}"
              </p>

              <div className="text-[10px] text-slate-400 text-right">
                Verified Job &middot; {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 text-xs text-slate-500">
          No customer reviews recorded yet. Completed appointments will invite clients to review your work.
        </div>
      )}
    </div>
  );
};
