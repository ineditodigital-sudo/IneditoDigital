import { motion } from 'motion/react';
import {
  Nfc,
  Smartphone,
  Zap,
  RefreshCw,
  Leaf,
  Sparkles as SparklesIcon,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Wallet,
  Palette,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { GlassCard } from '../components/GlassCard';
import FAQAccordion from '../components/FAQAccordion';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';

const SERVICE_NAME = 'Tarjetas de Presentación Digital NFC';

const features = [
  'Un toque con el celular comparte tu contacto, redes y portafolio al instante',
  'Funciona con cualquier smartphone moderno, sin descargar ninguna app',
  'Diseño personalizado con tu marca, logo y colores',
  'Actualiza tu información cuando quieras sin reimprimir nada',
  'Incluye tu perfil digital propio, siempre disponible en línea',
  'Compatible con Apple Wallet y Google Wallet para guardar tu contacto',
];

const benefits = [
  {
    icon: Zap,
    title: 'Comparte en segundos',
    description: 'Un toque y tu contacto queda guardado en el teléfono de la otra persona, sin escribir nada a mano.',
  },
  {
    icon: RefreshCw,
    title: 'Siempre actualizada',
    description: 'Cambia tu teléfono, correo o redes cuando quieras: la tarjeta física nunca cambia, el contenido sí.',
  },
  {
    icon: Leaf,
    title: 'Cero reimpresiones',
    description: 'Olvídate de tirar cajas de tarjetas viejas cada vez que cambia un dato.',
  },
  {
    icon: SparklesIcon,
    title: 'Imagen profesional',
    description: 'Sorprende en cada reunión y networking con una experiencia moderna y memorable.',
  },
];

const idealFor = [
  'Emprendedores y freelancers que hacen networking constantemente',
  'Equipos comerciales que comparten contacto y portafolio al vuelo',
  'Consultores y profesionales que actualizan su información con frecuencia',
  'Empresas que quieren reforzar su imagen de marca en cada interacción',
  'Agentes inmobiliarios, asesores y vendedores en eventos y ferias',
];

const howItWorks = [
  { step: 1, icon: Palette, title: 'Diseño', description: 'Creamos tu tarjeta digital con tu marca, foto, redes y portafolio.' },
  { step: 2, icon: Cpu, title: 'Programación', description: 'Configuramos el chip NFC y lo vinculamos a tu perfil digital.' },
  { step: 3, icon: Nfc, title: 'Un toque', description: 'Acercas tu tarjeta al celular de la otra persona y comparte todo al instante.' },
  { step: 4, icon: RefreshCw, title: 'Actualiza cuando quieras', description: 'Cambia tu información desde tu perfil, sin reimprimir la tarjeta.' },
];

const faqItems = [
  { q: '¿Necesito instalar una aplicación para usarla?', a: 'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.' },
  { q: '¿Qué pasa si cambio de número o de trabajo?', a: 'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.' },
  { q: '¿Qué información puedo compartir?', a: 'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.' },
  { q: '¿Cuánto tarda la entrega?', a: 'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.' },
];

/** Animación ambiental: la tarjeta "toca" el teléfono en loop y emite ondas NFC. */
function NfcTapAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
        {/* Ondas NFC concéntricas */}
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            className="absolute rounded-full border-2 border-[#9933FF]/50"
            style={{ width: 90, height: 90 }}
            animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay, ease: 'easeOut' }}
          />
        ))}

        {/* Teléfono */}
        <motion.div
          className="absolute right-2 sm:right-6 w-24 h-44 sm:w-28 sm:h-52 rounded-[1.75rem] bg-white/8 border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.4)]"
          animate={{ boxShadow: ['0 0 0px rgba(153,51,255,0)', '0 0 40px rgba(153,51,255,0.5)', '0 0 0px rgba(153,51,255,0)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Smartphone className="text-white/40" size={32} />
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/90 text-[9px] font-bold text-black whitespace-nowrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0, 0, 1, 1, 0], y: [6, 6, 0, 0, 6] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.55, 0.65, 0.9, 1] }}
          >
            <CheckCircle2 size={11} />
            CONTACTO GUARDADO
          </motion.div>
        </motion.div>

        {/* Tarjeta NFC */}
        <motion.div
          className="absolute left-2 sm:left-6 w-32 h-20 sm:w-36 sm:h-24 rounded-xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] shadow-[0_10px_40px_rgba(119,0,206,0.5)] flex flex-col justify-between p-3"
          animate={{ x: [0, 58, 0], y: [0, -6, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-between">
            <div className="w-4 h-3 rounded-sm bg-white/30" />
            <Nfc className="text-white/80" size={16} />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-16 rounded-full bg-white/50" />
            <div className="h-1.5 w-10 rounded-full bg-white/30" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function TarjetasDigitalesPage() {
  const { openAssistant } = useApp();

  return (
    <>
      <DynamicSEO
        title="Tarjetas de Presentación Digital NFC - INÉDITO DIGITAL"
        description="Tarjetas de presentación digitales con tecnología NFC. Comparte tu contacto, redes y portafolio con un solo toque, sin apps y siempre actualizadas."
        keywords={['tarjeta de presentacion digital', 'tarjeta nfc', 'tarjeta de presentacion nfc aguascalientes', 'business card nfc', 'tarjeta digital de contacto']}
      />

      {/* HERO */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden pt-20 md:pt-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0010] via-black to-black" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#7700CE]/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#9933FF]/15 blur-[100px]" />

        <div className="container mx-auto max-w-7xl relative z-10 px-4 py-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm rounded-full bg-[#7700CE]/30 border border-[#7700CE]/50 backdrop-blur-xl text-[#CC66FF] font-bold mb-5">
                <Nfc size={14} />
                TECNOLOGÍA NFC
              </span>

              <h1 className="heading mb-4 text-white drop-shadow-[0_0_40px_rgba(119,0,206,0.6)]">
                TU TARJETA DE PRESENTACIÓN,<br className="hidden sm:block" /> AHORA <span className="text-[#CC66FF]">DIGITAL</span>
              </h1>

              <p className="text-base md:text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
                Comparte tu contacto, redes sociales y portafolio con un solo toque. Sin imprimir, sin apps, siempre al día.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openAssistant(SERVICE_NAME, 'cotizar tarjetas de presentación digital NFC')}
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.5)] cursor-pointer"
                >
                  <span className="heading text-sm tracking-[0.08em]">COTIZAR MI TARJETA</span>
                  <ArrowRight size={18} />
                </button>
                <Link
                  to="/servicios"
                  className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Volver a servicios</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <NfcTapAnimation className="py-6" />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="bg-black">
        {/* STATS RÁPIDOS */}
        <section className="py-8 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
              {[
                { value: '1', label: 'toque para compartir todo' },
                { value: '0', label: 'apps que instalar' },
                { value: '∞', label: 'actualizaciones sin reimprimir' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="heading text-4xl md:text-6xl text-[#7700CE] mb-1">{stat.value}</div>
                  <p className="text-gray-600 text-xs md:text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3">
                CÓMO <span className="text-[#7700CE]">FUNCIONA</span>
              </h2>
              <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
                De la idea a tu primer contacto compartido, en 4 pasos
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {howItWorks.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="h-full p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#7700CE]/40 transition-colors backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-xl bg-[#7700CE]/20 flex items-center justify-center mb-4">
                      <step.icon className="text-[#7700CE]" size={22} />
                    </div>
                    <div className="heading text-2xl text-[#7700CE]/60 mb-1">{step.step.toString().padStart(2, '0')}</div>
                    <h3 className="heading text-base md:text-lg mb-1.5 text-white">{step.title}</h3>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {i < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px bg-gradient-to-r from-[#7700CE]/40 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* QUÉ INCLUYE */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-5 text-black">
                  QUÉ <span className="text-[#7700CE]">INCLUYE</span>
                </h2>
                <div className="space-y-2.5 md:space-y-3">
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2.5 p-3 md:p-3.5 rounded-lg bg-white/80 border border-gray-200 hover:border-[#7700CE]/30 transition-colors"
                    >
                      <CheckCircle2 className="text-[#7700CE] flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Mockup de tarjeta, sin foto de stock */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative flex items-center justify-center py-8"
              >
                <motion.div
                  whileHover={{ rotate: 0, scale: 1.03 }}
                  initial={{ rotate: -6 }}
                  className="relative w-72 h-44 sm:w-80 sm:h-48 rounded-2xl bg-gradient-to-br from-[#7700CE] via-[#8a1adb] to-[#9933FF] shadow-[0_20px_60px_rgba(119,0,206,0.4)] p-6 flex flex-col justify-between transition-transform duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-7 rounded-md bg-white/25" />
                    <Nfc className="text-white/90" size={26} />
                  </div>
                  <div>
                    <div className="heading text-white text-lg mb-1 tracking-wide">TU NOMBRE</div>
                    <div className="text-white/70 text-xs uppercase tracking-[0.15em]">Tu puesto · Tu empresa</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-[10px]">
                    <Share2 size={11} />
                    <span>Toca para compartir</span>
                  </div>
                </motion.div>
                <div className="absolute -bottom-2 w-56 h-8 bg-black/20 blur-xl rounded-full" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2">
                BENEFICIOS <span className="text-[#7700CE]">PRINCIPALES</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
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
          </div>
        </section>

        {/* IDEAL PARA */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2 text-black">
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
                  <div className="p-4 md:p-5 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#7700CE]/40 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#7700CE]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#7700CE] text-xs font-bold">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm md:text-base">{item}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <GlassCard variant="purple" className="flex items-center gap-2.5 !p-3 !px-4">
                <Wallet className="text-[#7700CE]" size={18} />
                <span className="text-white/80 text-xs md:text-sm">Compatible con Apple Wallet y Google Wallet</span>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-6 md:py-10 px-4 bg-[#0D0010]">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="heading text-xl md:text-2xl lg:text-3xl mb-2">
                PREGUNTAS <span className="text-[#7700CE]">FRECUENTES</span>
              </h2>
            </div>
            <FAQAccordion items={faqItems} />
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-6 md:py-10 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#7700CE] to-[#9933FF]"
            >
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-40 h-40 rounded-full bg-white/10 blur-[80px]" />
              <div className="relative z-10 text-center p-6 md:p-10">
                <h2 className="heading text-2xl md:text-3xl lg:text-4xl mb-3 text-white">
                  ¿LISTO PARA <span className="drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">MODERNIZAR</span> TU TARJETA?
                </h2>
                <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
                  Cotiza tu tarjeta de presentación digital NFC y empieza a compartir tu contacto con un solo toque
                </p>
                <button
                  onClick={() => openAssistant(SERVICE_NAME, 'cotizar tarjetas de presentación digital NFC')}
                  className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white text-[#7700CE] hover:bg-white/90 transition-all hover:scale-105 shadow-[0_10px_40px_rgba(0,0,0,0.3)] cursor-pointer"
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
