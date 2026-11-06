export type UserRole = 'customer' | 'provider' | 'admin';

export type ProviderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'UPI' | 'CARD' | 'CASH';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  favoriteProviderIds: string[];
}

export interface ProviderProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  title: string;
  category: string;
  experienceYears: number;
  bio: string;
  serviceCity: string;
  address: string;
  state: string;
  pincode: string;
  status: ProviderStatus;
  rejectionReason?: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  verified: boolean;
  skills: string[];
  serviceAreas: string[];
  documentName?: string;
  documentUrl?: string;
  workingHours: {
    start: string; // e.g. "09:00"
    end: string;   // e.g. "18:00"
    workingDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
    breakStart?: string;
    breakEnd?: string;
    slotDurationMinutes: number;
  };
  blockedDates?: string[]; // "YYYY-MM-DD"
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  serviceCount: number;
}

export interface ServiceItem {
  id: string;
  providerId: string;
  providerName?: string;
  providerRating?: number;
  category: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  included: string[];
  excluded: string[];
  faqs: { question: string; answer: string }[];
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "FX-2026-8941"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  providerId: string;
  providerName: string;
  providerTitle: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // e.g. "10:00 AM - 11:30 AM"
  serviceAddress: string;
  serviceCity: string;
  servicePincode: string;
  specialInstructions?: string;
  serviceCharge: number;
  platformFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
  reviewed?: boolean;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  amount: number;
  platformFee: number;
  providerShare: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionReference: string;
  createdAt: string;
  errorMessage?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  providerId: string;
  serviceId: string;
  rating: number; // 1-5
  comment: string;
  serviceTitle: string;
  createdAt: string;
  isReported?: boolean;
  isModerated?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'approval' | 'system';
  relatedBookingId?: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformStats {
  totalCustomers: number;
  totalProviders: number;
  pendingProviders: number;
  approvedProviders: number;
  rejectedProviders: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalTransactionValue: number;
  platformRevenue: number;
}
