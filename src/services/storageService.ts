import {
  User,
  ProviderProfile,
  CustomerProfile,
  ServiceCategory,
  ServiceItem,
  Booking,
  PaymentTransaction,
  Review,
  NotificationItem,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PROVIDERS,
  INITIAL_CUSTOMER_PROFILES,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'fixflow_users',
  PROVIDERS: 'fixflow_providers',
  CUSTOMERS: 'fixflow_customers',
  CATEGORIES: 'fixflow_categories',
  SERVICES: 'fixflow_services',
  BOOKINGS: 'fixflow_bookings',
  PAYMENTS: 'fixflow_payments',
  REVIEWS: 'fixflow_reviews',
  NOTIFICATIONS: 'fixflow_notifications',
  CURRENT_USER_ID: 'fixflow_current_user_id',
  PLATFORM_SETTINGS: 'fixflow_platform_settings',
  AUDIT_LOGS: 'fixflow_audit_logs',
};

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformFeePercentage: number; // default 10%
  allowCancellationHoursBefore: number; // default 24
  autoApproveProviders: boolean; // default false
  demoMode: boolean; // default true
  djangoApiUrl: string; // default "http://localhost:8000/api/v1"
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformFeePercentage: 10,
  allowCancellationHoursBefore: 12,
  autoApproveProviders: false,
  demoMode: true,
  djangoApiUrl: 'http://localhost:8000/api/v1',
};

