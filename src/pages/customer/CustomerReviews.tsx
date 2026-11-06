import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ReviewModal } from '../../components/modals/ReviewModal';
import { Booking } from '../../types';
import { Star, CheckCircle2 } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const allBookings = storageService.getBookings();
  const myCompletedBookings = user
    ? allBookings.filter((b) => b.customerId === user.id && b.status === 'COMPLETED')
    : [];

  const allReviews = storageService.getReviews();
  const myReviews = user ? allReviews.filter((r) => r.customerId === user.id) : [];

  const pendingReviewBookings = myCompletedBookings.filter((b) => !b.reviewed);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Ratings & Reviews</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Share your feedback on completed services to help the FindUp community maintain quality.
        </p>
      </div>

      {/* Services Pending Review */}
      {pendingReviewBookings.length > 0 && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Awaiting Your Feedback ({pendingReviewBookings.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingReviewBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{booking.serviceTitle}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Completed by {booking.providerName} on {booking.date}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setReviewModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
                >
                  Write Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Submitted Reviews */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Submitted Reviews ({myReviews.length})</h2>

        {myReviews.length > 0 ? (
          <div className="space-y-3">
            {myReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{rev.serviceTitle}</h4>
                    <span className="text-[11px] text-slate-500">
                      Posted on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="ml-1 font-bold text-slate-700">{rev.rating}/5</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
            You haven't submitted any reviews yet. Complete a service appointment to write a review!
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        booking={selectedBooking}
        onReviewSubmitted={() => {}}
      />
    </div>
  );
};
