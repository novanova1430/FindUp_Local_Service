import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { ServiceCard } from '../../components/cards/ServiceCard';
import { Search, RotateCcw } from 'lucide-react';

export const CustomerServices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250);

  const categories = storageService.getCategories();
  const services = storageService.getServices().filter((s) => s.isActive);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchCat = categoryFilter === 'All' || s.category === categoryFilter;
      const matchSearch =
        !searchQuery.trim() ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = s.price <= maxPrice;
      return matchCat && matchSearch && matchPrice;
    });
  }, [services, categoryFilter, searchQuery, maxPrice]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Browse Available Services</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select any service to begin your personalized booking wizard.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service name or description..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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

        <div className="md:col-span-2 flex items-center gap-2">
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
              setMaxPrice(250);
            }}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
