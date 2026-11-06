import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ProviderCard } from '../../components/cards/ProviderCard';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Zap,
  Sparkles,
  Wind,
  Paintbrush,
  Tv,
  Hammer,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Trees,
  SunMedium,
  Droplets,
  Camera,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationQuery, setLocationQuery] = useState('Metro City');

  const categories = storageService.getCategories();
  const approvedProviders = storageService.getProviders().filter((p) => p.status === 'APPROVED');
  const featuredProviders = approvedProviders.slice(0, 4);

  // Horizontal Carousel State & Handlers
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const checkScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      const cardWidth = 320;
      setActiveCategoryIndex(Math.round(scrollLeft / cardWidth));
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = categoryScrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        ref.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [categories]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const cardWidth = 320;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (locationQuery) params.append('location', locationQuery);
    navigate(`/services?${params.toString()}`);
  };


  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'plumbing':
        return <Wrench className="w-6 h-6 text-blue-600" />;
      case 'electrical-repair':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'home-cleaning':
        return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case 'ac-repair':
        return <Wind className="w-6 h-6 text-cyan-500" />;
      case 'painting':
        return <Paintbrush className="w-6 h-6 text-amber-600" />;
      case 'appliance-repair':
        return <Tv className="w-6 h-6 text-rose-500" />;
      case 'carpentry':
        return <Hammer className="w-6 h-6 text-orange-500" />;
      case 'pest-control':
        return <ShieldAlert className="w-6 h-6 text-emerald-600" />;
      case 'gardening-landscaping':
        return <Trees className="w-6 h-6 text-emerald-600" />;
      case 'smart-security':
        return <Camera className="w-6 h-6 text-slate-700" />;
      case 'solar-energy':
        return <SunMedium className="w-6 h-6 text-amber-500" />;
      case 'waterproofing':
        return <Droplets className="w-6 h-6 text-cyan-600" />;
      default:
        return <Wrench className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section - Styled with Palette 18 (#ABC270, #FEC868, #FDA769, #473C33) */}
      <section className="relative bg-gradient-to-b from-[#F4F7EC] via-[#FAF8F2] to-white text-[#473C33] pt-16 pb-24 overflow-hidden border-b border-slate-200/80">
        {/* Soft Ambient Swatches */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-[#ABC270]/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 w-96 h-96 bg-[#FEC868]/25 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 right-1/3 w-80 h-80 bg-[#FDA769]/15 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F7EC] border border-[#ABC270]/60 text-[#473C33] text-xs font-semibold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#ABC270] animate-pulse" />
                Trusted Local Services on Demand
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#473C33]">
                Find the Right Professional for <span className="text-[#473C33] underline decoration-[#FDA769] decoration-4 underline-offset-8">Every Job.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#5C5046] max-w-xl leading-relaxed">
                FindUp connects homeowners with top-rated local electricians, plumbers, cleaners, and technicians.
                Upfront pricing, live schedule slots, and guaranteed satisfaction.
              </p>

              {/* Search Bar Form */}
              <form
                onSubmit={handleSearch}
                className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/90 flex flex-col sm:flex-row gap-2.5 text-[#473C33]"
              >
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. Pipe leak, Panel repair..."
                    className="w-full text-xs sm:text-sm text-[#473C33] focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="sm:w-44 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm text-[#473C33] bg-transparent focus:outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:w-40 flex items-center gap-2 px-3 py-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="City / Pincode"
                    className="w-full text-xs sm:text-sm text-[#473C33] focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-[#473C33] bg-[#FEC868] hover:bg-[#FDA769] shadow-md shadow-[#FEC868]/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95"
                >
                  <Search className="w-4 h-4 text-[#473C33]" />
                  <span>Find Specialists</span>
                </button>
              </form>

              {/* Quick Trust Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Schedule Confirmation</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Transparent Upfront Pricing</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Booking Fees</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset in Clean Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white ring-1 ring-slate-200/80">
                <img
                  src="/src/assets/images/fixflow_hero_technician_1793893588711.jpg"
                  alt="Certified FindUp Technician"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl flex items-center justify-between text-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">100% Licensed & Vetted</div>
                      <div className="text-[11px] text-slate-500">Reviewed by FindUp Admin</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9/5
                    </div>
                    <div className="text-[10px] text-slate-400">1,240+ jobs finished</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Service Categories Horizontal Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Interactive Trade Directory &bull; {categories.length} Specialized Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Service Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Scroll horizontally or use the arrows to explore our full suite of certified residential services.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Top Carousel Nav Controls */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => scrollCategories('left')}
                disabled={!canScrollLeft}
                aria-label="Previous categories"
                className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCategories('right')}
                disabled={!canScrollRight}
                aria-label="Next categories"
                className="w-9 h-9 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-700 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              to="/services"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Container with Left/Right floating side arrows and edge gradient fade cues */}
        <div className="relative group/carousel">
          {/* Floating Left Arrow (desktop) */}
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md text-slate-800 shadow-xl border border-slate-200 items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer ${
              !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Floating Right Arrow (desktop) */}
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/95 backdrop-blur-md text-slate-800 shadow-xl border border-slate-200 items-center justify-center hover:bg-blue-600 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer ${
              !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Left subtle edge gradient mask indicating content scrolling behind */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 via-slate-50/70 to-transparent z-10 transition-opacity duration-300" />
          )}

          {/* Right subtle edge gradient mask indicating more contents waiting ahead */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 transition-opacity duration-300 flex items-center justify-end pr-3">
              <span className="hidden sm:inline-block text-[11px] font-bold text-blue-700 bg-white/90 shadow-sm border border-blue-200/60 px-2 py-0.5 rounded-full animate-bounce">
                More &rarr;
              </span>
            </div>
          )}

          {/* Scrollable Track */}
          <div
            ref={categoryScrollRef}
            className="flex items-stretch gap-5 overflow-x-auto snap-x snap-mandatory py-4 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?category=${encodeURIComponent(cat.name)}`}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-blue-500/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group/card relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover/card:bg-blue-600 group-hover/card:border-blue-600 transition-all duration-300 shadow-xs [&>svg]:transition-colors group-hover/card:[&>svg]:text-white group-hover/card:scale-110 group-hover/card:rotate-3">
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 group-hover/card:bg-blue-50 group-hover/card:text-blue-700 px-2.5 py-1 rounded-full transition-colors">
                      {cat.serviceCount || 2}+ Pros
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover/card:text-blue-600 transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover/card:text-blue-600 group-hover/card:translate-x-1 transition-all" />
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Quick Booking
                  </span>
                  <span className="text-xs font-bold text-blue-600 group-hover/card:translate-x-0.5 transition-transform flex items-center gap-1">
                    Book Pro &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots Indicator for visual feedback */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {categories.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (categoryScrollRef.current) {
                    categoryScrollRef.current.scrollTo({
                      left: idx * 320,
                      behavior: 'smooth',
                    });
                  }
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCategoryIndex === idx
                    ? 'w-7 bg-blue-600'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Top-Rated Pros</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Service Providers
            </h2>
          </div>
          <Link
            to="/providers"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({approvedProviders.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </section>

      {/* 4. How FindUp Works */}
      <section id="how-it-works" className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Simple 4-Step Process</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How FindUp Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Book certified local professionals in under two minutes with complete transparency and zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold font-mono text-base flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Search Service</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Find the precise service needed across electrical, plumbing, carpentry, cleaning, and more.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold font-mono text-base flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Choose Specialist</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Compare verified provider licenses, hourly rates, verified customer reviews, and portfolios.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold font-mono text-base flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Book Appointment</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Pick an available calendar date and real-time appointment slot with automated double-booking prevention.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold font-mono text-base flex items-center justify-center mb-4">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">Get It Done</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Your professional arrives on schedule. Inspect the completed job and release payment with peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose FindUp */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Built For Trust</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Why Homeowners Trust FindUp
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              FindUp eliminates the anxiety of hiring tradespeople. We verify identity credentials, enforce schedule
              commitments, and protect payments until you confirm complete satisfaction.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">100% Verified Credentials</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Every provider undergoes state trade license verification, ID validation, and admin background approval.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">No Double Booking Policy</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our atomic slot reservation engine guarantees your requested appointment is reserved exclusively for you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Authentic Customer Reviews</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Only customers with verified completed bookings can post ratings, keeping feedback 100% genuine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="/src/assets/images/service_plumbing_repair_1793893588884.jpg"
                alt="Plumbing work"
                className="w-full h-48 object-cover rounded-2xl shadow-sm border border-slate-200"
              />
              <img
                src="/src/assets/images/service_home_cleaning_1793893589198.jpg"
                alt="Cleaning work"
                className="w-full h-64 object-cover rounded-2xl shadow-sm border border-slate-200"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src="/src/assets/images/service_electrical_panel_1793893590025.jpg"
                alt="Electrical work"
                className="w-full h-64 object-cover rounded-2xl shadow-sm border border-slate-200"
              />
              <img
                src="/src/assets/images/service_ac_repair_1793893589627.jpg"
                alt="AC repair work"
                className="w-full h-48 object-cover rounded-2xl shadow-sm border border-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials - Clean Modern Light Layout (Non-Black) */}
      <section className="bg-slate-50/70 border-y border-slate-200/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Real Stories</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Loved by Homeowners Across Metro City
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Sarah Jenkins arrived within 15 minutes of the slot window and fixed our master bathroom pipe leak
                without tearing out wall tiles. Transparent price and exceptional cleanup!"
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                  alt="David Miller"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">David Miller</div>
                  <div className="text-[10px] text-slate-400">Evergreen Terrace &middot; Plumbing</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Alex replaced our breaker panel that had been overheating for months. His thermal scanner immediately
                found the culprit circuit. Felt completely secure with his certified license."
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt="Priya Sharma"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Priya Sharma</div>
                  <div className="text-[10px] text-slate-400">Highland Ave &middot; Electrical</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Clara's deep cleaning service got our 100% security deposit back from our landlord. Completely botanical
                supplies and zero chemical fumes. FindUp made scheduling effortless."
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100"
                  alt="Rajesh Patel"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">Rajesh Patel</div>
                  <div className="text-[10px] text-slate-400">Sunset Blvd &middot; Cleaning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are You a Certified Tradesperson or Service Provider?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Grow your client roster with qualified local bookings, automated calendar management, and instant digital
              payout tracking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/register/provider"
              className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm bg-white text-blue-900 hover:bg-blue-50 shadow-md transition-colors text-center whitespace-nowrap"
            >
              Apply as a Provider
            </Link>
            <Link
              to="/services"
              className="py-3 px-6 rounded-xl font-semibold text-xs sm:text-sm bg-blue-700 hover:bg-blue-800 text-white transition-colors text-center whitespace-nowrap"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
