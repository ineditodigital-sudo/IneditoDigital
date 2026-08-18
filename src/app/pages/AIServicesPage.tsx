import { motion } from 'motion/react';
import { Sparkles, Bot, TrendingUp, ArrowRight, Zap, MessageCircle, ShoppingCart, Target } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import Floating3DElements from '../components/Floating3DElements';
import SectionDivider from '../components/SectionDivider';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

const soluciones = (t: (k: string, r: string) => string) => [
  {
    icon: MessageCircle,
    title: t('w_titulo', 'IA para WhatsApp'),
    subtitle: t('w_sub', 'Ventas y Soporte 24/7'),
    description: t('w_texto', 'Tu mejor vendedor, disponible siempre. Agente inteligente que atiende, califica y da seguimiento automático.'),
    href: t('w_url', '/servicios-ia/whatsapp'),
    color: '#7700CE',
    benefits: [t('w_e1', 'Atiende 24/7'), t('w_e2', 'Califica leads'), t('w_e3', 'Seguimiento auto')]
  },
  {
    icon: Target,
    title: t('v_titulo', 'IA de Ventas'),
    subtitle: t('v_sub', 'Prospección Inteligente'),
    description: t('v_texto', 'Automatiza prospección, califica leads y optimiza tu proceso comercial con inteligencia artificial.'),
    href: t('v_url', '/servicios-ia/ventas'),
    color: '#9933FF',
    benefits: [t('v_e1', 'Prospección auto'), t('v_e2', 'Lead scoring'), t('v_e3', 'Optimización')]
  },
  {
    icon: TrendingUp,
    title: t('m_titulo', 'IA para Marketing'),
    subtitle: t('m_sub', 'Optimización Automática'),
    description: t('m_texto', 'Marketing que piensa por ti. Analiza campañas, genera contenido y optimiza resultados automáticamente.'),
    href: t('m_url', '/servicios-ia/marketing'),
    color: '#CC66FF',
    benefits: [t('m_e1', 'Análisis auto'), t('m_e2', 'Contenido IA'), t('m_e3', 'ROI optimizado')]
  },
  {
    icon: ShoppingCart,
    title: t('e_titulo', 'IA para E-commerce'),
    subtitle: t('e_sub', 'Convierte Más Visitas'),
    description: t('e_texto', 'Asistente inteligente en tu tienda online que recupera carritos, recomienda productos y atiende 24/7.'),
    href: t('e_url', '/servicios-ia/ecommerce'),
    color: '#7700CE',
    benefits: [t('e_e1', 'Recupera carritos'), t('e_e2', 'Recomendaciones'), t('e_e3', 'Soporte 24/7')]
  },
];

