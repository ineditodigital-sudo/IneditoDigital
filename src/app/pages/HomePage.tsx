import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Sparkles, TrendingUp, Zap, Target, Star, Bot, MessageCircle, ShoppingCart, Users } from 'lucide-react';
import { Link } from 'react-router';
import { lazy, Suspense } from 'react';
import { GlassCard } from '../components/GlassCard';
import HeroBento from '../components/HeroBento';
import ServicesSection from '../components/ServicesSection';
import StatsSection from '../components/StatsSection';
import ProcessSection from '../components/ProcessSection';
import TestimonialsSection from '../components/TestimonialsSection';
import SectionDivider from '../components/SectionDivider';
import DynamicSEO from '../components/DynamicSEO';
import { useApp } from '../context/AppContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Floating3DElements = lazy(() => import('../components/Floating3DElements'));

export default function HomePage() {
  const { services, portfolioItems, blogPosts, settings, openAssistant } = useApp();

  const features = [
    {
      icon: Sparkles,
      title: 'IA',
      description: 'Automatización y chatbots 24/7',
      image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjU4NjYzNTl8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: TrendingUp,
      title: 'Estrategia',
      description: 'Diseños que convierten',
      image: 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NjU4MTg3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      icon: Zap,
      title: 'Analítica',
      description: 'Decisiones basadas en datos',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2NTg5NTQ4N3ww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const process = [
    { step: '01', title: 'DESCUBRIMIENTO', description: 'Analizamos tu negocio y competencia' },
    { step: '02', title: 'ESTRATEGIA', description: 'Diseñamos el plan de acción ganador' },
    { step: '03', title: 'EJECUCIÓN', description: 'Implementamos con excelencia' },
    { step: '04', title: 'OPTIMIZACIÓN', description: 'Mejoramos continuamente resultados' }
  ];

  const testimonials = [
    {
      name: 'Laura Martínez',
      company: 'La Terraza Gourmet',
      text: 'Triplicamos nuestras reservaciones en 3 meses. El equipo de Inédito entendió perfectamente nuestras necesidades.',
      rating: 5
    },
    {
      name: 'Carlos Ramírez',
      company: 'Despacho Jurídico',
      text: 'Ahora generamos 40+ leads calificados al mes. El chatbot y las campañas de Google Ads funcionan increíble.',
      rating: 5
    },
    {
      name: 'Ana Gutiérrez',
      company: 'Boutique Luna',
      text: 'Vendimos $150k en 3 meses con su estrategia de ecommerce. Superó nuestras expectativas.',
      rating: 5
    }
  ];

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hola, quiero información sobre sus servicios de marketing digital')}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    image: 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp',
    '@id': 'https://www.inedito.digital',
    url: 'https://www.inedito.digital',
    telephone: settings.businessPhone,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.businessAddress,
      addressLocality: settings.businessCity,
      addressRegion: settings.businessState,
      postalCode: settings.businessZip,
      addressCountry: 'MX'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.8853,
      longitude: -102.2916
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    sameAs: [
      'https://www.facebook.com/ineditodigital',
      'https://www.instagram.com/ineditodigital',
      'https://www.linkedin.com/company/ineditodigital'
    ]
  };

  return (
    <>
      <DynamicSEO
        title="Agencia de Marketing Digital en Aguascalientes que impulsa tus ventas con IA"
        description="Agencia de Marketing Digital en Aguascalientes especializada en SEO, Google Ads, Chatbots IA y Desarrollo Web. Aumenta tus ventas con estrategias digitales comprobadas."
        keywords={[
          'agencia de marketing digital en aguascalientes',
          'marketing digital aguascalientes',
          'seo aguascalientes',
          'google ads aguascalientes',
          'chatbots ia',
          'desarrollo web aguascalientes'
        ]}
        schema={schema}
      />

      {/* Hero Section - Bento Grid Style */}
      <HeroBento />

      <SectionDivider variant="gradient" color="purple" />

      {/* Bento Grid - Value Proposition */}
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden bg-white">
        {/* Elementos 3D Flotantes */}
        <Suspense fallback={<div className="w-full h-full bg-gray-100 animate-pulse" />}>
          <Floating3DElements variant="mixed" count={10} />
        </Suspense>
        
        <div className="container mx-auto relative z-10 max-w-7xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              EL PODER DE LA <span className="text-[#7700CE]">TRANSFORMACIÓN DIGITAL</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              Combinamos lo mejor del marketing tradicional con IA y automatización de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((feature, index) => {
              return (
                <div
                  key={feature.title}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <GlassCard hover glow className="h-full overflow-hidden group bg-white/80 backdrop-blur-sm border-gray-200">
                    {/* Imagen de fondo */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Contenido */}
                    <div className="relative z-10">
                      <feature.icon className="text-[#7700CE] mb-3" size={28} />
                      <h3 className="heading text-base md:text-lg mb-2 text-black">{feature.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm">{feature.description}</p>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
            
            {/* Resultados Card */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: `${features.length * 0.1}s` }}
            >
              <GlassCard hover glow className="h-full overflow-hidden group bg-white/80 backdrop-blur-sm border-gray-200">
                {/* Imagen de fondo */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHJlc3VsdHN8ZW58MXx8fHwxNzY1ODk1NDg3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Resultados"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Contenido */}
                <div className="relative z-10">
                  <Target className="text-[#7700CE] mb-3" size={28} />
                  <h3 className="heading text-base md:text-lg mb-2 text-black">Resultados</h3>
                  <p className="text-gray-600 text-xs md:text-sm">ROI comprobado y crecimiento sostenible</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicios" className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Elementos 3D Flotantes */}
        <Suspense fallback={null}>
          <Floating3DElements variant="cubes" count={8} />
        </Suspense>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              NUESTROS <span className="text-[#7700CE]">SERVICIOS</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              Soluciones digitales que generan resultados reales y medibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
            {services.slice(0, 9).map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/servicios/${service.slug}`}>
                  <GlassCard hover className="h-full group bg-white/80 backdrop-blur-sm border-gray-200 hover:border-[#7700CE]/40">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#7700CE]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#7700CE]/20 transition-colors">
                        <Sparkles className="text-[#7700CE]" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="heading text-base md:text-lg mb-1 md:mb-2 text-black group-hover:text-[#7700CE] transition-colors">
                          {service.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                      {service.shortDescription}
                    </p>
                    <div className="flex items-center text-[#7700CE] text-xs md:text-sm group-hover:gap-2 transition-all font-semibold">
                      <span>Ver más</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassCard>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/servicios"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(119,0,206,0.3)]"
            >
              <span className="heading text-sm md:text-base tracking-[0.08em]">VER TODOS LOS SERVICIOS</span>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* AI Services Section */}
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0014] via-[#1a0033] to-black" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7700CE]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#9933FF]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Elementos 3D Flotantes */}
        <Suspense fallback={null}>
          <Floating3DElements variant="mixed" count={12} />
        </Suspense>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7700CE]/20 border border-[#7700CE]/40 backdrop-blur-xl mb-4 md:mb-6"
            >
              <Bot className="text-[#7700CE]" size={20} />
              <span className="text-sm text-white font-semibold tracking-wide">POTENCIA TU NEGOCIO CON IA</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="heading text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6"
            >
              SERVICIOS DE <span className="bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent">INTELIGENCIA ARTIFICIAL</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-sm md:text-base lg:text-lg max-w-3xl mx-auto"
            >
              Automatiza, optimiza y escala tu negocio 24/7 con nuestras soluciones de IA personalizadas
            </motion.p>
          </div>

          {/* Grid de Servicios IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8 md:mb-10">
            {/* IA para WhatsApp */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Link to="/servicios-ia/whatsapp">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono y Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="text-white" size={28} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/40">
                        <span className="text-xs text-green-400 font-bold">BESTSELLER</span>
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      IA PARA WHATSAPP
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      Agente inteligente que atiende, califica y cierra ventas 24/7. Nunca pierdas otro cliente.
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Respuestas instantáneas 24/7</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Calificación automática de leads</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Integración con tu CRM</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>Conocer más</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* IA de Ventas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/servicios-ia/ventas">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Target className="text-white" size={28} />
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      IA DE VENTAS
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      Encuentra clientes perfectos y cierra más ventas con prospección inteligente automatizada.
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Prospección automática LinkedIn</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Emails personalizados con IA</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Seguimiento predictivo</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>Conocer más</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* IA para Marketing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/servicios-ia/marketing">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="text-white" size={28} />
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      IA PARA MARKETING
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      Campañas que se optimizan solas. Contenido generado por IA. Resultados exponenciales.
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Optimización automática de ads</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Contenido generado por IA</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Análisis predictivo de tendencias</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>Conocer más</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* IA para E-commerce */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/servicios-ia/ecommerce">
                <GlassCard 
                  hover 
                  glow 
                  className="h-full group relative overflow-hidden"
                >
                  {/* Gradiente de fondo animado */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    {/* Icono */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ShoppingCart className="text-white" size={28} />
                      </div>
                    </div>

                    <h3 className="heading text-xl md:text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                      IA PARA E-COMMERCE
                    </h3>
                    
                    <p className="text-white/70 text-sm md:text-base mb-4">
                      Convierte más visitas en ventas. Recomendaciones inteligentes y checkout optimizado.
                    </p>

                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Recomendaciones personalizadas</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Recuperación carritos abandonados</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-white/80">
                        <CheckCircle size={16} className="text-[#7700CE] flex-shrink-0" />
                        <span>Optimización de precios dinámica</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm md:text-base font-bold group-hover:gap-2 transition-all">
                      <span>Conocer más</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          </div>

          {/* CTA Final de Servicios IA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Link
              to="/servicios-ia"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 shadow-[0_0_40px_rgba(119,0,206,0.4)] hover:shadow-[0_0_60px_rgba(119,0,206,0.6)] group"
            >
              <Bot className="mr-2" size={20} />
              <span className="heading text-sm md:text-base tracking-[0.08em]">VER TODOS LOS SERVICIOS IA</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* Process */}
      <section className="py-8 md:py-12 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              NUESTRO <span className="text-[#7700CE]">PROCESO</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              Metodología probada que garantiza resultados excepcionales
            </p>
          </div>

          {/* Grid con Imagen y Steps */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-8">
            {/* Imagen destacada */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="aspect-[4/3] relative">
                <img 
                  src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/NUESTRO%20PROCESO.webp" 
                  alt="Nuestro proceso de trabajo en INÉDITO DIGITAL"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/30 to-[#9933FF]/20" />
                
                {/* Badge flotante */}
                <div className="absolute top-4 left-4">
                  <div className="px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-black">En acción</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Steps del proceso */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full bg-white/80 backdrop-blur-sm border-gray-200 hover:border-[#7700CE]/30 transition-colors">
                    <div className="heading text-3xl md:text-4xl text-[#7700CE] mb-3">{item.step}</div>
                    <h3 className="heading text-lg md:text-xl mb-2 text-black">{item.title}</h3>
                    <p className="text-gray-600 text-xs md:text-sm">{item.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-8 md:py-12 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-white">
              CASOS DE <span className="text-[#7700CE]">ÉXITO</span>
            </h2>
            <p className="text-white/60 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              Marcas que confían en INÉDITO DIGITAL
            </p>
          </div>

          {/* Carrusel de logos */}
          <div className="max-w-6xl mx-auto mb-6 md:mb-8 logos-carousel">
            <style>{`
              .logos-carousel .slick-slide {
                display: flex !important;
                justify-content: center;
                align-items: center;
                height: 120px;
              }
              .logos-carousel .slick-track {
                display: flex !important;
                align-items: center;
              }
              .logos-carousel .logo-container {
                width: 180px;
                height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
              }
              .logos-carousel .logo-container img {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                filter: brightness(0) invert(1);
                transition: filter 0.3s ease;
              }
              .logos-carousel .logo-container:hover img {
                filter: none;
              }
            `}</style>
            <Slider
              dots={false}
              infinite={true}
              speed={3000}
              slidesToShow={4}
              slidesToScroll={1}
              autoplay={true}
              autoplaySpeed={0}
              cssEase="linear"
              pauseOnHover={true}
              arrows={false}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 3,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                  }
                }
              ]}
            >
              {portfolioItems.filter(item => item.logo).map((item) => (
                <div key={item.id}>
                  <div className="logo-container opacity-60 hover:opacity-100 transition-all duration-300">
                    <img 
                      src={item.logo} 
                      alt={`${item.client} logo`}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <div className="text-center">
            <Link
              to="/portafolio"
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-all"
            >
              <span className="heading text-sm md:text-base tracking-[0.08em]">VER MÁS CASOS</span>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* Team & Workspace Visual Section */}
      <section className="py-8 md:py-12 px-4 relative overflow-hidden bg-white">
        {/* Elementos 3D flotantes */}
        <Suspense fallback={null}>
          <Floating3DElements variant="spheres" count={6} />
        </Suspense>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="heading text-xl md:text-3xl lg:text-4xl mb-3 md:mb-4 text-black">
              TRABAJAMOS CON <span className="text-[#7700CE]">PASIÓN</span>
            </h2>
            <p className="text-gray-600 text-xs md:text-sm lg:text-base max-w-2xl mx-auto">
              Un equipo dedicado a transformar tu negocio con tecnología de vanguardia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard className="text-center p-4 md:p-5 bg-white/80 backdrop-blur-sm border-gray-200">
                <Sparkles className="text-[#7700CE] mx-auto mb-3" size={32} />
                <h3 className="heading text-lg md:text-xl mb-2 text-black">INNOVACIÓN</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  Utilizamos las últimas tecnologías en IA y automatización
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <GlassCard className="text-center p-4 md:p-5 bg-white/80 backdrop-blur-sm border-gray-200">
                <Target className="text-[#7700CE] mx-auto mb-3" size={32} />
                <h3 className="heading text-lg md:text-xl mb-2 text-black">RESULTADOS</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  Nos enfocamos en métricas que realmente importan
                </p>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard className="text-center p-4 md:p-5 bg-white/80 backdrop-blur-sm border-gray-200">
                <TrendingUp className="text-[#7700CE] mx-auto mb-3" size={32} />
                <h3 className="heading text-lg md:text-xl mb-2 text-black">CRECIMIENTO</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  Tu éxito es nuestra máxima prioridad
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider variant="gradient" color="purple" />

      {/* CTA Final */}
      <section className="py-8 md:py-12 px-4 bg-white/[0.02]">
        <div className="container mx-auto">
          <GlassCard glow className="max-w-4xl mx-auto text-center p-6 md:p-10">
            <h2 className="heading text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6">
              ¿LISTO PARA <span className="text-[#7700CE]">CRECER?</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto">
              Agenda una consulta gratuita y descubre cómo podemos llevar tu negocio al siguiente nivel
            </p>
            <button
              onClick={() => openAssistant(undefined, 'agendar una consulta gratuita')}
              className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(119,0,206,0.5)] group cursor-pointer"
            >
              <span className="heading text-sm md:text-base tracking-[0.08em]">AGENDAR CONSULTA GRATIS</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </GlassCard>
        </div>
      </section>
    </>
  );
}