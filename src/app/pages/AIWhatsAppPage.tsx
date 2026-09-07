import { motion } from 'motion/react';
import { MessageCircle, Clock, Target, Calendar, CheckCircle2, Zap, Users, BarChart3, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import TopographyCanvas from '../components/TopographyCanvas';
import { TopoLineas } from '../components/TopoLineas';
import { RecorridoProceso } from '../components/RecorridoProceso';
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
  const tCtx = contenido('servicios-ia-whatsapp', 'contexto');
  const tFaq = contenido('servicios-ia-whatsapp', 'faq');

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
        {/* El fondo de la casa, no una foto de archivo. Las paginas de
            servicio ya usan estas lineas; la foto del señor en traje era
            lo unico que delataba que estas cuatro venian de otra
            plantilla. */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <TopoLineas className="h-full w-full" />
          {/* La misma atmósfera de las páginas de servicio: rejilla de puntos
              enmascarada y dos manchas que derivan. Es lo que le daba
              profundidad al encabezado y aquí no estaba. */}
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.5) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(ellipse 75% 45% at 50% 20%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 45% at 50% 20%, black, transparent)',
            }}
          />
          <motion.div
            className="absolute -top-1/4 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[#7700CE]/20 blur-[130px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-1/4 right-0 h-[24rem] w-[24rem] rounded-full bg-[#9933FF]/14 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
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
        {/* DE QUE SE TRATA — la definicion primero, que es lo que cita un
            asistente, y despues el texto largo. Antes esta pagina servia
            poco mas de doscientas palabras y Google no la habia visitado
            nunca. */}
        <section className="px-4 pt-10 pb-6 md:pt-14 md:pb-10">
          <div className="container mx-auto max-w-5xl">
            {/* Dos columnas y no una: la definición sostiene la izquierda
                —se queda fija mientras se lee el resto— y el desarrollo corre
                por la derecha. En una sola columna esto eran trescientas
                palabras seguidas, que es un muro y no una página. */}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <div className="lg:sticky lg:top-28">
                  <span className="mb-5 block h-[3px] w-14 bg-[#9933FF]" />
                  <p className="text-[18px] md:text-[21px] leading-[1.6] text-white/90">
                    {tCtx('definicion', '')}
                  </p>
                </div>
              </motion.div>

              <div className="space-y-5 lg:col-span-7">
                {tCtx('texto_largo', '')
                  .split(/\n\s*\n/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((parrafo, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6, delay: Math.min(i, 3) * 0.06 }}
                      className="text-[15.5px] leading-[1.8] text-white/60 md:text-[16.5px]"
                    >
                      {parrafo}
                    </motion.p>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* QUÉ INCLUYE - Layout: Contenido izquierda, Imagen derecha */}
        <section className="px-4 py-12 md:py-20">
          <div className="container mx-auto max-w-6xl">
            <div>
              {/* Contenido */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading mb-8 text-2xl md:text-4xl">
                  {tInc('titulo_1', 'QUÉ')} <span className="text-[#CC66FF]">{tInc('titulo_2', 'INCLUYE')}</span>
                </h2>
                {/* A dos columnas: seis renglones seguidos a todo el ancho
                    dejaban una linea de texto de treinta centimetros. */}
                {/* La rejilla asimétrica de las páginas de servicio: la
                    primera ocupa el doble y rompe que las seis pesen igual. */}
                <div className="grid gap-4 md:grid-cols-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 5) * 0.06 }}
                      className={i === 0 ? 'md:col-span-2' : ''}
                    >
                      <div
                        className="group h-full rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#CC66FF]/40"
                        style={{
                          background:
                            i === 0
                              ? 'linear-gradient(150deg, rgba(119,0,206,.22), rgba(255,255,255,.02) 60%)'
                              : 'rgba(255,255,255,.035)',
                        }}
                      >
                        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                          <CheckCircle2 size={17} className="text-[#CC66FF]" strokeWidth={2.2} />
                        </span>
                        <p className={`leading-relaxed text-white/85 ${i === 0 ? 'text-lg md:text-xl' : 'text-[15px]'}`}>
                          {feature}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* BENEFICIOS - Layout: Imagen izquierda, Contenido derecha */}
        {tBen.visible() && (
        <section className="bg-white px-4 py-14 md:py-20">
          <div className="container mx-auto max-w-5xl">
            <div>

              {/* Contenido */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading mb-8 text-2xl text-[#0A0A0A] md:text-4xl">
                  {tBen('titulo_1', 'BENEFICIOS')} <span className="text-[#7700CE]">{tBen('titulo_2', 'PRINCIPALES')}</span>
                </h2>
                {/* Sobre blanco, con el icono en un disco y sin caja: es la
                    ZONA 3 de las páginas de servicio, y es el respiro claro
                    que parte la página en dos. */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(i, 5) * 0.07 }}
                      className="flex items-start gap-4"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7700CE]/12">
                        <benefit.icon size={17} className="text-[#7700CE]" strokeWidth={2.2} />
                      </span>
                      <div>
                        <h3 className="heading mb-1 text-base text-[#0A0A0A] md:text-lg">{benefit.title}</h3>
                        <p className="text-[15px] leading-relaxed text-[#0A0A0A]/65">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        )}

        {/* CÓMO FUNCIONA — el mismo recorrido que las páginas de servicio.
            Eran cuatro cajitas quietas; ahora el proceso se arma con el scroll
            y al lado hay un lienzo que gana piezas paso a paso. Es lo que
            hacía que aquellas se sintieran vivas y a estas les faltaba. */}
        {tHow.visible() && (
          <RecorridoProceso
            slug="servicios-ia-whatsapp"
            pasos={howItWorks}
            sello={tHow('bajada', 'Implementación acompañada')}
            titulo={
              <>
                {tHow('titulo_1', 'CÓMO')}{' '}
                <span className="text-[#CC66FF]">{tHow('titulo_2', 'FUNCIONA')}</span>
              </>
            }
          />
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
            
            {/* Renglones y no tarjetas: son frases cortas, y meter cada una
                en su caja con borde redondeado era darles un peso que no
                tienen. El ✓ era un caracter suelto haciendo de icono, con
                lucide importado tres lineas mas arriba. */}
            <div className="grid gap-x-10 md:grid-cols-2">
              {idealFor.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i, 5) * 0.05 }}
                  className="flex items-start gap-3 border-t border-white/10 py-4"
                >
                  <CheckCircle2 className="mt-0.5 flex-shrink-0 text-[#CC66FF]" size={17} />
                  <span className="text-[15px] leading-relaxed text-white/75 md:text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* PREGUNTAS FRECUENTES — se publican tambien como datos
            estructurados desde render.php, asi que conviene que digan algo
            de verdad: son las que un asistente cita como respuesta. */}
        {tFaq('q1', '') !== '' && (
          <section className="px-4 py-10 md:py-16">
            <div className="container mx-auto max-w-5xl">
              <h2 className="heading mb-8 text-2xl md:text-4xl text-white">
                {tFaq('titulo_1', 'PREGUNTAS')}{' '}
                <span className="text-[#CC66FF]">{tFaq('titulo_2', 'FRECUENTES')}</span>
              </h2>
              <div className="grid gap-x-12 border-t border-white/10 lg:grid-cols-2">
                {[1, 2, 3, 4, 5, 6]
                  .filter((n) => tFaq(`q${n}`, '') !== '')
                  .map((n) => (
                    <motion.div
                      key={n}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5 }}
                      className="border-b border-white/10 py-6"
                    >
                      <h3 className="mb-2.5 text-[16px] md:text-[17px] font-bold text-white">
                        {tFaq(`q${n}`, '')}
                      </h3>
                      <p className="text-[15px] leading-[1.75] text-white/60">
                        {tFaq(`r${n}`, '')}
                      </p>
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
              {/* Bloque de color, no una foto: encima llevaba un degradado al 90%
                  de opacidad, asi que de la foto no se veia practicamente nada. */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#7700CE] to-[#9933FF]" />

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