import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
        {/* Quick Back Navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer"
            title="Go back to Sign In (முந்தைய பக்கம்)"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Sign In</span>
          </Link>
          <Link to="/" className="text-xs font-medium text-slate-400 hover:text-slate-600">
            Home
          </Link>
        </div>

        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-900 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out active:scale-95">
              <Wrench className="w-5 h-5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
            </div>
            <span className="text-2xl font-bold tracking-tight group-hover:text-blue-600 transition-colors">
              Find<span className="text-blue-600">Up</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Reset Your Password</h2>
          <p className="text-xs text-slate-500">
            Enter your account email to receive a password recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-900">Demo Reset Link Generated</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              In production, an automated token is dispatched via Django SMTP. In this demo sandbox, you can directly
              sign in with any demo account or use password: <code className="font-mono font-bold">password123</code>.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors"
            >
              Send Password Reset Link
            </button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
