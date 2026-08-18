import { motion } from 'motion/react';
import { MessageCircle, Clock, Target, Calendar, CheckCircle2, Zap, Users, BarChart3, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import Floating3DElements from '../components/Floating3DElements';
import SectionDivider from '../components/SectionDivider';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

export default function AIWhatsAppPage() {
  const { openAssistant } = useApp();
  const t = contenido('servicios-ia-whatsapp', 'portada');
  const tC = contenido('servicios-ia-whatsapp', 'cierre');
  const tInc = contenido('servicios-ia-whatsapp', 'incluye');
  const tBen = contenido('servicios-ia-whatsapp', 'beneficios');
  const tHow = contenido('servicios-ia-whatsapp', 'como_funciona');
  const tIde = contenido('servicios-ia-whatsapp', 'ideal_para');
  const tImg = contenido('servicios-ia-whatsapp', 'imagenes');
  const tNav = contenido('servicios-ia-whatsapp', 'navegacion');

  // Imágenes para las diferentes secciones
  const sectionImages = {
    hero: tImg('hero', 'https://images.unsplash.com/photo-1659355893994-bddb1ba8e3a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlcyUyMHRlYW0lMjBzbWFydHBob25lJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY3NzMxMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    features: tImg('features', 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBkaXNjdXNzaW9ufGVufDF8fHx8MTc2NzYxNjIzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    support: tImg('support', 'https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc2NzYxNjI2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    business: tImg('business', 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3klMjBkYXRhfGVufDF8fHx8MTc2NzcyODg1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'),
    cta: tImg('cta', 'https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY3NjU2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')
  };

  const benefits = [
    { icon: Clock, title: tBen('b1_titulo', 'Respuestas Inmediatas'), description: tBen('b1_texto', 'Atiende a tus clientes las 24 horas, los 7 días de la semana, sin perder ninguna oportunidad.') },
    { icon: Target, title: tBen('b2_titulo', 'Calificación de Prospectos'), description: tBen('b2_texto', 'Identifica automáticamente leads de alta calidad y prioriza tu tiempo en lo que realmente importa.') },
    { icon: Zap, title: tBen('b3_titulo', 'Seguimiento Automático'), description: tBen('b3_texto', 'Nunca pierdas un prospecto. El agente hace seguimiento inteligente hasta concretar la venta.') },
    { icon: Calendar, title: tBen('b4_titulo', 'Agenda de Citas'), description: tBen('b4_texto', 'Coordina y agenda reuniones automáticamente, sincronizado con tu calendario.') },
  ];


  const idealFor = [
    tIde('i1', 'Clínicas y consultorios médicos que necesitan agendar citas 24/7'),
    tIde('i2', 'Inmobiliarias que califican prospectos y coordinan visitas'),
    tIde('i3', 'E-commerce que procesa pedidos y resuelve dudas de productos'),
    tIde('i4', 'Servicios profesionales que cotizan y agenden reuniones'),
    tIde('i5', 'Empresas B2B que califican oportunidades comerciales'),
    tIde('i6', 'Instituciones educativas que gestionan inscripciones'),
  ];


  const features = [
    tInc('f1', 'Conversaciones naturales con IA entrenada en tu negocio'),
    tInc('f2', 'Integración con CRM, calendarios y sistemas de pago'),
    tInc('f3', 'Calificación automática de leads con scoring inteligente'),
    tInc('f4', 'Análisis de sentimiento y priorización de urgencias'),
    tInc('f5', 'Dashboard con métricas en tiempo real'),
    tInc('f6', 'Notificaciones instantáneas de leads calificados'),
  ];


  const howItWorks = [
    { step: 1, title: tHow('p1_titulo', 'Configuración'), description: tHow('p1_texto', 'Entrenamos la IA con información de tu negocio y flujos de conversación.') },
    { step: 2, title: tHow('p2_titulo', 'Integración'), description: tHow('p2_texto', 'Conectamos el agente a tu WhatsApp Business en minutos.') },
    { step: 3, title: tHow('p3_titulo', 'Automatización'), description: tHow('p3_texto', 'El agente empieza a atender, calificar y dar seguimiento automáticamente.') },
    { step: 4, title: tHow('p4_titulo', 'Optimización'), description: tHow('p4_texto', 'Mejora continua basada en datos reales y comportamiento de usuarios.') },
  ];


  return (
    <>
      <DynamicSEO
        title="IA para WhatsApp - Agente Inteligente 24/7 - INÉDITO DIGITAL"
        description="Agente inteligente de IA para WhatsApp que atiende, califica y da seguimiento a tus clientes automáticamente. Aumenta ventas y reduce costos operativos."
        keywords={['ia whatsapp', 'chatbot whatsapp', 'agente virtual whatsapp', 'automatización whatsapp', 'whatsapp business ia', 'bot ventas whatsapp']}
      />

      {/* Hero Banner con Imagen de Fondo */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={sectionImages.hero} 
            alt="IA para WhatsApp"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/40 to-[#9933FF]/20 mix-blend-overlay" />
        </div>

        {/* Contenido del Hero */}
        <div className="container mx-auto max-w-5xl relative z-20 px-4 text-center py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#7700CE]/30 border border-[#7700CE]/50 backdrop-blur-xl text-[#CC66FF] font-bold mb-4">
              {t('etiqueta', 'IA PARA WHATSAPP')}
            </span>
            
            <h1 className="heading mb-3 md:mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
              {t('titulo', 'AGENTE INTELIGENTE QUE VENDE 24/7')}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed">
              {t('bajada', 'Tu mejor vendedor, siempre disponible. Atiende, califica y da seguimiento automático por WhatsApp.')}
            </p>

            <Link 
              to="/servicios-ia" 
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>{tNav('volver', 'Volver a Servicios IA')}</span>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      <div className="bg-black">
        {/* QUÉ INCLUYE - Layout: Contenido izquierda, Imagen derecha */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Contenido */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5 text-black">
                  {tInc('titulo_1', 'QUÉ')} <span className="text-[#7700CE]">{tInc('titulo_2', 'INCLUYE')}</span>
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

              {/* Imagen */}
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
                    alt="Características del agente de WhatsApp"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS - Layout: Imagen izquierda, Contenido derecha */}
        {tBen.visible() && (
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Imagen */}
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
                    alt="Soporte automático 24/7"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Contenido */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-4 md:mb-5">
                  {tBen('titulo_1', 'BENEFICIOS')} <span className="text-[#7700CE]">{tBen('titulo_2', 'PRINCIPALES')}</span>
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
        )}

        {/* CÓMO FUNCIONA - Layout: Contenido + Grid con imagen de fondo */}
        {tHow.visible() && (
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-black">
                {tHow('titulo_1', 'CÓMO')} <span className="text-[#7700CE]">{tHow('titulo_2', 'FUNCIONA')}</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                {tHow('bajada', 'Implementación simple en 4 pasos')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Imagen destacada */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <div className="aspect-[5/3] relative">
                  <img 
                    src={sectionImages.business}
                    alt="Proceso de implementación"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge flotante */}
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                      <span className="text-xs font-bold text-[#7700CE]">{tNav('sello', 'Implementación rápida')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Steps del proceso */}
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
        )}

        {/* IDEAL PARA - Layout centrado */}
        {tIde.visible() && (
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2">
                {tIde('titulo_1', 'IDEAL')} <span className="text-[#7700CE]">{tIde('titulo_2', 'PARA')}</span>
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
        )}

        {/* CTA Final */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden"
            >
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                <img 
                  src={sectionImages.cta}
                  alt="Comienza ahora"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/90 to-[#9933FF]/80" />
              </div>

              {/* Contenido */}
              <div className="relative z-10 text-center p-6 md:p-10">
                <h2 className="heading text-2xl md:text-3xl lg:text-4xl mb-3 text-white">
                  {tC('titulo', '¿LISTO PARA AUTOMATIZAR?')}
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
                  {tC('bajada', 'Cotiza este servicio y descubre cómo puede transformar tu negocio')}
                </p>
                <button
                  onClick={() => openAssistant('IA para WhatsApp')}
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