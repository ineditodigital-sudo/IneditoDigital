import { useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import type { PortfolioItem } from '../../context/AppContext';

export default function AdminPortfolioPage() {
  const { portfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: '',
    category: '',
    client: '',
    description: '',
    fullDescription: '',
    challenge: '',
    solution: '',
    results: [],
    image: '',
    gallery: [],
    testimonial: { text: '', author: '', position: '' },
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    date: new Date().toISOString().split('T')[0],
  });

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      client: '',
      description: '',
      fullDescription: '',
      challenge: '',
      solution: '',
      results: [],
      image: '',
      gallery: [],
      testimonial: { text: '', author: '', position: '' },
      slug: '',
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      date: new Date().toISOString().split('T')[0],
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingItem) {
      updatePortfolioItem(editingItem.id, formData);
    } else {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        ...formData as PortfolioItem,
      };
      addPortfolioItem(newItem);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este caso?')) {
      deletePortfolioItem(id);
    }
  };

  const handleArrayInput = (field: 'keywords' | 'gallery', value: string) => {
    const array = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: array });
  };

  const handleResultsInput = (value: string) => {
    const lines = value.split('\n').filter(line => line.trim() !== '');
    const results = lines.map(line => {
      const [metric, val] = line.split(':').map(s => s.trim());
      return { metric: metric || '', value: val || '' };
    });
    setFormData({ ...formData, results });
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading text-3xl md:text-4xl">
            {editingItem ? 'EDITAR CASO' : 'NUEVO CASO'}
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
                placeholder="Ej: La Terraza Gourmet"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slug */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Slug (URL) *</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="la-terraza-gourmet"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Categoría *</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="Restaurante"
                />
              </div>
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Cliente</label>
              <input
                type="text"
                value={formData.client || ''}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="Nombre del cliente"
              />
            </div>

            {/* Descripción Corta */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Descripción Corta *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Breve descripción para listados"
              />
            </div>

            {/* Descripción Completa */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Descripción Completa *</label>
              <textarea
                value={formData.fullDescription || ''}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Descripción detallada del caso"
              />
            </div>

            {/* Reto */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Reto/Problema</label>
              <textarea
                value={formData.challenge || ''}
                onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="¿Cuál era el desafío principal?"
              />
            </div>

            {/* Solución */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Solución</label>
              <textarea
                value={formData.solution || ''}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="¿Qué estrategia implementamos?"
              />
            </div>

            {/* Resultados */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Resultados (métrica: valor, una por línea)</label>
              <textarea
                value={formData.results?.map(r => `${r.metric}: ${r.value}`).join('\n') || ''}
                onChange={(e) => handleResultsInput(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Aumento en ventas: +300%&#10;Leads generados: 1,200&#10;ROI: 5.2x"
              />
            </div>

            {/* Imagen Principal */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Imagen Principal (URL) *</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                placeholder="https://..."
              />
            </div>

            {/* Galería */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Galería de Imágenes (una URL por línea)</label>
              <textarea
                value={formData.gallery?.join('\n') || ''}
                onChange={(e) => handleArrayInput('gallery', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="https://...&#10;https://..."
              />
            </div>

            {/* Testimonial */}
            <div className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="heading text-sm text-white/80">Testimonial del Cliente</h3>
              
              <div>
                <label className="block text-xs text-white/60 mb-1">Texto</label>
                <textarea
                  value={formData.testimonial?.text || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, text: e.target.value, author: formData.testimonial?.author || '', position: formData.testimonial?.position || '' }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#7700CE] outline-none transition-all resize-none"
                  placeholder="Testimonio del cliente..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Autor</label>
                  <input
                    type="text"
                    value={formData.testimonial?.author || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonial: { ...formData.testimonial, author: e.target.value, text: formData.testimonial?.text || '', position: formData.testimonial?.position || '' }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#7700CE] outline-none transition-all"
                    placeholder="Nombre"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/60 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={formData.testimonial?.position || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      testimonial: { ...formData.testimonial, position: e.target.value, text: formData.testimonial?.text || '', author: formData.testimonial?.author || '' }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-[#7700CE] outline-none transition-all"
                    placeholder="Posición"
                  />
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="heading text-lg mb-4">SEO</h3>

              <div className="mb-4">
                <label className="block text-sm text-white/80 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="Título para buscadores"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/80 mb-2">Meta Description</label>
                <textarea
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                  placeholder="Descripción para buscadores"
                />
              </div>

              <div>
                <label className="block text-sm text-white/80 mb-2">Keywords (una por línea)</label>
                <textarea
                  value={formData.keywords?.join('\n') || ''}
                  onChange={(e) => handleArrayInput('keywords', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                  placeholder="restaurante marketing&#10;seo local aguascalientes"
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
          <h1 className="heading text-3xl md:text-4xl mb-2">PORTAFOLIO</h1>
          <p className="text-white/60">Casos de éxito y proyectos</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all"
        >
          <Plus size={18} />
          <span className="font-medium">Nuevo Caso</span>
        </button>
      </div>

      <div className="grid gap-4">
        {portfolioItems.length > 0 ? (
          portfolioItems.map((item) => (
            <GlassCard key={item.id}>
              <div className="flex items-center gap-4">
                {item.image && (
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="heading text-lg md:text-xl mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm mb-2">{item.category}</p>
                  <p className="text-white/40 text-xs line-clamp-2">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2.5 rounded-full bg-[#7700CE]/20 text-[#7700CE] hover:bg-[#7700CE]/30 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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
            <p className="text-white/40 text-center py-8">No hay casos registrados aún</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
