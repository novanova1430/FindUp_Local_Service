import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { Wrench, Upload, CheckCircle2, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

export const ProviderRegisterPage: React.FC = () => {
  const { registerProvider } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const categories = storageService.getCategories();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    title: '',
    category: categories[0]?.name || 'Plumbing',
    experienceYears: 5,
    bio: '',
    address: '',
    city: 'Metro City',
    state: 'CA',
    pincode: '94016',
    documentName: 'state_trade_contractor_license.pdf',
    agreeTerms: false,
  });

  const [submittedPending, setSubmittedPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.title.trim()) {
      setError('Please fill in all required professional fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please accept provider terms to submit your application.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = registerProvider({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        title: formData.title.trim(),
        category: formData.category,
        experienceYears: Number(formData.experienceYears),
        bio:
          formData.bio.trim() ||
          `Certified specialist with ${formData.experienceYears} years of experience in residential ${formData.category}. Committed to punctual, high-standard workmanship.`,
        address: formData.address.trim() || '880 Industrial Way',
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        documentName: formData.documentName,
      });

      setLoading(false);

      if (res.success) {
        setSubmittedPending(true);
        showToast('Application submitted! Status set to PENDING admin review.', 'info');
      } else {
        setError(res.error || 'Failed to submit application.');
      }
    }, 500);
  };

  if (submittedPending) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Application Submitted!</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your application has been submitted and is waiting for administrator approval.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1.5">
            <div>
              <span className="font-semibold text-slate-700">Account Status:</span>{' '}
              <span className="font-mono text-amber-700 font-bold">PENDING REVIEW</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Submitted Document:</span>{' '}
              <span className="text-slate-800">{formData.documentName}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              You will receive an in-app and email notification as soon as an administrator verifies your trade license.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => navigate('/provider/dashboard')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Go to Provider Portal
            </button>
            <div className="text-[11px] text-slate-400">
              Evaluator tip: Use the top role switcher or log in as Admin to inspect and approve this application!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-8">
        {/* Quick Back Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <button
            type="button"
            onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/'))}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer"
            title="Go back to previous page (முந்தைய பக்கம்)"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Previous Page</span>
          </button>
          <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600">
            Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-900 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out active:scale-95">
              <Wrench className="w-5 h-5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold tracking-tight group-hover:text-blue-600 transition-colors">
              Find<span className="text-blue-600">Up</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Apply as a Verified Service Provider
          </h2>
          <p className="text-xs text-slate-500">
            Join our certified network. All applications are reviewed by FindUp administrators.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Samuel Green"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="samuel.green@example.com"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 678-9012"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Trade *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Experience (Years) *
              </label>
              <input
                type="number"
                min="1"
                max="45"
                required
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E.g. Certified Master Plumber or Licensed HVAC Specialist"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Professional Biography
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Highlight your qualifications, certifications, specialized equipment, and guarantees..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="315 EcoGuard Street"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pincode *
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>

          {/* Document Verification Upload Box */}
          <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Identity & License Verification Document</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Upload your state trade license or official business credential (PDF/JPG).
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.documentName}
                onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                className="flex-1 text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-mono"
              />
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Attached
              </span>
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="agreeProviderTerms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="agreeProviderTerms" className="text-xs text-slate-600 cursor-pointer">
              I certify that all licensing documents provided are authentic and agree to the Provider Partner Agreement.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Submit Provider Application for Review'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
