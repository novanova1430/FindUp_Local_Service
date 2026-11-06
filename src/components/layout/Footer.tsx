import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, CheckCircle2, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group cursor-pointer w-fit">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-500 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ease-out active:scale-95">
                <Wrench className="w-4 h-4 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Find<span className="text-blue-400">Up</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find trusted local professionals, book guaranteed appointments, and track jobs with full pricing
              transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Background-Verified Specialists</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Popular Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/services?category=Plumbing" className="hover:text-white transition-colors">
                  Emergency Plumbing & Leaks
                </Link>
              </li>
              <li>
                <Link to="/services?category=Electrical%20Repair" className="hover:text-white transition-colors">
                  Electrical Panels & Wiring
                </Link>
              </li>
              <li>
                <Link to="/services?category=Home%20Cleaning" className="hover:text-white transition-colors">
                  Deep Home & Move-in Sanitation
                </Link>
              </li>
              <li>
                <Link to="/services?category=AC%20Repair" className="hover:text-white transition-colors">
                  HVAC & AC Compressor Maintenance
                </Link>
              </li>
              <li>
                <Link to="/services?category=Carpentry" className="hover:text-white transition-colors">
                  Custom Woodcraft & Shelving
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/customer/dashboard" className="hover:text-white transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/provider/dashboard" className="hover:text-white transition-colors">
                  Provider Portal & Schedule
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">
                  Administrator Console
                </Link>
              </li>
              <li>
                <Link to="/register/provider" className="hover:text-white transition-colors text-blue-400">
                  Become a FindUp Provider
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign In to Your Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Educational Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Architecture & Tech</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered with React frontend + modular Python Django REST backend architecture with PostgreSQL
              relational models.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> Demo Sandbox Mode
              </div>
              <p>Simulated payments only — no real financial credentials or charges are ever requested.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>&copy; {new Date().getFullYear()} FindUp. All rights reserved.</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Policy</span>
            <span aria-hidden="true">&middot;</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">&middot;</span>
            <span>Cancellation Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
