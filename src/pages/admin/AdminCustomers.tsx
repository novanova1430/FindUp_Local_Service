import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { User } from '../../types';
import { Search, Users, UserX, UserCheck, Shield } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const users = storageService.getUsers();
  const bookings = storageService.getBookings();
  const customerProfiles = storageService.getCustomers();

  const customers = useMemo(() => {
    return users.filter((u) => u.role === 'customer');
  }, [users]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      return (
        !searchQuery.trim() ||
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [customers, searchQuery]);

  const handleToggleActive = (user: User) => {
    const updated = storageService.updateUser(user.id, { isActive: !user.isActive });
    if (updated) {
      showToast(
        `Customer account ${user.fullName} is now ${updated.isActive ? 'Active' : 'Suspended'}.`,
        'info'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customer Account Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Directory of registered clients, booking histories, and account status controls.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Address & City</th>
                <th className="py-3 px-4 text-center">Bookings</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const profile = customerProfiles.find((p) => p.userId === cust.id);
                const customerBookingsCount = bookings.filter((b) => b.customerId === cust.id).length;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={cust.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{cust.fullName}</div>
                          <div className="text-[11px] text-slate-500">{cust.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{cust.phone}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {profile ? (
                        <span>
                          {profile.city}, {profile.state}
                        </span>
                      ) : (
                        <span className="text-slate-400">Metro City</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">
                      {customerBookingsCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {cust.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(cust)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                          cust.isActive
                            ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                            : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                        }`}
                      >
                        {cust.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
