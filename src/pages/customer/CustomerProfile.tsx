import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { User, MapPin, Lock, Save } from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { user, customerProfile } = useAuth();
  const { showToast } = useToast();

  const [personal, setPersonal] = useState({
    fullName: user?.fullName || 'David Miller',
    email: user?.email || 'customer@fixflow.demo',
    phone: user?.phone || '+1 (555) 321-9844',
  });

  const [address, setAddress] = useState({
    street: customerProfile?.address || '742 Evergreen Terrace, Apt 4B',
    city: customerProfile?.city || 'Metro City',
    state: customerProfile?.state || 'CA',
    pincode: customerProfile?.pincode || '94016',
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    storageService.updateUser(user.id, {
      fullName: personal.fullName,
      phone: personal.phone,
    });

    storageService.updateCustomerProfile(user.id, {
      address: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });

    showToast('Customer profile & address updated successfully!', 'success');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Password updated successfully (Demo Mode simulated).', 'success');
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Profile & Service Address</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your contact credentials and default service dispatch address.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left card: Avatar & summary */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-center">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
            alt="Customer Avatar"
            className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-600 shadow-sm"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{personal.fullName}</h3>
            <p className="text-xs text-slate-500">{personal.email}</p>
            <div className="mt-2 inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Verified Customer
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 text-left text-xs text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Service Dispatch Location:</div>
            <div>{address.street}</div>
            <div>
              {address.city}, {address.state} {address.pincode}
            </div>
          </div>
        </div>

        {/* Right 2-col: Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info & Address */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={personal.email}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pt-2 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-blue-600" /> Default Home Address
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Profile Changes
              </button>
            </div>
          </form>

          {/* Password simulation */}
          <form
            onSubmit={handleSavePassword}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" /> Change Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
