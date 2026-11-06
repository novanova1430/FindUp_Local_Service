import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { ProviderCard } from '../../components/cards/ProviderCard';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

export const ProvidersPage: React.FC = () => {
  const { customerProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [minRating, setMinRating] = useState(0);

  const allProviders = storageService.getProviders();
  // We show all providers, but clearly tag pending ones as awaiting approval
  const categories = storageService.getCategories();

  const filteredProviders = useMemo(() => {
    return allProviders.filter((provider) => {
      const matchesSearch =
        !searchQuery.trim() ||
        provider.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || provider.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLocation =
        selectedLocation === 'All' ||
        provider.serviceCity.toLowerCase() === selectedLocation.toLowerCase() ||
        provider.serviceAreas.some((a) => a.toLowerCase() === selectedLocation.toLowerCase());

      const matchesRating = provider.rating >= minRating;

      return matchesSearch && matchesCategory && matchesLocation && matchesRating;
    });
  }, [allProviders, searchQuery, selectedCategory, selectedLocation, minRating]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setMinRating(0);
  };

  const favoriteIds = customerProfile?.favoriteProviderIds || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Certified Specialists</div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Verified Service Providers</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse state-licensed, insured, and verified local professionals ready for immediate dispatch.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <span className="font-bold text-slate-900">{filteredProviders.length}</span> professionals
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by provider name, specialty, or skill..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
            >
              <option value="All">All Locations</option>
              <option value="Metro City">Metro City</option>
              <option value="Westwood">Westwood</option>
              <option value="Oakdale">Oakdale</option>
              <option value="South Bay">South Bay</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-center">
            <button
              onClick={handleReset}
              title="Reset Filters"
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Min rating chips */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Minimum Rating:</span>
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

          <div className="text-[11px] text-slate-400">
            Approved specialists display instant booking buttons
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isFavorite={favoriteIds.includes(provider.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Providers Match</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your location or category filters to see available specialists.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
