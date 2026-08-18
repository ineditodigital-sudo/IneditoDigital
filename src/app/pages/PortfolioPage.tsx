import { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Award, TrendingUp, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';
import TopographyCanvas from '../components/TopographyCanvas';
import SectionDivider from '../components/SectionDivider';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Custom Arrow Components
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#7700CE]/80 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100"
      aria-label="Anterior"
    >
      <ChevronLeft size={20} />
    </button>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-[#7700CE]/80 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100"
      aria-label="Siguiente"
    >
      <ChevronRight size={20} />
    </button>
  );
};

export default function PortfolioPage() {
  const t = contenido('portafolio', 'encabezado');
  const { portfolioItems, openAssistant } = useApp();
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(portfolioItems.map(item => item.category))];
  const filtered = filter === 'all' ? portfolioItems : portfolioItems.filter(item => item.category === filter);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    autoplay: false,
    pauseOnHover: true,
  };

  return (
    <>
      <SEO
        title="Portafolio - Casos de Éxito de INÉDITO DIGITAL | Aguascalientes"
        description="Descubre nuestros casos de éxito reales: OFITODO, Aldea Digital, Early Ties, 1828 Brasa y Carbón, XPO SEDDE, Evince/Kubera. Diseño web, SEO y resultados comprobados."
        keywords={['portafolio agencia digital aguascalientes', 'casos de éxito marketing digital', 'proyectos web aguascalientes', 'diseño web profesional']}
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-20 md:py-32">
        <TopographyCanvas />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7700CE]/20 border border-[#7700CE]/30 mb-6"
            >
              <Award className="text-[#7700CE]" size={20} />
              <span className="text-sm text-white/90">PROYECTOS DESTACADOS</span>
            </motion.div>

            <h1 className="heading text-4xl md:text-6xl lg:text-7xl mb-6">
              {t('titulo_1', 'CASOS DE')} <span className="text-[#7700CE] drop-shadow-[0_0_30px_rgba(119,0,206,0.6)]">{t('titulo_2', 'ÉXITO')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              {t('bajada', 'Descubre cómo hemos transformado negocios en Aguascalientes y México con diseño web excepcional, SEO estratégico y resultados medibles.')}
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* Filter Section */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-medium ${
                  filter === cat
                    ? 'bg-gradient-to-r from-[#7700CE] to-[#9933FF] text-white shadow-[0_0_20px_rgba(119,0,206,0.4)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat === 'all' ? 'TODOS LOS PROYECTOS' : cat.toUpperCase()}
              </button>
            ))}
          </motion.div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassCard hover className="h-full group overflow-hidden">
                  {/* Image Carousel */}
                  <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-[#7700CE]/20 to-[#9933FF]/10 relative carousel-container">
                    {(item.screenshots && item.screenshots.length > 0) ? (
                      <Slider {...settings}>
                        {item.screenshots.map((screenshot, idx) => (
                          <div key={idx} className="relative aspect-video">
                            <img 
                              src={screenshot} 
                              alt={`${item.title} - Screenshot ${idx + 1}`} 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="relative aspect-video">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.logo && (
                          <img 
                            src={item.logo} 
                            alt={`${item.client} logo`} 
                            className="h-8 w-auto object-contain"
                            loading="lazy"
                          />
                        )}
                        <span className="inline-block px-3 py-1 rounded-full bg-[#7700CE]/20 text-[#7700CE] text-xs font-bold">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-xs text-white/40">{item.year}</span>
                    </div>

                    <h2 className="heading text-xl md:text-2xl group-hover:text-[#7700CE] transition-colors line-clamp-2">
                      {item.client}
                    </h2>
                    
                    <p className="text-white/70 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.highlights.slice(0, 3).map((highlight, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2 py-1 rounded"
                        >
                          <TrendingUp size={12} className="text-[#7700CE]" />
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Services Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {item.services.slice(0, 2).map((service, i) => (
                        <span 
                          key={i}
                          className="text-xs text-white/40"
                        >
                          {service}{i < item.services.slice(0, 2).length - 1 && ' •'}
                        </span>
                      ))}
                    </div>

                    {/* Botón Visitar Sitio */}
                    <div className="pt-3">
                      <a
                        href={item.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#7700CE] to-[#9933FF] text-white font-bold text-sm hover:from-[#9933FF] hover:to-[#7700CE] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.5)] group/btn"
                      >
                        <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        VISITAR SITIO
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* CTA Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <TopographyCanvas />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <GlassCard glow className="p-8 md:p-12">
              <Award className="text-[#7700CE] mx-auto mb-6" size={48} />
              
              <h2 className="heading text-3xl md:text-4xl mb-4">
                ¿LISTO PARA TU <span className="text-[#7700CE]">CASO DE ÉXITO?</span>
              </h2>
              
              <p className="text-white/70 text-base md:text-lg mb-8">
                Agenda una consultoría gratuita y descubre cómo podemos transformar tu negocio con resultados medibles
              </p>
              
              <button
                onClick={() => openAssistant(undefined, 'agendar consultoría para crear mi caso de éxito')}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(119,0,206,0.6)] group cursor-pointer"
              >
                <span className="heading text-sm tracking-[0.08em]">AGENDAR CONSULTA GRATIS</span>
                <ExternalLink className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </>
  );
}