class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROVIDERS)) {
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMER_PROFILES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLATFORM_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(
        STORAGE_KEYS.AUDIT_LOGS,
        JSON.stringify([
          {
            id: 'audit-1',
            adminId: 'user-admin-1',
            adminEmail: 'admin@fixflow.demo',
            action: 'PROVIDER_APPROVED',
            targetType: 'Provider',
            targetId: 'prov-1',
            details: 'Approved Sarah Jenkins (Plumbing) following verification of license #C36.',
            timestamp: '2026-01-16T10:00:00Z',
          },
        ])
      );
    }

    // Automatic migration to v2 dataset with new categories & services
    const dataVersion = localStorage.getItem('fixflow_data_version');
    if (dataVersion !== 'v2') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
      localStorage.setItem('fixflow_data_version', 'v2');
    }

    // Default current user is customer David Miller for immediate rich preview
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-cust-1');
    }
  }

  private dispatchChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fixflow_data_changed'));
    }
  }

  public resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMER_PROFILES));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    this.dispatchChange();
  }

  // Settings
  public getSettings(): PlatformSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.PLATFORM_SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  }

  public updateSettings(updates: Partial<PlatformSettings>): PlatformSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PLATFORM_SETTINGS, JSON.stringify(updated));
    this.dispatchChange();
    return updated;
  }

  // Users & Auth
  public getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  }

  public getCurrentUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  }

  public setCurrentUserId(userId: string | null) {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
    this.dispatchChange();
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: User): User {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.dispatchChange();
    return user;
  }

  public updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.dispatchChange();
    return users[index];
  }

  // Customers
  public getCustomers(): CustomerProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : [];
  }

  public getCustomerByUserId(userId: string): CustomerProfile | undefined {
    return this.getCustomers().find((c) => c.userId === userId);
  }

  public addCustomer(profile: CustomerProfile): CustomerProfile {
    const customers = this.getCustomers();
    customers.push(profile);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.dispatchChange();
    return profile;
  }

  public updateCustomerProfile(userId: string, updates: Partial<CustomerProfile>): CustomerProfile | null {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.userId === userId);
    if (index === -1) return null;
    customers[index] = { ...customers[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.dispatchChange();
    return customers[index];
  }

  public toggleFavoriteProvider(userId: string, providerId: string): boolean {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.userId === userId);
    if (index === -1) return false;
    const currentFavs = customers[index].favoriteProviderIds || [];
    const exists = currentFavs.includes(providerId);
    if (exists) {
      customers[index].favoriteProviderIds = currentFavs.filter((id) => id !== providerId);
    } else {
      customers[index].favoriteProviderIds = [...currentFavs, providerId];
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    this.dispatchChange();
    return !exists;
  }

  // Providers
  public getProviders(): ProviderProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
    return raw ? JSON.parse(raw) : [];
  }

  public getProviderById(id: string): ProviderProfile | undefined {
    return this.getProviders().find((p) => p.id === id);
  }

  public getProviderByUserId(userId: string): ProviderProfile | undefined {
    return this.getProviders().find((p) => p.userId === userId);
  }

  public addProvider(provider: ProviderProfile): ProviderProfile {
    const providers = this.getProviders();
    providers.push(provider);
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
    this.dispatchChange();
    return provider;
  }

  public updateProvider(id: string, updates: Partial<ProviderProfile>): ProviderProfile | null {
    const providers = this.getProviders();
    const index = providers.findIndex((p) => p.id === id);
    if (index === -1) return null;
    providers[index] = { ...providers[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
    this.dispatchChange();
    return providers[index];
  }

  // Categories
  public getCategories(): ServiceCategory[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : [];
  }

  public addCategory(cat: ServiceCategory): ServiceCategory {
    const categories = this.getCategories();
    categories.push(cat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.dispatchChange();
    return cat;
  }

  public updateCategory(id: string, updates: Partial<ServiceCategory>): ServiceCategory | null {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.dispatchChange();
    return categories[index];
  }

  public deleteCategory(id: string): boolean {
    const services = this.getServices();
    const isUsed = services.some((s) => s.categoryId === id);
    if (isUsed) return false;
    const filtered = this.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    this.dispatchChange();
    return true;
  }

  // Services
  public getServices(): ServiceItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return raw ? JSON.parse(raw) : [];
  }

  public getServiceById(id: string): ServiceItem | undefined {
    return this.getServices().find((s) => s.id === id);
  }

  public getServicesByProviderId(providerId: string): ServiceItem[] {
    return this.getServices().filter((s) => s.providerId === providerId);
  }

  public addService(service: ServiceItem): ServiceItem {
    const services = this.getServices();
    services.push(service);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    this.dispatchChange();
    return service;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const services = this.getServices();
    const index = services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    services[index] = { ...services[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    this.dispatchChange();
    return services[index];
  }

  public deleteService(id: string): boolean {
    const filtered = this.getServices().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(filtered));
    this.dispatchChange();
    return true;
  }

  // Bookings & Double-Booking Prevention
  public getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return raw ? JSON.parse(raw) : [];
  }

  public getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  }

  public checkSlotAvailable(providerId: string, date: string, timeSlot: string, excludeBookingId?: string): boolean {
    const bookings = this.getBookings();
    // A slot is taken if there's an existing booking for the same provider, date and timeSlot
    // that is either PENDING, CONFIRMED, or IN_PROGRESS
    const conflicting = bookings.find(
      (b) =>
        b.providerId === providerId &&
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.id !== excludeBookingId &&
        ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status)
    );
    return !conflicting;
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'updatedAt'>): {
    success: boolean;
    booking?: Booking;
    error?: string;
  } {
    // 1. Double booking check
    const isAvailable = this.checkSlotAvailable(bookingData.providerId, bookingData.date, bookingData.timeSlot);
    if (!isAvailable) {
      return {
        success: false,
        error: 'This appointment slot was just reserved or is no longer available. Please select another slot.',
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const booking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingReference: `FX-${new Date().getFullYear()}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Create notifications for customer and provider
    const provider = this.getProviderById(booking.providerId);
    if (provider) {
      this.addNotification({
        userId: provider.userId,
        title: 'New Booking Request',
        message: `${booking.customerName} submitted a booking request for ${booking.serviceTitle} on ${booking.date}.`,
        type: 'booking',
        relatedBookingId: booking.id,
      });
    }

    this.addNotification({
      userId: booking.customerId,
      title: 'Booking Request Submitted',
      message: `Your booking ${booking.bookingReference} with ${booking.providerName} has been submitted for confirmation.`,
      type: 'booking',
      relatedBookingId: booking.id,
    });

    this.dispatchChange();
    return { success: true, booking };
  }

  public updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    reason?: string,
    actingUserId?: string
  ): { success: boolean; error?: string; booking?: Booking } {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index === -1) return { success: false, error: 'Booking not found.' };

    const current = bookings[index];

    // Business Rules validation for state transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      PENDING: ['CONFIRMED', 'REJECTED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED'],
      COMPLETED: [],
      REJECTED: [],
      CANCELLED: [],
    };

    if (!validTransitions[current.status].includes(newStatus)) {
      return {
        success: false,
        error: `Invalid transition from ${current.status} to ${newStatus}.`,
      };
    }

    // Double-booking check when confirming
    if (newStatus === 'CONFIRMED') {
      const isAvailable = this.checkSlotAvailable(current.providerId, current.date, current.timeSlot, current.id);
      if (!isAvailable) {
        return {
          success: false,
          error: 'Cannot confirm: Provider already has another confirmed appointment during this slot.',
        };
      }
    }

    bookings[index] = {
      ...current,
      status: newStatus,
      cancellationReason: reason || current.cancellationReason,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

    // Send notifications based on new status
    if (newStatus === 'CONFIRMED') {
      this.addNotification({
        userId: current.customerId,
        title: 'Booking Confirmed!',
        message: `${current.providerName} confirmed your appointment on ${current.date} at ${current.timeSlot}.`,
        type: 'booking',
        relatedBookingId: current.id,
      });
    } else if (newStatus === 'REJECTED') {
      this.addNotification({
        userId: current.customerId,
        title: 'Booking Declined',
        message: `${current.providerName} was unable to accept your booking for ${current.date}. ${reason ? `Reason: ${reason}` : ''}`,
        type: 'booking',
        relatedBookingId: current.id,
      });
    } else if (newStatus === 'COMPLETED') {
      this.addNotification({
        userId: current.customerId,
        title: 'Service Completed',
        message: `Your service with ${current.providerName} has been marked as complete. Please leave a review!`,
        type: 'booking',
        relatedBookingId: current.id,
      });
    } else if (newStatus === 'CANCELLED') {
      const provider = this.getProviderById(current.providerId);
      if (provider) {
        this.addNotification({
          userId: provider.userId,
          title: 'Booking Cancelled',
          message: `Booking ${current.bookingReference} for ${current.date} was cancelled.`,
          type: 'booking',
          relatedBookingId: current.id,
        });
      }
    }

    this.dispatchChange();
    return { success: true, booking: bookings[index] };
  }

  // Payments & Transactions
  public getPayments(): PaymentTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public simulatePayment(
    bookingId: string,
    paymentMethod: PaymentMethod,
    simulateSuccess: boolean
  ): { success: boolean; transaction?: PaymentTransaction; error?: string } {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const settings = this.getSettings();
    const platformFee = Number(((booking.serviceCharge * settings.platformFeePercentage) / 100).toFixed(2));
    const providerShare = Number((booking.serviceCharge - platformFee).toFixed(2));

    const status: PaymentStatus = simulateSuccess ? 'SUCCESS' : 'FAILED';
    const txn: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      customerId: booking.customerId,
      customerName: booking.customerName,
      providerId: booking.providerId,
      providerName: booking.providerName,
      amount: booking.totalAmount,
      platformFee,
      providerShare,
      paymentMethod,
      status,
      transactionReference: `TXN-${Math.floor(10000 + Math.random() * 90000)}-${paymentMethod}`,
      createdAt: new Date().toISOString(),
      errorMessage: simulateSuccess ? undefined : 'Simulated bank authorization timeout or card declined.',
    };

    const payments = this.getPayments();
    payments.unshift(txn);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Update booking payment status
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      bookings[index].paymentStatus = status;
      bookings[index].paymentMethod = paymentMethod;
      bookings[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    }

    // Notification
    this.addNotification({
      userId: booking.customerId,
      title: simulateSuccess ? 'Payment Successful' : 'Payment Failed',
      message: simulateSuccess
        ? `Demo payment of $${booking.totalAmount.toFixed(2)} completed for ${booking.bookingReference}.`
        : `Payment simulation failed for ${booking.bookingReference}. Please try another method.`,
      type: 'payment',
      relatedBookingId: booking.id,
    });

    this.dispatchChange();
    return { success: simulateSuccess, transaction: txn, error: txn.errorMessage };
  }

  // Reviews
  public getReviews(): Review[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return raw ? JSON.parse(raw) : [];
  }

  public getReviewsByProviderId(providerId: string): Review[] {
    return this.getReviews().filter((r) => r.providerId === providerId && !r.isModerated);
  }

  public addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): { success: boolean; review?: Review; error?: string } {
    // Only customer with completed booking can review
    const booking = this.getBookingById(reviewData.bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };
    if (booking.status !== 'COMPLETED') {
      return { success: false, error: 'Only completed services can be reviewed.' };
    }
    if (booking.reviewed) {
      return { success: false, error: 'This booking has already been reviewed.' };
    }

    const review: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const reviews = this.getReviews();
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

    // Mark booking as reviewed
    const bookings = this.getBookings();
    const bIndex = bookings.findIndex((b) => b.id === booking.id);
    if (bIndex !== -1) {
      bookings[bIndex].reviewed = true;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    }

    // Recalculate provider rating
    const providerReviews = reviews.filter((r) => r.providerId === review.providerId && !r.isModerated);
    const avgRating = Number(
      (providerReviews.reduce((acc, r) => acc + r.rating, 0) / providerReviews.length).toFixed(1)
    );
    this.updateProvider(review.providerId, {
      rating: avgRating,
      reviewCount: providerReviews.length,
    });

    this.dispatchChange();
    return { success: true, review };
  }

  // Notifications
  public getNotifications(userId?: string): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const all: NotificationItem[] = raw ? JSON.parse(raw) : [];
    if (!userId) return all;
    return all.filter((n) => n.userId === userId);
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const notif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const list = this.getNotifications();
    list.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.dispatchChange();
    return notif;
  }

  public markNotificationAsRead(id: string) {
    const list = this.getNotifications();
    const index = list.findIndex((n) => n.id === id);
    if (index !== -1) {
      list[index].read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
      this.dispatchChange();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    const list = this.getNotifications();
    list.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.dispatchChange();
  }

  // Audit Logs (Admin)
  public getAuditLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  public logAdminAction(adminUser: User, action: string, targetType: string, targetId: string, details: string) {
    const logs = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      adminId: adminUser.id,
      adminEmail: adminUser.email,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    this.dispatchChange();
  }
}

export const storageService = new StorageService();
