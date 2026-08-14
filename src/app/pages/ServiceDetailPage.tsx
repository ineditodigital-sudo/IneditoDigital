import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, ExternalLink, Gamepad2, Camera, Grid3x3 } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { services, settings, openAssistant } = useApp();
  
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Servicio no encontrado</p>
    </div>;
  }

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Hola, me interesa el servicio de ${service.title}`)}`;
 
  // Imágenes para las diferentes secciones
  const sectionImages = {
    features: 'https://imagenes.inedito.digital/INEDITO-WEB/20260112_201009_b8eb3ed100b2.webp',
    ideal: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc3RyYXRlZ3l8ZW58MXx8fHwxNzY1OTMwMzkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    process: 'https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjU5Nzc4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    results: 'https://images.unsplash.com/photo-1730382624709-81e52dd294d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMHN1Y2Nlc3N8ZW58MXx8fHwxNzY1ODkwNDMyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };

  return (
    <>
      <DynamicSEO
        title={`${service.title} - INÉDITO DIGITAL`}
        description={service.shortDescription}
        keywords={[service.title.toLowerCase(), 'marketing digital aguascalientes', service.category.toLowerCase()]}
      />

      {/* Hero Banner con Imagen de Fondo */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={service.bannerImage} 
            alt={service.title}
            className="w-full h-full object-cover"
            loading="eager"
            onError={(e) => {
              // Fallback image si la imagen principal no carga
              e.currentTarget.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
            }}
          />
          {/* Overlay oscuro con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
          {/* Overlay morado */}
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
              {service.category}
            </span>
            
            <h1 className="heading mb-3 md:mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
              {service.title}
            </h1>
            
            <p className="text-sm md:text-base text-white/90 max-w-3xl mx-auto mb-6 leading-relaxed">
              {service.shortDescription}
            </p>

            <Link 
              to="/servicios" 
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Volver a servicios</span>
            </Link>
          </motion.div>
        </div>

        {/* Decoración inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* Contenido Principal */}
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
                  QUÉ <span className="text-[#7700CE]">INCLUYE</span>
                </h2>
                <div className="space-y-2.5 md:space-y-3">
                  {service.features.map((feature, i) => (
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
                    alt="Características del servicio"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* DEMOS - Solo para Activaciones para Expo */}
        {slug === 'activaciones-para-expo' && (
          <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-black via-[#0D0010] to-black relative overflow-hidden">
            {/* Orbs de fondo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7700CE]/20 rounded-full blur-[120px]" />
              <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#9933FF]/15 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
              {/* Título */}
              <div className="text-center mb-8 md:mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="heading text-2xl md:text-3xl lg:text-4xl mb-3">
                    PRUEBA NUESTROS <span className="text-[#7700CE]">DEMOS</span>
                  </h2>
                  <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                    Explora en vivo las activaciones interactivas que podemos implementar en tu stand
                  </p>
                </motion.div>
              </div>

              {/* Grid de demos */}
              <div className="grid md:grid-cols-3 gap-5 md:gap-6">
                {/* Demo 1: Ruleta de Premios */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                >
                  <GlassCard className="group h-full hover:border-[#7700CE]/60 transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-5 md:p-6 flex flex-col h-full">
                      {/* Icono */}
                      <div className="mb-4 relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_30px_rgba(119,0,206,0.4)] group-hover:shadow-[0_0_50px_rgba(119,0,206,0.6)] transition-all">
                          <Gamepad2 size={28} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0D0010] animate-pulse" />
                      </div>

                      {/* Título */}
                      <h3 className="heading text-lg md:text-xl mb-2 text-white group-hover:text-[#CC66FF] transition-colors">
                        RULETA DE PREMIOS
                      </h3>

                      {/* Descripción */}
                      <p className="text-white/60 text-sm mb-4 flex-grow">
                        Ruleta interactiva totalmente personalizable. Perfecta para sorteos, rifas y dinámicas de gamificación en tu stand.
                      </p>

                      {/* Badge de estado */}
                      <div className="mb-4">
                        <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-bold">
                          ✓ DISPONIBLE
                        </span>
                      </div>

                      {/* Botón */}
                      <a
                        href="https://ruleta-expo.inedito.digital/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7700CE]/20 border border-[#7700CE]/40 hover:bg-[#7700CE]/30 hover:border-[#7700CE]/60 transition-all text-white text-sm font-bold group/btn"
                      >
                        <span>VER DEMO</span>
                        <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Demo 2: Photo Opportunity */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <GlassCard className="group h-full hover:border-[#7700CE]/60 transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-5 md:p-6 flex flex-col h-full">
                      {/* Icono */}
                      <div className="mb-4 relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_30px_rgba(119,0,206,0.4)] group-hover:shadow-[0_0_50px_rgba(119,0,206,0.6)] transition-all">
                          <Camera size={28} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0D0010] animate-pulse" />
                      </div>

                      {/* Título */}
                      <h3 className="heading text-lg md:text-xl mb-2 text-white group-hover:text-[#CC66FF] transition-colors">
                        PHOTO OPPORTUNITY
                      </h3>

                      {/* Descripción */}
                      <p className="text-white/60 text-sm mb-4 flex-grow">
                        Photobooth con marcos personalizados de tu marca. Captura fotos, compártelas y genera engagement viral en redes sociales.
                      </p>

                      {/* Badge de estado */}
                      <div className="mb-4">
                        <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-bold">
                          ✓ DISPONIBLE
                        </span>
                      </div>

                      {/* Botón */}
                      <a
                        href="https://photo-oportunity.inedito.digital/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7700CE]/20 border border-[#7700CE]/40 hover:bg-[#7700CE]/30 hover:border-[#7700CE]/60 transition-all text-white text-sm font-bold group/btn"
                      >
                        <span>VER DEMO</span>
                        <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>

                {/* Demo 3: Tic Tac Toe (Próximamente) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <GlassCard className="group h-full hover:border-[#7700CE]/60 transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-5 md:p-6 flex flex-col h-full">
                      {/* Icono */}
                      <div className="mb-4 relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_30px_rgba(119,0,206,0.4)] group-hover:shadow-[0_0_50px_rgba(119,0,206,0.6)] transition-all">
                          <Grid3x3 size={28} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0D0010] animate-pulse" />
                      </div>

                      {/* Título */}
                      <h3 className="heading text-lg md:text-xl mb-2 text-white group-hover:text-[#CC66FF] transition-colors">
                        TIC TAC TOE
                      </h3>

                      {/* Descripción */}
                      <p className="text-white/60 text-sm mb-4 flex-grow">
                        Gato interactivo con premios. Juega contra la IA y gana. Diversión garantizada para atraer visitantes a tu stand.
                      </p>

                      {/* Badge de estado */}
                      <div className="mb-4">
                        <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-bold">
                          ✓ DISPONIBLE
                        </span>
                      </div>

                      {/* Botón */}
                      <a
                        href="https://tic-tac-toe.inedito.digital/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7700CE]/20 border border-[#7700CE]/40 hover:bg-[#7700CE]/30 hover:border-[#7700CE]/60 transition-all text-white text-sm font-bold group/btn"
                      >
                        <span>VER DEMO</span>
                        <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* CTA adicional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center mt-8 md:mt-10"
              >
                <p className="text-white/60 text-sm md:text-base mb-4">
                  ¿Necesitas una activación personalizada para tu evento?
                </p>
                <button
                  onClick={() => openAssistant('Activaciones para Expo', 'cotizar activación personalizada')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] text-white hover:shadow-[0_0_30px_rgba(119,0,206,0.5)] transition-all hover:scale-105"
                >
                  <span className="heading text-sm tracking-[0.08em]">COTIZAR ACTIVACIÓN PERSONALIZADA</span>
                </button>
              </motion.div>
            </div>
          </section>
        )}

        {/* IDEAL PARA - Layout: Imagen izquierda, Contenido derecha */}
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
                    src="https://imagenes.inedito.digital/INEDITO-WEB/20260112_201215_98546a2d1026.webp"
                    alt="Ideal para tu negocio"
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
                  IDEAL <span className="text-[#7700CE]">PARA</span>
                </h2>
                <div className="space-y-2.5 md:space-y-3">
                  {service.ideal.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2.5 p-3 md:p-3.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#7700CE]/40 transition-colors backdrop-blur-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#7700CE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#7700CE] text-xs font-bold">✓</span>
                      </div>
                      <span className="text-white/80 text-sm md:text-base">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* NUESTRO PROCESO - Layout: Contenido + Grid con imagen de fondo */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-black">
                NUESTRO <span className="text-[#7700CE]">PROCESO</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                Metodología probada que garantiza resultados excepcionales
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
                    src="https://imagenes.inedito.digital/INEDITO-WEB/20260112_204956_2712116f44fd.webp"
                    alt="Nuestro proceso de trabajo"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge flotante */}
                  <div className="absolute top-3 right-3">
                    <div className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg">
                      <span className="text-xs font-bold text-[#7700CE]">Proceso comprobado</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Steps del proceso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {service.process.map((step, i) => (
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

        {/* FAQ - Layout centrado */}
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2">
                PREGUNTAS <span className="text-[#7700CE]">FRECUENTES</span>
              </h2>
            </div>
            
            <div className="space-y-3">
              {service.faq.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="p-4 md:p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#7700CE]/40 transition-colors">
                    <h3 className="heading text-base md:text-lg mb-2 text-white">{item.question}</h3>
                    <p className="text-white/70 text-sm md:text-base leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              ))}\n            </div>
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
              {/* Imagen de fondo */}
              <div className="absolute inset-0">
                <img 
                  src={sectionImages.results}
                  alt="Comienza ahora"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE]/90 to-[#9933FF]/80" />
              </div>

              {/* Contenido */}
              <div className="relative z-10 text-center p-6 md:p-10">
                <h2 className="heading text-2xl md:text-3xl lg:text-4xl mb-3 text-white">
                  ¿LISTO PARA <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">COMENZAR?</span>
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
                  Cotiza este servicio gratis y descubre cómo podemos ayudarte a alcanzar tus objetivos
                </p>
                <button
                  onClick={() => openAssistant(service.title, `cotizar ${service.title}`)}
                  className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white text-[#7700CE] hover:bg-white/90 transition-all hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.3)] cursor-pointer"
                >
                  <span className="heading text-sm md:text-base tracking-[0.08em]">COTIZAR AHORA</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}