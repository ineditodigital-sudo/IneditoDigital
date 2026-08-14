import { useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import type { Service } from '../../context/AppContext';

export default function AdminServicesPage() {
  const { services, addService, updateService, deleteService } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    slug: '',
    icon: '',
    features: [],
    benefits: [],
    pricing: '',
    image: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
  });

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingService(null);
    setFormData({
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      slug: '',
      icon: '',
      features: [],
      benefits: [],
      pricing: '',
      image: '',
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingService) {
      // Update existing service
      updateService(editingService.id, formData);
    } else {
      // Create new service
      const newService: Service = {
        id: Date.now().toString(),
        ...formData as Service,
      };
      addService(newService);
    }
    setIsEditing(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      deleteService(id);
    }
  };

  const handleArrayInput = (field: 'features' | 'benefits' | 'keywords', value: string) => {
    const array = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: array });
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading text-3xl md:text-4xl">
            {editingService ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}
          </h1>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <GlassCard>
          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Título *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="Ej: SEO Avanzado"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Slug (URL) *</label>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="seo-avanzado"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Categoría</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="Marketing Digital"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Descripción Corta *</label>
              <textarea
                value={formData.shortDescription || ''}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Breve descripción para listados"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Descripción Completa *</label>
              <textarea
                value={formData.fullDescription || ''}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Descripción detallada del servicio"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Características (una por línea)</label>
              <textarea
                value={formData.features?.join('\n') || ''}
                onChange={(e) => handleArrayInput('features', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Análisis de keywords&#10;Optimización técnica&#10;Link building"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Beneficios (una por línea)</label>
              <textarea
                value={formData.benefits?.join('\n') || ''}
                onChange={(e) => handleArrayInput('benefits', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Más tráfico orgánico&#10;Mayor visibilidad&#10;ROI medible"
              />
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Precio</label>
              <input
                type="text"
                value={formData.pricing || ''}
                onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="Desde $12,000 MXN/mes"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm text-white/80 mb-2">URL de Imagen</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="https://..."
              />
            </div>

            {/* SEO Section */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="heading text-lg mb-4">SEO</h3>

              {/* Meta Title */}
              <div className="mb-4">
                <label className="block text-sm text-white/80 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="Título para buscadores (60 caracteres)"
                />
              </div>

              {/* Meta Description */}
              <div className="mb-4">
                <label className="block text-sm text-white/80 mb-2">Meta Description</label>
                <textarea
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                  placeholder="Descripción para buscadores (160 caracteres)"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Keywords (una por línea)</label>
                <textarea
                  value={formData.keywords?.join('\n') || ''}
                  onChange={(e) => handleArrayInput('keywords', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                  placeholder="seo aguascalientes&#10;posicionamiento web&#10;marketing digital"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all"
              >
                <Save size={18} />
                <span className="font-medium">Guardar</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="heading text-3xl md:text-4xl mb-2">SERVICIOS</h1>
          <p className="text-white/60">Gestión de servicios y contenido</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all"
        >
          <Plus size={18} />
          <span className="font-medium">Nuevo Servicio</span>
        </button>
      </div>

      <div className="grid gap-4">
        {services.length > 0 ? (
          services.map((service) => (
            <GlassCard key={service.id}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1">
                  <h3 className="heading text-lg md:text-xl mb-1">{service.title}</h3>
                  <p className="text-white/60 text-sm mb-2">{service.category}</p>
                  <p className="text-white/40 text-xs line-clamp-2">{service.shortDescription}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2.5 rounded-full bg-[#7700CE]/20 text-[#7700CE] hover:bg-[#7700CE]/30 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard>
            <p className="text-white/40 text-center py-8">No hay servicios registrados aún</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
