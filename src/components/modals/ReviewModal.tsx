import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Booking } from '../../types';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!comment.trim()) {
      showToast('Please provide a brief review comment.', 'error');
      return;
    }

    const res = storageService.addReview({
      bookingId: booking.id,
      customerId: user.id,
      customerName: user.fullName,
      customerAvatar: user.avatarUrl,
      providerId: booking.providerId,
      serviceId: booking.serviceId,
      serviceTitle: booking.serviceTitle,
      rating,
      comment: comment.trim(),
    });

    if (res.success) {
      showToast('Thank you! Your verified customer review has been posted.', 'success');
      setComment('');
      onReviewSubmitted();
      onClose();
    } else {
      showToast(res.error || 'Failed to submit review.', 'error');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate & Review Service"
      subtitle={`Service with ${booking.providerName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-bold text-slate-700 font-mono">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Review Details
          </label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience: Was the provider punctual, courteous, and thorough?"
            className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Submit Review
          </button>
        </div>
      </form>
    </Modal>
  );
};
