import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, User, Save, MapPin, Briefcase, FileText } from 'lucide-react';

export const ProviderProfile: React.FC = () => {
  const { providerProfile } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: providerProfile?.fullName || '',
    title: providerProfile?.title || '',
    category: providerProfile?.category || '',
    experienceYears: providerProfile?.experienceYears || 5,
    bio: providerProfile?.bio || '',
    serviceCity: providerProfile?.serviceCity || 'Metro City',
    startingPrice: providerProfile?.startingPrice || 65,
    phone: providerProfile?.phone || '',
    skills: providerProfile?.skills.join(', ') || '',
    serviceAreas: providerProfile?.serviceAreas.join(', ') || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerProfile) return;

    storageService.updateProvider(providerProfile.id, {
      fullName: formData.fullName,
      title: formData.title,
      experienceYears: Number(formData.experienceYears),
      bio: formData.bio,
      serviceCity: formData.serviceCity,
      startingPrice: Number(formData.startingPrice),
      phone: formData.phone,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      serviceAreas: formData.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean),
    });

    showToast('Provider profile updated successfully!', 'success');
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Provider Public Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your public marketplace bio, service trade, skills, and base rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-center">
          <img
            src={providerProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt="Provider Avatar"
            className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-blue-600 shadow-sm"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{formData.fullName}</h3>
            <p className="text-xs text-blue-700 font-semibold">{formData.title}</p>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 py-1 px-3 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Status: {providerProfile?.status}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-left text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Document on File:</span>
            </div>
            <div className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 truncate">
              {providerProfile?.documentName || 'state_contractor_license.pdf'}
            </div>
            <p className="text-[10px] text-slate-400 italic">
              Verification files are confidential and never accessible through public marketplace URLs.
            </p>
          </div>
        </div>

        {/* Right 2-col Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleSave}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Professional Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bio & Introduction
              </label>
              <textarea
                rows={4}
                required
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Specialized Skills (Comma separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="Copper Piping, Drain Snaking, Water Heaters..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Base Starting Price ($/hr)
                </label>
                <input
                  type="number"
                  min="25"
                  required
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Area Districts (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.serviceAreas}
                  onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
                  placeholder="Metro City, Westwood, Oakdale"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Profile Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
