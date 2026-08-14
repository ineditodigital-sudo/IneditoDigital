import { useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import type { BlogPost } from '../../context/AppContext';

export default function AdminBlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: 'INÉDITO DIGITAL',
    category: '',
    image: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min',
  });

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setIsEditing(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'INÉDITO DIGITAL',
      category: '',
      image: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingPost) {
      updateBlogPost(editingPost.id, formData);
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData as BlogPost,
      };
      addBlogPost(newPost);
    }
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este post?')) {
      deleteBlogPost(id);
    }
  };

  const handleArrayInput = (field: 'keywords', value: string) => {
    const array = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: array });
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="heading text-3xl md:text-4xl">
            {editingPost ? 'EDITAR POST' : 'NUEVO POST'}
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
                placeholder="Ej: Cómo implementar IA en tu estrategia de marketing"
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
                  placeholder="como-implementar-ia-marketing"
                />
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Categoría *</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="Inteligencia Artificial"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Autor */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Autor</label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="INÉDITO DIGITAL"
                />
              </div>

              {/* Read Time */}
              <div>
                <label className="block text-sm text-white/80 mb-2">Tiempo de Lectura</label>
                <input
                  type="text"
                  value={formData.readTime || ''}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
                  placeholder="5 min"
                />
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Fecha de Publicación</label>
              <input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Extracto/Resumen *</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                placeholder="Breve resumen del artículo (2-3 líneas)"
              />
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Contenido Completo *</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none font-mono text-sm"
                placeholder="Contenido del artículo en formato Markdown..."
              />
              <p className="text-xs text-white/40 mt-1">
                Puedes usar Markdown para formato (ej: **negrita**, *cursiva*, ## Título)
              </p>
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
                  placeholder="Título optimizado para SEO (60 caracteres)"
                />
              </div>

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

              <div>
                <label className="block text-sm text-white/80 mb-2">Keywords (una por línea)</label>
                <textarea
                  value={formData.keywords?.join('\n') || ''}
                  onChange={(e) => handleArrayInput('keywords', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#7700CE] outline-none transition-all resize-none"
                  placeholder="inteligencia artificial marketing&#10;ia en negocios&#10;automatización marketing"
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
          <h1 className="heading text-3xl md:text-4xl mb-2">BLOG</h1>
          <p className="text-white/60">Artículos y contenido educativo</p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all"
        >
          <Plus size={18} />
          <span className="font-medium">Nuevo Post</span>
        </button>
      </div>

      <div className="grid gap-4">
        {blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <GlassCard key={post.id}>
              <div className="flex items-center gap-4">
                {post.image && (
                  <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#7700CE] font-medium">{post.category}</span>
                    <span className="text-xs text-white/40">•</span>
                    <span className="text-xs text-white/40">{new Date(post.date).toLocaleDateString('es-MX')}</span>
                  </div>
                  <h3 className="heading text-lg md:text-xl mb-1">{post.title}</h3>
                  <p className="text-white/60 text-sm mb-2">{post.author}</p>
                  <p className="text-white/40 text-xs line-clamp-2">{post.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2.5 rounded-full bg-[#7700CE]/20 text-[#7700CE] hover:bg-[#7700CE]/30 transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
            <p className="text-white/40 text-center py-8">No hay posts registrados aún</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
