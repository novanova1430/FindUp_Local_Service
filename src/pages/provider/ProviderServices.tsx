import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { ServiceItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { PlusCircle, Edit3, Trash2, Clock, DollarSign, Check, X } from 'lucide-react';

export const ProviderServices: React.FC = () => {
  const { providerProfile } = useAuth();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const categories = storageService.getCategories();
  const allServices = storageService.getServices();
  const myServices = providerProfile
    ? allServices.filter((s) => s.providerId === providerProfile.id)
    : [];

  const [formData, setFormData] = useState({
    title: '',
    category: categories[0]?.name || 'Plumbing',
    description: '',
    price: 90,
    durationMinutes: 90,
    imageUrl: '/src/assets/images/service_plumbing_repair_1793893588884.jpg',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: '',
      category: providerProfile?.category || categories[0]?.name || 'Plumbing',
      description: '',
      price: providerProfile?.startingPrice || 80,
      durationMinutes: 90,
      imageUrl: '/src/assets/images/service_plumbing_repair_1793893588884.jpg',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      category: service.category,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      imageUrl: service.imageUrl,
      isActive: service.isActive,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      storageService.deleteService(id);
      showToast('Service package deleted.', 'info');
    }
  };

  const handleToggleActive = (service: ServiceItem) => {
    storageService.updateService(service.id, { isActive: !service.isActive });
    showToast(`Service status updated to ${!service.isActive ? 'Active' : 'Inactive'}.`, 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerProfile) return;

    if (!formData.title.trim()) {
      showToast('Please enter a service title.', 'error');
      return;
    }

    const categoryObj = categories.find((c) => c.name === formData.category) || categories[0];

    if (editingService) {
      storageService.updateService(editingService.id, {
        title: formData.title,
        category: formData.category,
        categoryId: categoryObj.id,
        description: formData.description,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        isActive: formData.isActive,
      });
      showToast('Service updated successfully!', 'success');
    } else {
      const newService: ServiceItem = {
        id: `srv-${Date.now()}`,
        providerId: providerProfile.id,
        providerName: providerProfile.fullName,
        providerRating: providerProfile.rating,
        category: formData.category,
        categoryId: categoryObj.id,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        imageUrl: formData.imageUrl,
        included: ['Standard diagnostic evaluation', 'Professional equipment dispatch', 'Clean work area guarantee'],
        excluded: ['Major structural re-engineering'],
        faqs: [],
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
      };
      storageService.addService(newService);
      showToast('New service published to marketplace!', 'success');
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Service Offerings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, modify rates, and adjust service duration for your offerings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Service
        </button>
      </div>

      {myServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-slate-100">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-slate-800">
                    {service.category}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-xs ${
                        service.isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {service.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{service.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.durationMinutes}m
                    </span>
                    <span>&middot;</span>
                    <span className="font-bold text-slate-900">${service.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-slate-100 mt-2">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="p-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <p className="text-xs text-slate-500">You haven't added any services yet.</p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
          >
            Create Your First Service
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service Offering' : 'Add New Service'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E.g. Main Line Drain Auger Clearing"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-slate-800"
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
                Starting Price ($)
              </label>
              <input
                type="number"
                min="20"
                step="5"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Estimated Duration (Minutes)
            </label>
            <input
              type="number"
              min="30"
              step="15"
              required
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Service Description
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe scope of work, testing procedures, and customer expectations..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveToggle"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="isActiveToggle" className="text-xs text-slate-700 cursor-pointer">
              List service as active in public marketplace
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              {editingService ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