export default function AIServicesPage() {
  const t = contenido('servicios-ia', 'portada');
  const tSol = contenido('servicios-ia', 'soluciones');
  const tCif = contenido('servicios-ia', 'cifras');
  const tTar = contenido('servicios-ia', 'tarjetas');
  const tPor = contenido('servicios-ia', 'por_que');
  const tCie = contenido('servicios-ia', 'cierre');
  const { openAssistant } = useApp();

  return (
    <>
      <DynamicSEO
        title="Servicios de Inteligencia Artificial - INÉDITO DIGITAL"
        description="Transforma tu negocio con IA. Automatiza ventas, marketing y atención al cliente con agentes inteligentes que trabajan 24/7. Consultoría especializada en Aguascalientes."
        keywords={['servicios ia', 'inteligencia artificial aguascalientes', 'automatización ia', 'chatbot ia', 'marketing ia', 'ventas ia', 'agente inteligente']}
      />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
        <TopographyCanvas />
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Floating3DElements variant="mixed" count={8} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7700CE]/20 border border-[#7700CE]/40 backdrop-blur-xl mb-6 shadow-[0_0_30px_rgba(119,0,206,0.3)]"
          >
            <Bot className="text-[#7700CE]" size={16} />
            <span className="text-xs text-white font-semibold tracking-wide">{t('etiqueta', 'SERVICIOS DE INTELIGENCIA ARTIFICIAL')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            <span className="block text-white mb-2">{t('titulo_1', 'INTELIGENCIA ARTIFICIAL')}</span>
            <span className="block bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent">
              {t('titulo_2', 'QUE HACE CRECER TU NEGOCIO')}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Automatiza ventas, marketing y atención al cliente con agentes inteligentes que trabajan 24/7. 
            Sin contratar personal, sin aumentar costos. Solo resultados medibles.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          >
            {[
              { value: tCif('c1_valor', '24/7'), label: tCif('c1_texto', 'Disponibilidad') },
              { value: tCif('c2_valor', '10x'), label: tCif('c2_texto', 'Más Eficiencia') },
              { value: tCif('c3_valor', '80%'), label: tCif('c3_texto', 'Ahorro en Costos') },
              { value: tCif('c4_valor', '100%'), label: tCif('c4_texto', 'Automatizado') }
            ].map((stat, index) => (
              <GlassCard key={index} className="p-4 text-center">
                <div className="heading text-3xl md:text-4xl text-[#7700CE] mb-1">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </GlassCard>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => openAssistant(undefined, 'solicitar una consultoría gratuita de IA')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 shadow-[0_0_30px_rgba(119,0,206,0.5)] hover:shadow-[0_0_50px_rgba(119,0,206,0.8)] hover:scale-105 group cursor-pointer"
            >
              <Sparkles className="mr-2" size={20} />
              <span className="font-bold tracking-wider">CONSULTORÍA GRATUITA</span>
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* Services Grid */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <TopographyCanvas />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-white">{tSol('titulo_1', 'SOLUCIONES IA')}</span>
              <br />
              <span className="bg-gradient-to-r from-[#7700CE] to-[#9933FF] bg-clip-text text-transparent">
                {tSol('titulo_2', 'PARA CADA ÁREA')}
              </span>
            </h2>
            <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mt-4">
              {tSol('bajada', 'Selecciona el servicio ideal para tu negocio y empieza a automatizar hoy mismo')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {soluciones(tTar).map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={service.href}>
                  <GlassCard className="p-8 h-full hover:bg-white/5 transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-[#7700CE]/30">
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <service.icon style={{ color: service.color }} size={32} />
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="heading text-2xl text-white mb-2 group-hover:text-[#7700CE] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#7700CE] text-sm font-semibold mb-4">
                      {service.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/70 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-[#7700CE] text-sm font-bold group-hover:gap-2 transition-all">
                      <span>{tTar('ver_mas', 'Ver más detalles')}</span>
                      <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Why AI Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-white">{tPor('titulo_1', '¿POR QUÉ')}</span>
              <br />
              <span className="bg-gradient-to-r from-[#9933FF] to-[#CC66FF] bg-clip-text text-transparent">
                {tPor('titulo_2', 'INTELIGENCIA ARTIFICIAL?')}
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: tPor('r1_titulo', 'Velocidad'),
                description: tPor('r1_texto', 'Respuestas instantáneas, 24/7. Sin esperas, sin horarios, sin días festivos.')
              },
              {
                icon: TrendingUp,
                title: tPor('r2_titulo', 'Escalabilidad'),
                description: tPor('r2_texto', 'Atiende a 1 o 10,000 clientes simultáneamente sin aumentar tu equipo.')
              },
              {
                icon: Target,
                title: tPor('r3_titulo', 'Precisión'),
                description: tPor('r3_texto', 'Análisis de datos en tiempo real y toma de decisiones basadas en métricas.')
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center h-full hover:bg-white/5 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-[#7700CE]/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="text-[#7700CE]" size={28} />
                  </div>
                  <h3 className="heading text-xl text-white mb-3">{item.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Final CTA */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Floating3DElements variant="orbs" count={4} />
        </div>

        <div className="container mx-auto px-4 max-w-4xl relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="text-[#7700CE] mx-auto mb-6" size={48} />
            
            <h2 className="heading text-3xl md:text-4xl lg:text-5xl mb-6">
              <span className="text-white">{tCie('titulo_1', 'EMPIEZA A AUTOMATIZAR')}</span>
              <br />
              <span className="bg-gradient-to-r from-[#7700CE] to-[#9933FF] bg-clip-text text-transparent">
                {tCie('titulo_2', 'TU NEGOCIO HOY')}
              </span>
            </h2>

            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
              {tCie('texto', 'Agenda una consultoría gratuita y descubre cómo la IA puede transformar tu forma de vender, hacer marketing y atender clientes.')}
            </p>

            <button
              onClick={() => openAssistant('Inteligencia Artificial', 'agendar una consultoría de IA')}
              className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all duration-300 shadow-[0_0_40px_rgba(119,0,206,0.6)] hover:shadow-[0_0_60px_rgba(119,0,206,0.9)] hover:scale-105 group cursor-pointer"
            >
              <Bot className="mr-3" size={24} />
              <span className="font-bold tracking-wider text-lg">AGENDAR CONSULTORÍA</span>
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}