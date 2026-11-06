import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { CustomerLayout } from '../components/layout/CustomerLayout';
import { ProviderLayout } from '../components/layout/ProviderLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { ServiceDetailPage } from '../pages/public/ServiceDetailPage';
import { ProvidersPage } from '../pages/public/ProvidersPage';
import { ProviderDetailPage } from '../pages/public/ProviderDetailPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { CustomerRegisterPage } from '../pages/auth/CustomerRegisterPage';
import { ProviderRegisterPage } from '../pages/auth/ProviderRegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Customer Pages
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { CustomerServices } from '../pages/customer/CustomerServices';
import { BookingWizard } from '../pages/customer/BookingWizard';
import { CustomerBookings } from '../pages/customer/CustomerBookings';
import { CustomerFavorites } from '../pages/customer/CustomerFavorites';
import { CustomerReviews } from '../pages/customer/CustomerReviews';
import { CustomerNotifications } from '../pages/customer/CustomerNotifications';
import { CustomerProfile } from '../pages/customer/CustomerProfile';

// Provider Pages
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { ProviderRequests } from '../pages/provider/ProviderRequests';
import { ProviderBookings } from '../pages/provider/ProviderBookings';
import { ProviderServices } from '../pages/provider/ProviderServices';
import { ProviderAvailability } from '../pages/provider/ProviderAvailability';
import { ProviderEarnings } from '../pages/provider/ProviderEarnings';
import { ProviderReviews } from '../pages/provider/ProviderReviews';
import { ProviderProfile } from '../pages/provider/ProviderProfile';
import { ProviderNotifications } from '../pages/provider/ProviderNotifications';
import { ProviderSettings } from '../pages/provider/ProviderSettings';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminProviders } from '../pages/admin/AdminProviders';
import { AdminCategories } from '../pages/admin/AdminCategories';
import { AdminServices } from '../pages/admin/AdminServices';
import { AdminBookings } from '../pages/admin/AdminBookings';
import { AdminPayments } from '../pages/admin/AdminPayments';
import { AdminReviews } from '../pages/admin/AdminReviews';
import { AdminReports } from '../pages/admin/AdminReports';
import { AdminSettings } from '../pages/admin/AdminSettings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route path="/providers/:providerId" element={<ProviderDetailPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/customer" element={<CustomerRegisterPage />} />
        <Route path="/register/provider" element={<ProviderRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 2. Customer Portal (Protected to customer or admin) */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="services" element={<CustomerServices />} />
        <Route path="bookings/new" element={<BookingWizard />} />
        <Route path="bookings" element={<CustomerBookings />} />
        <Route path="favorites" element={<CustomerFavorites />} />
        <Route path="reviews" element={<CustomerReviews />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="profile" element={<CustomerProfile />} />
      </Route>

      {/* 3. Provider Portal (Protected to provider or admin) */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['provider', 'admin']}>
            <ProviderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
        <Route path="requests" element={<ProviderRequests />} />
        <Route path="bookings" element={<ProviderBookings />} />
        <Route path="services" element={<ProviderServices />} />
        <Route path="availability" element={<ProviderAvailability />} />
        <Route path="earnings" element={<ProviderEarnings />} />
        <Route path="reviews" element={<ProviderReviews />} />
        <Route path="profile" element={<ProviderProfile />} />
        <Route path="notifications" element={<ProviderNotifications />} />
        <Route path="settings" element={<ProviderSettings />} />
      </Route>

      {/* 4. Administrator Portal (Protected strictly to admin) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
