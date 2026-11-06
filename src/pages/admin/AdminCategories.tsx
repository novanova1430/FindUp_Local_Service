import React, { useState } from 'react';
import { storageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';
import { ServiceCategory } from '../../types';
import { Modal } from '../../components/common/Modal';
import { FolderTree, PlusCircle, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { showToast } = useToast();
  const categories = storageService.getCategories();
  const services = storageService.getServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Wrench',
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', icon: 'Wrench' });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
    });
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const success = storageService.deleteCategory(id);
    if (success) {
      showToast('Category deleted successfully.', 'info');
    } else {
      showToast('Cannot delete category: Existing active services are currently linked to it.', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      storageService.updateCategory(editingCategory.id, {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        icon: formData.icon,
      });
      showToast('Category updated.', 'success');
    } else {
      const newCat: ServiceCategory = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        icon: formData.icon,
        isActive: true,
        serviceCount: 0,
      };
      storageService.addCategory(newCat);
      showToast('New service category created!', 'success');
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Service Categories</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage public marketplace taxonomy, service groupings, and icons.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const linkedCount = services.filter((s) => s.category === cat.name).length;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cat.description}</p>
                <div className="text-[11px] font-mono text-slate-400 mt-2">
                  {linkedCount} services listed
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-xs text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E.g. Locksmith & Security"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="locksmith-security"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description for customer exploration..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
