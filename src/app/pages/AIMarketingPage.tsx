import { motion } from 'motion/react';
import { TrendingUp, BarChart3, Brain, Zap, Target, CheckCircle2, ArrowRight, Sparkles, ArrowLeft, Megaphone, LineChart } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import Floating3DElements from '../components/Floating3DElements';
import SectionDivider from '../components/SectionDivider';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

export default function AIMarketingPage() {
  const { openAssistant } = useApp();
  const t = contenido('servicios-ia-marketing', 'portada');
  const tC = contenido('servicios-ia-marketing', 'cierre');

  // Imágenes para las diferentes secciones
  const sectionImages = {
    hero: 'https://images.unsplash.com/photo-1495055154266-57bbdeada43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwYXV0b21hdGlvbnxlbnwxfHx8fDE3Njc2NTEwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    features: 'https://images.unsplash.com/photo-1767355272538-e7177d16f979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2NyZWVuJTIwYXV0b21hdGlvbnxlbnwxfHx8fDE3Njc3Mjk0MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    analytics: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3klMjBkYXRhfGVufDF8fHx8MTc2NzcyODg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    team: 'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3Njc2Nzg4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    cta: 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };

  const benefits = [
    {
      icon: Brain,
      title: 'Análisis Predictivo',
      description: 'Identifica qué campañas funcionarán antes de gastar presupuesto. Decisiones basadas en datos.',
    },
    {
      icon: Zap,
      title: 'Automatización Total',
      description: 'Genera contenido, programa publicaciones y optimiza anuncios sin intervención manual.',
    },
    {
      icon: Target,
      title: 'Segmentación Inteligente',
      description: 'Crea audiencias hipersegmentadas que realmente convierten basadas en comportamiento real.',
    },
    {
      icon: LineChart,
      title: 'ROI Optimizado',
      description: 'Ajusta presupuestos y pujas en tiempo real para maximizar retorno de inversión.',
    }
  ];

  const idealFor = [
    'Agencias de marketing que manejan múltiples clientes simultáneamente',
    'E-commerce con presupuesto publicitario mensual mayor a $20,000 MXN',
    'Empresas SaaS que necesitan generación constante de leads',
    'Consultores independientes que buscan escalar su negocio',
    'Marcas DTC (Direct to Consumer) enfocadas en crecimiento',
    'Startups en fase de validación de product-market fit'
  ];

  const features = [
    'Generación de contenido para redes sociales con IA',
    'Optimización automática de campañas de Google y Meta Ads',
    'A/B testing inteligente de creatividades y copy',
    'Análisis de sentimiento y monitoreo de marca',
    'Predicción de tendencias y oportunidades de mercado',
    'Dashboard unificado con métricas de todas las plataformas'
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Conexión',
      description: 'Integramos tus cuentas de ads, redes sociales y analytics.'
    },
    {
      step: 2,
      title: 'Análisis',
      description: 'La IA estudia tu histórico y performance actual.'
    },
    {
      step: 3,
      title: 'Automatización',
      description: 'Genera contenido, optimiza campañas y segmenta audiencias.'
    },
    {
      step: 4,
      title: 'Mejora Continua',
      description: 'Aprende de resultados y ajusta estrategia automáticamente.'
    }
  ];

  return (
    <>
      <DynamicSEO
        title="IA para Marketing Digital - Automatización y Optimización - INÉDITO DIGITAL"
        description="Sistema de IA que automatiza tu marketing: genera contenido, optimiza campañas y maximiza ROI. Marketing que piensa por ti."
        keywords={['ia marketing', 'automatización marketing', 'marketing automation', 'ia contenido', 'optimización campañas', 'roi marketing']}
      />

      {/* Hero Banner con Imagen de Fondo */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={sectionImages.hero} 
            alt="IA para Marketing"
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
              {t('etiqueta', 'IA PARA MARKETING DIGITAL')}
            </span>
            
            <h1 className="heading mb-3 md:mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
              {t('titulo', 'MARKETING QUE PIENSA POR TI')}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('bajada', 'Automatiza contenido, optimiza campañas y multiplica resultados con inteligencia artificial.')}
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
                    alt="Automatización de marketing digital"
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
                    src={sectionImages.analytics}
                    alt="Análisis de datos de marketing"
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
                Implementación e integración completa
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
                    src={sectionImages.team}
                    alt="Proceso de automatización"
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                      <span className="text-xs font-bold text-[#7700CE]">Integración completa</span>
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
                  Cotiza este servicio y descubre cómo puede multiplicar tus resultados
                </p>
                <button
                  onClick={() => openAssistant('IA para Marketing Digital')}
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