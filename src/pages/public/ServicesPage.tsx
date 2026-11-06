import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'duration'>('rating');
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [minRating, setMinRating] = useState<number>(0);

  const allServices = storageService.getServices().filter((s) => s.isActive);
  const categories = storageService.getCategories();

  const filteredServices = useMemo(() => {
    return allServices
      .filter((service) => {
        const matchesCategory =
          categoryFilter === 'All' ||
          service.category.toLowerCase() === categoryFilter.toLowerCase();

        const matchesQuery =
          !searchQuery.trim() ||
          service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.providerName && service.providerName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPrice = service.price <= maxPrice;
        const matchesRating = (service.providerRating || 5) >= minRating;

        return matchesCategory && matchesQuery && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.providerRating || 5) - (a.providerRating || 5);
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'duration') {
          return a.durationMinutes - b.durationMinutes;
        }
        return 0;
      });
  }, [allServices, categoryFilter, searchQuery, sortBy, maxPrice, minRating]);

  const handleResetFilters = () => {
    setCategoryFilter('All');
    setSearchQuery('');
    setSortBy('rating');
    setMaxPrice(300);
    setMinRating(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Browse Marketplace</div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Explore Local Home Services</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified services with upfront price estimates and real-time scheduling.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <span className="font-bold text-slate-900">{filteredServices.length}</span> verified services
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search text input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by service name or keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
            >
              <option value="All">All Categories ({allServices.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
            >
              <option value="rating">Sort: Highest Rating</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="duration">Sort: Duration (Shortest)</option>
            </select>
          </div>

          {/* Reset Filters button */}
          <div className="md:col-span-1 flex items-center">
            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary sliders bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Max Starting Price:</span>
            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 accent-blue-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-slate-900">${maxPrice}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Min Rating:</span>
            {[0, 4.5, 4.8].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMinRating(val)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  minRating === val
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {val === 0 ? 'Any' : `${val}+ ★`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Services Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active services matched your current search filters. Try adjusting price or clearing keywords.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
