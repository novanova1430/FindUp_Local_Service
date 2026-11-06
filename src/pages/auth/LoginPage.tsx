import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Wrench, Eye, EyeOff, ShieldCheck, UserCheck, Briefcase, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('customer@fixflow.demo');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (loginEmail: string) => {
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = login(loginEmail);
      setLoading(false);

      if (res.success && res.user) {
        showToast(`Signed in successfully as ${res.user.fullName}!`, 'success');
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.user.role === 'provider') {
          navigate('/provider/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      } else {
        setError(res.error || 'Authentication failed.');
      }
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an email address.');
      return;
    }
    handleLogin(email.trim());
  };

  return (
    <div className="min-h-[85vh] flex">
      {/* Left split: Brand & Trust */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-950/40" />
        <div className="relative z-10 space-y-4">
          <Link to="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out active:scale-95">
              <Wrench className="w-5 h-5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Find<span className="text-blue-400">Up</span>
            </span>
          </Link>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Local service booking & workforce operations platform with multi-role access controls.
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Evaluator Test Accounts
            </div>
            <p className="text-xs text-slate-300">
              Click any verified test persona to log in instantly with full state authorization:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@fixflow.demo');
                  handleLogin('admin@fixflow.demo');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Administrator</div>
                    <div className="text-[10px] text-slate-400 font-mono">admin@fixflow.demo</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded">
                  Log In &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('provider@fixflow.demo');
                  handleLogin('provider@fixflow.demo');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Service Provider (Sarah Jenkins)</div>
                    <div className="text-[10px] text-slate-400 font-mono">provider@fixflow.demo</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Log In &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('customer@fixflow.demo');
                  handleLogin('customer@fixflow.demo');
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Customer (David Miller)</div>
                    <div className="text-[10px] text-slate-400 font-mono">customer@fixflow.demo</div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded">
                  Log In &rarr;
                </span>
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            FindUp &middot; Production Portfolio Application
          </div>
        </div>
      </div>

      {/* Right split: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6">
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

          <div className="text-left space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
            <p className="text-xs text-slate-500">Sign in to manage your appointments, jobs, or platform.</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Click Badges on Mobile */}
          <div className="lg:hidden p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-700">Quick Test Sign In:</div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLogin('admin@fixflow.demo')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-100 text-purple-800"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleLogin('provider@fixflow.demo')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800"
              >
                Provider
              </button>
              <button
                type="button"
                onClick={() => handleLogin('customer@fixflow.demo')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800"
              >
                Customer
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
            <div>
              Need an account?{' '}
              <Link to="/register/customer" className="font-semibold text-blue-600 hover:text-blue-700">
                Register as Customer
              </Link>
            </div>
            <div>
              Looking to offer services?{' '}
              <Link to="/register/provider" className="font-semibold text-blue-600 hover:text-blue-700">
                Register as Provider
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
