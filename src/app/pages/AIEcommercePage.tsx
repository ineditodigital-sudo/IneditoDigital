import { motion } from 'motion/react';
import { ShoppingCart, TrendingUp, MessageCircle, Package, Zap, ArrowRight, Sparkles, CheckCircle2, ArrowLeft, Heart, DollarSign, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import Floating3DElements from '../components/Floating3DElements';
import SectionDivider from '../components/SectionDivider';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

export default function AIEcommercePage() {
  const { openAssistant } = useApp();
  const t = contenido('servicios-ia-ecommerce', 'portada');
  const tC = contenido('servicios-ia-ecommerce', 'cierre');

  // Imágenes para las diferentes secciones
  const sectionImages = {
    hero: 'https://images.unsplash.com/photo-1658297063569-162817482fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBvbmxpbmUlMjBzaG9wcGluZ3xlbnwxfHx8fDE3Njc3MjEzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: 'https://images.unsplash.com/photo-1648544365218-188e3d07dcac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGJhZ3MlMjByZXRhaWx8ZW58MXx8fHwxNzY3Njc2NDc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    support: 'https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc2NzYxNjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    growth: 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cta: 'https://images.unsplash.com/photo-1603219950587-b4f3f7ee87e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NzcwOTAzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };

  const benefits = [
    {
      icon: ShoppingCart,
      title: 'Recuperación de Carrito',
      description: 'Identifica compradores que abandonaron y los contacta automáticamente con ofertas personalizadas.',
    },
    {
      icon: Heart,
      title: 'Recomendaciones Inteligentes',
      description: 'Sugiere productos complementarios en el momento exacto para aumentar el ticket promedio.',
    },
    {
      icon: MessageCircle,
      title: 'Soporte Automático 24/7',
      description: 'Resuelve dudas de producto, inventario, envíos y devoluciones sin intervención humana.',
    },
    {
      icon: DollarSign,
      title: 'Más Ventas, Menos Fricción',
      description: 'Reduce abandono de compra con asistencia en tiempo real durante todo el proceso.',
    }
  ];

  const idealFor = [
    'Tiendas online con más de 100 visitas diarias que necesitan vender más',
    'Marcas propias (DTC) enfocadas en reducir costo de adquisición',
    'Shopify Stores con instalación en minutos sin código',
    'WooCommerce optimizado para WordPress con plugin nativo',
    'Vendedores en marketplaces que quieren su propia tienda',
    'Negocios de dropshipping que buscan automatizar atención'
  ];

  const features = [
    'Chat inteligente que guía desde duda hasta compra',
    'Upsell y cross-sell automático en momento ideal',
    'Personalización 1:1 basada en comportamiento',
    'Automatización de emails activados por acciones',
    'Análisis predictivo de inventario y tendencias',
    'Integración con Shopify, WooCommerce, Magento y más'
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Instalación',
      description: 'Conectamos la IA a tu tienda en minutos, sin código.'
    },
    {
      step: 2,
      title: 'Entrenamiento',
      description: 'La IA aprende tu catálogo, políticas y tono de voz.'
    },
    {
      step: 3,
      title: 'Automatización',
      description: 'Empieza a asistir, recomendar y recuperar carritos.'
    },
    {
      step: 4,
      title: 'Optimización',
      description: 'Mejora continua basada en conversiones reales.'
    }
  ];

  return (
    <>
      <DynamicSEO
        title="IA para E-commerce y Retail - INÉDITO DIGITAL"
        description="Convierte más visitas en ventas. Asistente inteligente de IA dentro de tu tienda online que recupera carritos, recomienda productos y automatiza soporte 24/7."
        keywords={['ia ecommerce', 'chatbot tienda online', 'recuperación carrito', 'shopify ia', 'woocommerce ia', 'automatización ecommerce', 'ventas online ia']}
      />

      {/* Hero Banner con Imagen de Fondo */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={sectionImages.hero} 
            alt="IA para E-commerce"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/40 to-[#9933FF]/20 mix-blend-overlay" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-20 px-4 text-center py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#7700CE]/30 border border-[#7700CE]/50 backdrop-blur-xl text-[#CC66FF] font-bold mb-4">
              {t('etiqueta', 'IA PARA E-COMMERCE')}
            </span>
            
            <h1 className="heading mb-3 md:mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
              {t('titulo', 'CONVIERTE MÁS VISITAS EN VENTAS')}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('bajada', 'Asistente inteligente dentro de tu tienda que recupera carritos, recomienda productos y atiende 24/7.')}
            </p>

            <Link 
              to="/servicios-ia" 
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Volver a Servicios IA</span>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      <div className="bg-black">
        {/* QUÉ INCLUYE */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5 text-black">
                  QUÉ <span className="text-[#7700CE]">INCLUYE</span>
                </h2>
                <div className="space-y-2.5 md:space-y-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2.5 p-3 md:p-3.5 rounded-lg bg-white/80 border border-gray-200 hover:border-[#7700CE]/30 transition-colors"
                    >
                      <CheckCircle2 className="text-[#7700CE] flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden order-first lg:order-last"
              >
                <div className="aspect-[5/3] relative">
                  <img 
                    src={sectionImages.features}
                    alt="E-commerce inteligente"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <div className="aspect-[5/3] relative">
                  <img 
                    src={sectionImages.support}
                    alt="Soporte automático"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5">
                  BENEFICIOS <span className="text-[#7700CE]">PRINCIPALES</span>
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#7700CE]/40 transition-colors backdrop-blur-sm"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#7700CE]/20 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="text-[#7700CE]" size={20} />
                      </div>
                      <div>
                        <h3 className="heading text-base md:text-lg text-white mb-1">{benefit.title}</h3>
                        <p className="text-white/70 text-sm">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-black">
                CÓMO <span className="text-[#7700CE]">FUNCIONA</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Instalación simple en tu tienda online
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <div className="aspect-[5/3] relative">
                  <img 
                    src={sectionImages.growth}
                    alt="Proceso de implementación"
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                      <span className="text-xs font-bold text-[#7700CE]">Instalación rápida</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {howItWorks.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-full p-4 rounded-xl bg-white/80 border border-gray-200 hover:border-[#7700CE]/40 transition-colors backdrop-blur-sm">
                      <div className="heading text-3xl md:text-4xl text-[#7700CE] mb-2">{step.step.toString().padStart(2, '0')}</div>
                      <h3 className="heading text-base md:text-lg mb-1.5 text-black">{step.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* IDEAL PARA */}
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2">
                IDEAL <span className="text-[#7700CE]">PARA</span>
              </h2>
            </div>
            
            <div className="space-y-3">
              {idealFor.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-4 md:p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#7700CE]/40 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#7700CE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#7700CE] text-xs font-bold">✓</span>
                      </div>
                      <span className="text-white/80 text-sm md:text-base">{item}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0">
                <img 
                  src={sectionImages.cta}
                  alt="Comienza ahora"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/90 to-[#9933FF]/80" />
              </div>

              <div className="relative z-10 text-center p-6 md:p-10">
                <h2 className="heading text-2xl md:text-3xl lg:text-4xl mb-3 text-white">
                  {tC('titulo', '¿LISTO PARA AUTOMATIZAR?')}
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
                  Cotiza este servicio y descubre cómo transformar tu tienda online
                </p>
                <button
                  onClick={() => openAssistant('IA para E-commerce')}
                  className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white text-[#7700CE] hover:bg-white/90 transition-all hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.3)] cursor-pointer"
                >
                  <span className="heading text-sm md:text-base tracking-[0.08em]">{tC('boton', 'COTIZAR AHORA')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}