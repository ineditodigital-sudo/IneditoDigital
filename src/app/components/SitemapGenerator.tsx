import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Map, Download, Copy, AlertCircle, CheckCircle, Save, Code, ExternalLink, Globe } from 'lucide-react';

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  enabled: boolean;
}

export default function SitemapGenerator() {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [sitemapURLs, setSitemapURLs] = useState<SitemapURL[]>([
    {
      loc: 'https://www.inedito.digital/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 1.0,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/servicios',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.8,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/portafolio',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.8,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/blog',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.7,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/nosotros',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/contacto',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 0.6,
      enabled: true
    }
  ]);

  const handleSaveSitemap = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('inedito_seo_sitemap', JSON.stringify(sitemapURLs));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const generateSitemapXML = () => {
    const enabledURLs = sitemapURLs.filter(url => url.enabled);
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:geo="http://www.google.com/geo/schemas/sitemap/1.0">
${enabledURLs.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.loc.includes('/contacto') || url.loc === 'https://www.inedito.digital/' ? `
    <geo:geo>
      <geo:format>kml</geo:format>
    </geo:geo>` : ''}
  </url>`).join('\n')}
</urlset>`;
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="heading text-lg flex items-center gap-2 mb-2">
              <Map size={20} className="text-[#7700CE]" />
              Generador de Sitemap XML
            </h3>
            <p className="text-white/60 text-sm">Optimizado para SEO y GEO - Aguascalientes, México</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const sitemapXML = generateSitemapXML();
                navigator.clipboard.writeText(sitemapXML);
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 2000);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
            >
              <Copy size={16} />
              Copiar XML
            </button>
            <button
              onClick={() => {
                const sitemapXML = generateSitemapXML();
                const blob = new Blob([sitemapXML], { type: 'application/xml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'sitemap.xml';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#7700CE] hover:bg-[#9933FF] rounded-lg transition-all text-sm"
            >
              <Download size={16} />
              Descargar Sitemap
            </button>
          </div>
        </div>

        {/* Información SEO GEO */}
        <div className="mb-6 p-4 bg-[#7700CE]/10 border border-[#7700CE]/30 rounded-lg">
          <h4 className="text-sm font-medium text-white/90 mb-2 flex items-center gap-2">
            <AlertCircle size={16} className="text-[#7700CE]" />
            Beneficios del Sitemap para SEO Local
          </h4>
          <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
            <li>Mejora la indexación de tus páginas en Google</li>
            <li>Ayuda a Google a encontrar contenido nuevo más rápido</li>
            <li>Optimizado para búsquedas locales en Aguascalientes</li>
            <li>Incluye prioridades para páginas clave de servicios</li>
            <li>Compatible con Google Search Console y Bing Webmaster Tools</li>
          </ul>
        </div>

        {/* Estadísticas del Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-2xl font-bold text-white mb-1">
              {sitemapURLs.filter(u => u.enabled).length}
            </div>
            <div className="text-xs text-white/60">URLs Activas</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-2xl font-bold text-white mb-1">
              {sitemapURLs.filter(u => u.enabled && u.priority >= 0.8).length}
            </div>
            <div className="text-xs text-white/60">Alta Prioridad</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-2xl font-bold text-white mb-1">
              {sitemapURLs.filter(u => u.enabled && (u.changefreq === 'daily' || u.changefreq === 'weekly')).length}
            </div>
            <div className="text-xs text-white/60">Actualización Frecuente</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-2xl font-bold text-[#7700CE] mb-1">
              100%
            </div>
            <div className="text-xs text-white/60">Optimización SEO</div>
          </div>
        </div>

        {/* URLs del Sitemap */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-white/90">Gestión de URLs</h4>
            <button
              onClick={handleSaveSitemap}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-xs"
            >
              {saveStatus === 'saving' ? (
                <>Guardando...</>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle size={14} />
                  Guardado
                </>
              ) : (
                <>
                  <Save size={14} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            {sitemapURLs.map((url, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transition-all ${
                  url.enabled 
                    ? 'bg-white/5 border-white/10' 
                    : 'bg-white/[0.02] border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={url.enabled}
                      onChange={(e) => {
                        const updated = [...sitemapURLs];
                        updated[index].enabled = e.target.checked;
                        setSitemapURLs(updated);
                      }}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#7700CE] focus:ring-[#7700CE]"
                    />
                    <div className="flex-1">
                      <div className="font-mono text-sm text-[#7700CE] break-all mb-1">{url.loc}</div>
                      <div className="flex flex-wrap gap-2 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Globe size={12} />
                          {url.changefreq}
                        </span>
                        <span>•</span>
                        <span>Prioridad: {url.priority}</span>
                        <span>•</span>
                        <span>Última modificación: {url.lastmod}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Última Modificación</label>
                    <input
                      type="date"
                      value={url.lastmod}
                      onChange={(e) => {
                        const updated = [...sitemapURLs];
                        updated[index].lastmod = e.target.value;
                        setSitemapURLs(updated);
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-[#7700CE] focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Frecuencia de Cambio</label>
                    <select
                      value={url.changefreq}
                      onChange={(e) => {
                        const updated = [...sitemapURLs];
                        updated[index].changefreq = e.target.value as any;
                        setSitemapURLs(updated);
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-[#7700CE] focus:outline-none"
                    >
                      <option value="always">Siempre</option>
                      <option value="hourly">Cada hora</option>
                      <option value="daily">Diariamente</option>
                      <option value="weekly">Semanalmente</option>
                      <option value="monthly">Mensualmente</option>
                      <option value="yearly">Anualmente</option>
                      <option value="never">Nunca</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Prioridad (0.0 - 1.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.0"
                      max="1.0"
                      value={url.priority}
                      onChange={(e) => {
                        const updated = [...sitemapURLs];
                        updated[index].priority = parseFloat(e.target.value);
                        setSitemapURLs(updated);
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-[#7700CE] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Vista Previa y Instrucciones */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vista Previa XML */}
        <GlassCard>
          <h4 className="font-medium text-white/90 mb-3 flex items-center gap-2">
            <Code size={18} className="text-[#7700CE]" />
            Vista Previa del Sitemap XML
          </h4>
          <div className="p-4 bg-black/40 border border-white/10 rounded-lg overflow-auto max-h-96">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{generateSitemapXML()}
            </pre>
          </div>
        </GlassCard>

        {/* Instrucciones de Implementación */}
        <GlassCard>
          <h4 className="font-medium text-white/90 mb-3 flex items-center gap-2">
            <ExternalLink size={18} className="text-[#7700CE]" />
            Cómo Implementar tu Sitemap
          </h4>
          <div className="space-y-4 text-sm text-white/70">
            <div>
              <div className="font-medium text-white/90 mb-2">1. Descargar el Sitemap</div>
              <p className="text-xs">Haz clic en "Descargar Sitemap" para obtener el archivo sitemap.xml</p>
            </div>
            
            <div>
              <div className="font-medium text-white/90 mb-2">2. Subir a tu Servidor</div>
              <p className="text-xs">Coloca el archivo en la raíz de tu sitio web:</p>
              <code className="block mt-1 p-2 bg-black/40 rounded text-xs text-green-400">
                https://www.inedito.digital/sitemap.xml
              </code>
            </div>
            
            <div>
              <div className="font-medium text-white/90 mb-2">3. Enviar a Google Search Console</div>
              <p className="text-xs mb-2">Ve a Google Search Console y agrega tu sitemap:</p>
              <a 
                href="https://search.google.com/search-console" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#7700CE] hover:text-[#9933FF] transition-colors"
              >
                <ExternalLink size={12} />
                Abrir Search Console
              </a>
            </div>
            
            <div>
              <div className="font-medium text-white/90 mb-2">4. Verificar en robots.txt</div>
              <p className="text-xs mb-2">Añade esta línea a tu archivo robots.txt:</p>
              <code className="block mt-1 p-2 bg-black/40 rounded text-xs text-green-400">
                Sitemap: https://www.inedito.digital/sitemap.xml
              </code>
            </div>

            <div className="p-3 bg-[#7700CE]/10 border border-[#7700CE]/30 rounded-lg">
              <p className="text-xs text-white/80">
                <strong>💡 Tip:</strong> Actualiza tu sitemap cada vez que agregues nuevo contenido o modifiques páginas existentes.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Status Message */}
      {saveStatus === 'success' && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50">
          <CheckCircle size={20} />
          <span className="text-sm">¡Sitemap guardado correctamente!</span>
        </div>
      )}
    </div>
  );
}
