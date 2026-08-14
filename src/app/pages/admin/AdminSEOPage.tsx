import { useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Save, AlertCircle, CheckCircle, Globe, FileText, Settings, Search, Code, Link as LinkIcon, Image, Tag, Map } from 'lucide-react';
import { motion } from 'motion/react';
import SitemapGenerator from '../../components/SitemapGenerator';

interface PageSEO {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  enabled: boolean;
}

export default function AdminSEOPage() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'pages' | 'global' | 'schemas' | 'sitemap'>('pages');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // SEO por página
  const [pageSEO, setPageSEO] = useState<PageSEO[]>([
    {
      path: '/',
      title: 'Agencia de Marketing Digital e Inteligencia Artificial Aguascalientes | INÉDITO DIGITAL',
      description: 'Agencia de Marketing Digital e Inteligencia Artificial en Aguascalientes. Especialistas en SEO, Google Ads, Chatbots IA, Desarrollo Web y Automatización. Aumenta tus ventas 300% con estrategias comprobadas.',
      keywords: ['agencia de marketing digital e inteligencia artificial aguascalientes', 'agencia de marketing digital aguascalientes', 'marketing digital aguascalientes', 'seo aguascalientes', 'google ads aguascalientes', 'chatbots ia', 'desarrollo web aguascalientes', 'inteligencia artificial aguascalientes'],
      ogImage: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp',
      canonical: 'https://www.inedito.digital/',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios',
      title: 'Servicios de Marketing Digital e IA en Aguascalientes | INÉDITO DIGITAL',
      description: 'Servicios completos de marketing digital e inteligencia artificial: SEO, Google Ads, Desarrollo Web, Chatbots IA, Branding, Email Marketing, Funnels. Agencia en Aguascalientes con resultados comprobados.',
      keywords: ['servicios marketing digital aguascalientes', 'agencia seo aguascalientes', 'desarrollo web aguascalientes', 'chatbots inteligencia artificial', 'google ads aguascalientes', 'email marketing'],
      canonical: 'https://www.inedito.digital/servicios',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/diseno-y-desarrollo-web',
      title: 'Diseño y Desarrollo Web en Aguascalientes | Sitios que Convierten | INÉDITO',
      description: 'Desarrollo web profesional en Aguascalientes. Sitios responsive, rápidos, optimizados para SEO y conversión. Aumenta tus ventas hasta 300%. Agencia experta en WordPress, React y tecnologías modernas.',
      keywords: ['diseño web aguascalientes', 'desarrollo web aguascalientes', 'páginas web aguascalientes', 'sitios web profesionales', 'diseño web responsive'],
      canonical: 'https://www.inedito.digital/servicios/diseno-y-desarrollo-web',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/chatbots-y-agentes',
      title: 'Chatbots con IA en Aguascalientes | WhatsApp, Facebook, Web | INÉDITO',
      description: 'Chatbots con inteligencia artificial para WhatsApp, Facebook e Instagram. Automatiza tu atención 24/7, califica leads y vende mientras duermes. Implementación en Aguascalientes.',
      keywords: ['chatbots ia aguascalientes', 'chatbot whatsapp', 'chatbots inteligencia artificial', 'automatización atención cliente', 'bot whatsapp business'],
      canonical: 'https://www.inedito.digital/servicios/chatbots-y-agentes',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/funnels-de-venta',
      title: 'Funnels de Venta de Alta Conversión | Landing Pages + Email Marketing',
      description: 'Funnels de venta optimizados que convierten tráfico en clientes. Landing pages de alta conversión, secuencias de email automatizadas, A/B testing. Aumenta tus ventas 400% con funnels científicos.',
      keywords: ['funnels de venta', 'embudo de conversión', 'landing page aguascalientes', 'funnel marketing digital', 'optimización conversión'],
      canonical: 'https://www.inedito.digital/servicios/funnels-de-venta',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/posicionamiento-organico',
      title: 'Posicionamiento SEO en Aguascalientes | Primeras Posiciones Google',
      description: 'Posicionamiento SEO en Aguascalientes. Llega a las primeras posiciones de Google con estrategias probadas. SEO local, nacional e internacional. Tráfico orgánico garantizado en 3-6 meses.',
      keywords: ['seo aguascalientes', 'posicionamiento seo aguascalientes', 'posicionamiento google aguascalientes', 'seo local aguascalientes', 'agencia seo'],
      canonical: 'https://www.inedito.digital/servicios/posicionamiento-organico',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/google-ads',
      title: 'Google Ads en Aguascalientes | Campañas Rentables desde $300 USD/mes',
      description: 'Gestión profesional de Google Ads en Aguascalientes. Campañas rentables con ROI 5:1 promedio. Búsqueda, Display, Shopping, YouTube. Resultados inmediatos desde el primer día.',
      keywords: ['google ads aguascalientes', 'publicidad google aguascalientes', 'sem aguascalientes', 'google adwords', 'campañas google ads'],
      canonical: 'https://www.inedito.digital/servicios/google-ads',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/branding',
      title: 'Branding y Identidad Corporativa en Aguascalientes | INÉDITO DIGITAL',
      description: 'Branding profesional en Aguascalientes. Identidad corporativa completa: logo, manual de marca, colores, tipografías. Destaca de la competencia con una marca memorable y consistente.',
      keywords: ['branding aguascalientes', 'identidad corporativa aguascalientes', 'diseño de marca', 'manual de marca', 'diseño logo aguascalientes'],
      canonical: 'https://www.inedito.digital/servicios/branding',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/servicios-qr',
      title: 'Códigos QR Inteligentes y Dinámicos en Aguascalientes | Trackeo Total',
      description: 'Códigos QR dinámicos con tracking en tiempo real. QR para menús, pagos, propinas, eventos, marketing. Actualiza destinos sin reimprimir. Servicio en Aguascalientes.',
      keywords: ['códigos qr aguascalientes', 'qr dinámico', 'menú digital qr', 'qr para restaurantes', 'qr marketing'],
      canonical: 'https://www.inedito.digital/servicios/servicios-qr',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/email-marketing',
      title: 'Email Marketing en Aguascalientes | ROI $42 por cada $1 invertido',
      description: 'Campañas de email marketing con el mejor ROI. Automatizaciones, segmentación avanzada, recuperación de carritos. Nutre leads y convierte con emails estratégicos. Servicio en Aguascalientes.',
      keywords: ['email marketing aguascalientes', 'campañas email', 'email automatizado', 'newsletter', 'mailchimp aguascalientes'],
      canonical: 'https://www.inedito.digital/servicios/email-marketing',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/creacion-de-logo',
      title: 'Diseño de Logo Profesional en Aguascalientes | Desde $2,500 MXN',
      description: 'Creación de logos profesionales y memorables en Aguascalientes. 3 conceptos iniciales, revisiones ilimitadas, todos los formatos. Logo que representa la esencia de tu marca.',
      keywords: ['diseño de logo aguascalientes', 'creación de logo', 'diseño logo profesional', 'logos creativos aguascalientes'],
      canonical: 'https://www.inedito.digital/servicios/creacion-de-logo',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios/activaciones-para-expo',
      title: 'Activaciones Digitales para Expo en Aguascalientes | Photobooth, RA, Gamificación',
      description: 'Activaciones digitales interactivas para expos y ferias en Aguascalientes. Photobooth RA, gamificación, registro digital, encuestas en vivo. Captura leads calificados y destaca en tu stand.',
      keywords: ['activaciones digitales aguascalientes', 'photobooth expo', 'activaciones para ferias', 'gamificación eventos', 'realidad aumentada expo'],
      canonical: 'https://www.inedito.digital/servicios/activaciones-para-expo',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios-ia',
      title: 'Servicios de Inteligencia Artificial para Negocios | WhatsApp, Ventas, Marketing',
      description: 'Implementa IA en tu negocio: Chatbots WhatsApp 24/7, automatización de ventas, marketing predictivo, e-commerce inteligente. Agencia especializada en IA empresarial en Aguascalientes.',
      keywords: ['inteligencia artificial negocios', 'ia empresarial', 'chatbots ia whatsapp', 'automatización ia', 'marketing con ia'],
      canonical: 'https://www.inedito.digital/servicios-ia',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios-ia/whatsapp',
      title: 'IA para WhatsApp Business | Chatbot Inteligente 24/7 | INÉDITO',
      description: 'Chatbot con IA para WhatsApp Business. Atiende clientes 24/7, califica leads automáticamente, agenda citas, responde FAQs. Vende mientras duermes. Implementación en Aguascalientes.',
      keywords: ['ia whatsapp', 'chatbot whatsapp ia', 'whatsapp business automatizado', 'bot inteligente whatsapp'],
      canonical: 'https://www.inedito.digital/servicios-ia/whatsapp',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios-ia/ventas',
      title: 'IA de Ventas | Automatiza Prospección y Cierre | INÉDITO DIGITAL',
      description: 'Inteligencia Artificial para automatizar tu proceso de ventas. Prospección inteligente, calificación de leads, seguimiento automático, predicción de cierre. Aumenta conversión 200%.',
      keywords: ['ia ventas', 'automatización ventas', 'crm inteligente', 'prospección automática', 'sales automation'],
      canonical: 'https://www.inedito.digital/servicios-ia/ventas',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios-ia/marketing',
      title: 'IA para Marketing Digital | Optimización Automática de Campañas | INÉDITO',
      description: 'Marketing digital potenciado con IA. Optimización automática de anuncios, personalización 1:1, predicción de comportamiento, contenido generado por IA. Reduce costos y aumenta ROI.',
      keywords: ['ia marketing digital', 'marketing automation ia', 'publicidad inteligente', 'personalizacion ia'],
      canonical: 'https://www.inedito.digital/servicios-ia/marketing',
      noindex: false,
      nofollow: false
    },
    {
      path: '/servicios-ia/ecommerce',
      title: 'IA para E-commerce | Aumenta Ventas Online hasta 400% | INÉDITO',
      description: 'Inteligencia Artificial para tiendas online. Recomendaciones personalizadas, chatbot de ventas, recuperación de carritos, pricing dinámico. Convierte más visitas en ventas.',
      keywords: ['ia ecommerce', 'tienda online inteligente', 'recomendaciones personalizadas', 'chatbot ventas online'],
      canonical: 'https://www.inedito.digital/servicios-ia/ecommerce',
      noindex: false,
      nofollow: false
    },
    {
      path: '/portafolio',
      title: 'Portafolio - Casos de Éxito de Marketing Digital en Aguascalientes',
      description: 'Conoce nuestros casos de éxito reales: OFITODO (+340% conversión), Aldea Digital (120+ leads/mes), Early Ties, 1828, XPO SEDDE, Evince. Resultados medibles en Aguascalientes.',
      keywords: ['casos de exito marketing digital', 'portafolio agencia aguascalientes', 'proyectos web aguascalientes', 'diseño web casos exito'],
      canonical: 'https://www.inedito.digital/portafolio',
      noindex: false,
      nofollow: false
    },
    {
      path: '/blog',
      title: 'Blog de Marketing Digital, SEO e IA | Tips y Estrategias Probadas',
      description: 'Blog con estrategias de marketing digital, SEO, Google Ads, Chatbots IA y más. Contenido práctico y actualizado para hacer crecer tu negocio online. Agencia en Aguascalientes.',
      keywords: ['blog marketing digital', 'blog seo aguascalientes', 'consejos marketing digital', 'estrategias digitales'],
      canonical: 'https://www.inedito.digital/blog',
      noindex: false,
      nofollow: false
    },
    {
      path: '/nosotros',
      title: 'Sobre Nosotros - Agencia de Marketing Digital e IA en Aguascalientes',
      description: 'Conoce a INÉDITO DIGITAL, agencia especializada en marketing digital e inteligencia artificial en Aguascalientes. 100+ proyectos exitosos, 5X ROI promedio, 98% satisfacción de clientes.',
      keywords: ['agencia marketing aguascalientes', 'sobre inedito digital', 'equipo marketing digital', 'agencia ia aguascalientes'],
      canonical: 'https://www.inedito.digital/nosotros',
      noindex: false,
      nofollow: false
    },
    {
      path: '/contacto',
      title: 'Contacto - Cotiza Gratis tu Proyecto Digital | Respuesta en 24hrs',
      description: 'Contáctanos para cotización gratuita de tu proyecto. WhatsApp: +52 449 120 4353. Respuesta en menos de 24 horas. Agencia de marketing digital e IA en Aguascalientes.',
      keywords: ['contacto agencia marketing aguascalientes', 'cotizar marketing digital', 'consultoría gratuita', 'whatsapp marketing digital'],
      canonical: 'https://www.inedito.digital/contacto',
      noindex: false,
      nofollow: false
    }
  ]);

  const [selectedPage, setSelectedPage] = useState(0);
  
  // Configuración global SEO
  const [globalSEO, setGlobalSEO] = useState({
    siteName: 'INÉDITO DIGITAL',
    defaultImage: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp',
    twitterHandle: '@ineditodigital',
    fbAppId: '',
    googleAnalytics: settings.googleAnalyticsId || '',
    facebookPixel: settings.facebookPixelId || '',
    googleSiteVerification: '',
    bingVerification: '',
    author: 'INÉDITO DIGITAL'
  });

  // Schema markup global
  const [schemaConfig, setSchemaConfig] = useState({
    organizationName: 'INÉDITO DIGITAL',
    organizationType: 'LocalBusiness',
    address: settings.businessAddress,
    city: settings.businessCity,
    state: settings.businessState,
    zip: settings.businessZip,
    phone: settings.businessPhone,
    email: settings.businessEmail,
    latitude: '21.8853',
    longitude: '-102.2916',
    priceRange: '$$',
    openingHours: 'Mo-Fr 09:00-18:00',
    socialMedia: {
      facebook: 'https://www.facebook.com/ineditodigital',
      instagram: 'https://www.instagram.com/ineditodigital',
      linkedin: 'https://www.linkedin.com/company/ineditodigital'
    }
  });

  // Sitemap URLs
  const [sitemapURLs, setSitemapURLs] = useState<SitemapURL[]>([
    {
      loc: 'https://www.inedito.digital/',
      lastmod: '2023-10-01',
      changefreq: 'weekly',
      priority: 1.0,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/servicios',
      lastmod: '2023-10-01',
      changefreq: 'monthly',
      priority: 0.8,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/portafolio',
      lastmod: '2023-10-01',
      changefreq: 'monthly',
      priority: 0.8,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/blog',
      lastmod: '2023-10-01',
      changefreq: 'weekly',
      priority: 0.7,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/nosotros',
      lastmod: '2023-10-01',
      changefreq: 'monthly',
      priority: 0.6,
      enabled: true
    },
    {
      loc: 'https://www.inedito.digital/contacto',
      lastmod: '2023-10-01',
      changefreq: 'monthly',
      priority: 0.6,
      enabled: true
    }
  ]);

  const handleSavePageSEO = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      // Aquí guardarías en localStorage o backend
      localStorage.setItem('inedito_seo_pages', JSON.stringify(pageSEO));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleSaveGlobalSEO = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('inedito_seo_global', JSON.stringify(globalSEO));
      updateSettings({
        googleAnalyticsId: globalSEO.googleAnalytics,
        facebookPixelId: globalSEO.facebookPixel
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleSaveSchema = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      localStorage.setItem('inedito_seo_schema', JSON.stringify(schemaConfig));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

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
    <priority>${url.priority}</priority>
    ${url.loc === 'https://www.inedito.digital/' || url.loc === 'https://www.inedito.digital/contacto' ? `<geo:geo>
      <geo:format>kml</geo:format>
    </geo:geo>` : ''}
  </url>`).join('\n')}
</urlset>`;
  };

  const updatePageSEO = (index: number, field: keyof PageSEO, value: any) => {
    const updated = [...pageSEO];
    updated[index] = { ...updated[index], [field]: value };
    setPageSEO(updated);
  };

  const tabs = [
    { id: 'pages', label: 'SEO por Página', icon: FileText },
    { id: 'global', label: 'Configuración Global', icon: Settings },
    { id: 'schemas', label: 'Schema Markup', icon: Code },
    { id: 'sitemap', label: 'Sitemap', icon: Map }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading text-3xl md:text-4xl mb-2">SEO MANAGER</h1>
        <p className="text-white/60 text-sm md:text-base">Gestión completa de metadatos, schemas y optimización SEO</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#7700CE] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SEO por Página */}
      {activeTab === 'pages' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Lista de páginas */}
          <div className="lg:col-span-1">
            <GlassCard>
              <h3 className="heading text-lg mb-4 flex items-center gap-2">
                <Globe size={20} className="text-[#7700CE]" />
                Páginas del Sitio
              </h3>
              <div className="space-y-2">
                {pageSEO.map((page, index) => (
                  <button
                    key={page.path}
                    onClick={() => setSelectedPage(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedPage === index
                        ? 'bg-[#7700CE]/20 border border-[#7700CE]/40'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="font-mono text-xs text-[#7700CE]">{page.path}</div>
                    <div className="text-sm text-white/80 truncate">{page.title}</div>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Editor de SEO */}
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading text-lg flex items-center gap-2">
                  <Search size={20} className="text-[#7700CE]" />
                  Editar SEO: {pageSEO[selectedPage].path}
                </h3>
                <button
                  onClick={handleSavePageSEO}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#7700CE] hover:bg-[#9933FF] rounded-lg transition-all disabled:opacity-50 text-sm"
                >
                  {saveStatus === 'saving' ? (
                    <>Guardando...</>
                  ) : saveStatus === 'success' ? (
                    <>
                      <CheckCircle size={16} />
                      Guardado
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Guardar
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Tag size={16} className="text-[#7700CE]" />
                    Meta Title
                    <span className="text-xs text-white/40">({pageSEO[selectedPage].title.length}/60 caracteres)</span>
                  </label>
                  <input
                    type="text"
                    value={pageSEO[selectedPage].title}
                    onChange={(e) => updatePageSEO(selectedPage, 'title', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                    maxLength={60}
                  />
                  {pageSEO[selectedPage].title.length > 60 && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      El título es demasiado largo para Google
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <FileText size={16} className="text-[#7700CE]" />
                    Meta Description
                    <span className="text-xs text-white/40">({pageSEO[selectedPage].description.length}/160 caracteres)</span>
                  </label>
                  <textarea
                    value={pageSEO[selectedPage].description}
                    onChange={(e) => updatePageSEO(selectedPage, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm resize-none"
                    maxLength={160}
                  />
                  {pageSEO[selectedPage].description.length > 160 && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      La descripción es demasiado larga para Google
                    </p>
                  )}
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Tag size={16} className="text-[#7700CE]" />
                    Keywords (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={pageSEO[selectedPage].keywords.join(', ')}
                    onChange={(e) => updatePageSEO(selectedPage, 'keywords', e.target.value.split(',').map(k => k.trim()))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                    placeholder="marketing digital, seo, aguascalientes"
                  />
                </div>

                {/* OG Image */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <Image size={16} className="text-[#7700CE]" />
                    Open Graph Image (URL)
                  </label>
                  <input
                    type="url"
                    value={pageSEO[selectedPage].ogImage || ''}
                    onChange={(e) => updatePageSEO(selectedPage, 'ogImage', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Canonical URL */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                    <LinkIcon size={16} className="text-[#7700CE]" />
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={pageSEO[selectedPage].canonical || ''}
                    onChange={(e) => updatePageSEO(selectedPage, 'canonical', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                    placeholder="https://www.inedito.digital/"
                  />
                </div>

                {/* Robots */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-3">Configuración de Robots</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pageSEO[selectedPage].noindex || false}
                        onChange={(e) => updatePageSEO(selectedPage, 'noindex', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7700CE] focus:ring-[#7700CE]"
                      />
                      <span className="text-sm text-white/80">No Index (ocultar de Google)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pageSEO[selectedPage].nofollow || false}
                        onChange={(e) => updatePageSEO(selectedPage, 'nofollow', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7700CE] focus:ring-[#7700CE]"
                      />
                      <span className="text-sm text-white/80">No Follow (no seguir links)</span>
                    </label>
                  </div>
                </div>

                {/* Vista previa */}
                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h4 className="text-xs font-medium text-white/60 mb-3">VISTA PREVIA EN GOOGLE</h4>
                  <div className="space-y-1">
                    <div className="text-blue-400 text-base hover:underline cursor-pointer">
                      {pageSEO[selectedPage].title}
                    </div>
                    <div className="text-green-600 text-xs">
                      {pageSEO[selectedPage].canonical || 'www.inedito.digital' + pageSEO[selectedPage].path}
                    </div>
                    <div className="text-white/60 text-sm">
                      {pageSEO[selectedPage].description}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Configuración Global */}
      {activeTab === 'global' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading text-lg flex items-center gap-2">
              <Settings size={20} className="text-[#7700CE]" />
              Configuración Global del Sitio
            </h3>
            <button
              onClick={handleSaveGlobalSEO}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 bg-[#7700CE] hover:bg-[#9933FF] rounded-lg transition-all disabled:opacity-50 text-sm"
            >
              {saveStatus === 'saving' ? (
                <>Guardando...</>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  Guardado
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar
                </>
              )}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Información General */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/90 mb-3">Información General</h4>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Nombre del Sitio</label>
                <input
                  type="text"
                  value={globalSEO.siteName}
                  onChange={(e) => setGlobalSEO({...globalSEO, siteName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Imagen por Defecto (OG)</label>
                <input
                  type="url"
                  value={globalSEO.defaultImage}
                  onChange={(e) => setGlobalSEO({...globalSEO, defaultImage: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Twitter Handle</label>
                <input
                  type="text"
                  value={globalSEO.twitterHandle}
                  onChange={(e) => setGlobalSEO({...globalSEO, twitterHandle: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  placeholder="@ineditodigital"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Facebook App ID</label>
                <input
                  type="text"
                  value={globalSEO.fbAppId}
                  onChange={(e) => setGlobalSEO({...globalSEO, fbAppId: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Autor por Defecto</label>
                <input
                  type="text"
                  value={globalSEO.author}
                  onChange={(e) => setGlobalSEO({...globalSEO, author: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Analytics y Tracking */}
            <div className="space-y-4">
              <h4 className="font-medium text-white/90 mb-3">Analytics y Tracking</h4>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  value={globalSEO.googleAnalytics}
                  onChange={(e) => setGlobalSEO({...globalSEO, googleAnalytics: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={globalSEO.facebookPixel}
                  onChange={(e) => setGlobalSEO({...globalSEO, facebookPixel: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  placeholder="XXXXXXXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Google Site Verification</label>
                <input
                  type="text"
                  value={globalSEO.googleSiteVerification}
                  onChange={(e) => setGlobalSEO({...globalSEO, googleSiteVerification: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  placeholder="código de verificación"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Bing Site Verification</label>
                <input
                  type="text"
                  value={globalSEO.bingVerification}
                  onChange={(e) => setGlobalSEO({...globalSEO, bingVerification: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  placeholder="código de verificación"
                />
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Schema Markup */}
      {activeTab === 'schemas' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading text-lg flex items-center gap-2">
              <Code size={20} className="text-[#7700CE]" />
              Schema.org Markup (Datos Estructurados)
            </h3>
            <button
              onClick={handleSaveSchema}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 bg-[#7700CE] hover:bg-[#9933FF] rounded-lg transition-all disabled:opacity-50 text-sm"
            >
              {saveStatus === 'saving' ? (
                <>Guardando...</>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  Guardado
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {/* Organization Schema */}
            <div>
              <h4 className="font-medium text-white/90 mb-4">LocalBusiness Schema</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Nombre de la Organización</label>
                  <input
                    type="text"
                    value={schemaConfig.organizationName}
                    onChange={(e) => setSchemaConfig({...schemaConfig, organizationName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Tipo de Organización</label>
                  <select
                    value={schemaConfig.organizationType}
                    onChange={(e) => setSchemaConfig({...schemaConfig, organizationType: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  >
                    <option value="LocalBusiness">LocalBusiness</option>
                    <option value="Organization">Organization</option>
                    <option value="Corporation">Corporation</option>
                    <option value="ProfessionalService">ProfessionalService</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={schemaConfig.address}
                    onChange={(e) => setSchemaConfig({...schemaConfig, address: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Ciudad</label>
                  <input
                    type="text"
                    value={schemaConfig.city}
                    onChange={(e) => setSchemaConfig({...schemaConfig, city: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Estado</label>
                  <input
                    type="text"
                    value={schemaConfig.state}
                    onChange={(e) => setSchemaConfig({...schemaConfig, state: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Código Postal</label>
                  <input
                    type="text"
                    value={schemaConfig.zip}
                    onChange={(e) => setSchemaConfig({...schemaConfig, zip: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={schemaConfig.phone}
                    onChange={(e) => setSchemaConfig({...schemaConfig, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Email</label>
                  <input
                    type="email"
                    value={schemaConfig.email}
                    onChange={(e) => setSchemaConfig({...schemaConfig, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Latitud</label>
                  <input
                    type="text"
                    value={schemaConfig.latitude}
                    onChange={(e) => setSchemaConfig({...schemaConfig, latitude: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Longitud</label>
                  <input
                    type="text"
                    value={schemaConfig.longitude}
                    onChange={(e) => setSchemaConfig({...schemaConfig, longitude: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Rango de Precios</label>
                  <select
                    value={schemaConfig.priceRange}
                    onChange={(e) => setSchemaConfig({...schemaConfig, priceRange: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  >
                    <option value="$">$ (Económico)</option>
                    <option value="$$">$$ (Moderado)</option>
                    <option value="$$$">$$$ (Caro)</option>
                    <option value="$$$$">$$$$ (Muy Caro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Horarios (formato OpeningHours)</label>
                  <input
                    type="text"
                    value={schemaConfig.openingHours}
                    onChange={(e) => setSchemaConfig({...schemaConfig, openingHours: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                    placeholder="Mo-Fr 09:00-18:00"
                  />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-medium text-white/90 mb-4">Redes Sociales</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={schemaConfig.socialMedia.facebook}
                    onChange={(e) => setSchemaConfig({
                      ...schemaConfig,
                      socialMedia: {...schemaConfig.socialMedia, facebook: e.target.value}
                    })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={schemaConfig.socialMedia.instagram}
                    onChange={(e) => setSchemaConfig({
                      ...schemaConfig,
                      socialMedia: {...schemaConfig.socialMedia, instagram: e.target.value}
                    })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    value={schemaConfig.socialMedia.linkedin}
                    onChange={(e) => setSchemaConfig({
                      ...schemaConfig,
                      socialMedia: {...schemaConfig.socialMedia, linkedin: e.target.value}
                    })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Schema Preview */}
            <div>
              <h4 className="font-medium text-white/90 mb-3">Vista Previa del Schema JSON-LD</h4>
              <div className="p-4 bg-black/40 border border-white/10 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": schemaConfig.organizationType,
  "name": schemaConfig.organizationName,
  "image": globalSEO.defaultImage,
  "url": "https://www.inedito.digital",
  "telephone": schemaConfig.phone,
  "email": schemaConfig.email,
  "priceRange": schemaConfig.priceRange,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": schemaConfig.address,
    "addressLocality": schemaConfig.city,
    "addressRegion": schemaConfig.state,
    "postalCode": schemaConfig.zip,
    "addressCountry": "MX"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": schemaConfig.latitude,
    "longitude": schemaConfig.longitude
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    schemaConfig.socialMedia.facebook,
    schemaConfig.socialMedia.instagram,
    schemaConfig.socialMedia.linkedin
  ]
}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Sitemap */}
      {activeTab === 'sitemap' && (
        <SitemapGenerator />
      )}

      {/* Sitemap OLD - REMOVE */}
      {false && activeTab === 'sitemap' && (
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading text-lg flex items-center gap-2">
              <Map size={20} className="text-[#7700CE]" />
              Sitemap del Sitio
            </h3>
            <button
              onClick={handleSaveSitemap}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 bg-[#7700CE] hover:bg-[#9933FF] rounded-lg transition-all disabled:opacity-50 text-sm"
            >
              {saveStatus === 'saving' ? (
                <>Guardando...</>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  Guardado
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {/* Sitemap URLs */}
            <div>
              <h4 className="font-medium text-white/90 mb-4">URLs del Sitemap</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {sitemapURLs.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={url.enabled}
                        onChange={(e) => setSitemapURLs(sitemapURLs.map((u, i) => i === index ? {...u, enabled: e.target.checked} : u))}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7700CE] focus:ring-[#7700CE]"
                      />
                      <label className="text-sm text-white/80">Incluir en Sitemap</label>
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">URL</label>
                      <input
                        type="url"
                        value={url.loc}
                        onChange={(e) => setSitemapURLs(sitemapURLs.map((u, i) => i === index ? {...u, loc: e.target.value} : u))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Última Modificación</label>
                      <input
                        type="date"
                        value={url.lastmod}
                        onChange={(e) => setSitemapURLs(sitemapURLs.map((u, i) => i === index ? {...u, lastmod: e.target.value} : u))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/70 mb-2">Frecuencia de Cambio</label>
                      <select
                        value={url.changefreq}
                        onChange={(e) => setSitemapURLs(sitemapURLs.map((u, i) => i === index ? {...u, changefreq: e.target.value as 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'} : u))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
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
                      <label className="block text-sm text-white/70 mb-2">Prioridad</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.0"
                        max="1.0"
                        value={url.priority}
                        onChange={(e) => setSitemapURLs(sitemapURLs.map((u, i) => i === index ? {...u, priority: parseFloat(e.target.value)} : u))}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#7700CE] focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sitemap Preview */}
            <div>
              <h4 className="font-medium text-white/90 mb-3">Vista Previa del Sitemap XML</h4>
              <div className="p-4 bg-black/40 border border-white/10 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapURLs.filter(url => url.enabled).map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`).join('\n')}
</urlset>`}
                </pre>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Status Message */}
      {saveStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-2"
        >
          <CheckCircle size={20} />
          <span>Cambios guardados correctamente</span>
        </motion.div>
      )}
    </div>
  );
}