import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Nfc,
  Zap,
  RefreshCw,
  Leaf,
  Sparkles as SparklesIcon,
  Check,
  ArrowLeft,
  Wallet,
  Palette,
  Cpu,
  ArrowRight,
  Hand,
  Globe,
  Instagram,
  Phone,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router';
import FAQAccordion from '../components/FAQAccordion';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';

/*
 * ESTRUCTURA A PROPOSITO DISTINTA al resto del sitio.
 *
 * Las paginas de servicio del sitio son todas la misma pila vertical de
 * secciones a todo lo ancho: hero, que incluye, beneficios, como funciona,
 * ideal para, FAQ, CTA. Cada una con su titulo y una rejilla debajo.
 * Restilizar esos bloques no cambia que se lean igual.
 *
 * Aqui el recorrido es otro:
 *
 *   1. ESCENARIO INTERACTIVO   el producto se prueba, no se describe:
 *                              tocas la tarjeta y el telefono responde
 *   2. RECORRIDO PEGAJOSO      el visual queda fijo y el texto avanza con
 *                              el scroll; cuatro pasos en UNA sola zona,
 *                              no cuatro tarjetas en una rejilla
 *   3. BENTO ASIMETRICO        beneficios, ficha y publico en una sola
 *                              composicion de piezas de distinto tamano,
 *                              en vez de tres secciones apiladas con titulo
 *   4. CIERRE COMPACTO         FAQ y CTA juntos, no dos secciones mas
 *
 * Se mantiene: paleta morada de marca, tipografia Hanson y las animaciones.
 */

const SERVICE_NAME = 'Tarjetas de Presentación Digital NFC';

const steps = [
  {
    n: '01',
    icon: Palette,
    title: 'Diseño',
    description: 'Creamos tu tarjeta con tu marca, logo y colores. Tú apruebas cómo se ve antes de producir nada.',
    caption: 'Tu identidad sobre la tarjeta',
  },
  {
    n: '02',
    icon: Cpu,
    title: 'Programación',
    description: 'Configuramos el chip NFC y lo vinculamos a tu perfil digital: contacto, redes y portafolio.',
    caption: 'Chip NFC vinculado a tu perfil',
  },
  {
    n: '03',
    icon: Nfc,
    title: 'Un toque',
    description: 'Acercas la tarjeta al celular de la otra persona. Sin apps, sin escribir nada, sin escanear códigos.',
    caption: 'Se comparte al instante',
  },
  {
    n: '04',
    icon: RefreshCw,
    title: 'Actualiza',
    description: 'Cambias de número, puesto o empresa y lo editas en tu perfil. La tarjeta física nunca se reimprime.',
    caption: 'Siempre al día, sin reimprimir',
  },
];

const benefits = [
  { icon: Zap, title: 'Comparte en segundos', description: 'Un toque y tu contacto queda guardado, sin escribir nada a mano.' },
  { icon: RefreshCw, title: 'Siempre actualizada', description: 'Cambia tu información cuando quieras: la tarjeta física no cambia.' },
  { icon: Leaf, title: 'Cero reimpresiones', description: 'Olvídate de tirar cajas de tarjetas viejas cada vez que cambia un dato.' },
  { icon: SparklesIcon, title: 'Imagen profesional', description: 'Una primera impresión moderna y memorable en cada reunión.' },
];

const specs = [
  { label: 'Compartir', value: 'Un toque' },
  { label: 'Apps', value: 'Ninguna' },
  { label: 'Ediciones', value: 'Ilimitadas' },
  { label: 'Entrega', value: '3–5 días' },
];

const idealFor = [
  'Emprendedores y freelancers que hacen networking',
  'Equipos comerciales que comparten contacto al vuelo',
  'Consultores que actualizan su información seguido',
  'Empresas que cuidan su imagen en cada interacción',
  'Agentes inmobiliarios y asesores en ferias y eventos',
];

const faqItems = [
  { q: '¿Necesito instalar una aplicación para usarla?', a: 'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.' },
  { q: '¿Qué pasa si cambio de número o de trabajo?', a: 'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.' },
  { q: '¿Qué información puedo compartir?', a: 'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.' },
  { q: '¿Cuánto tarda la entrega?', a: 'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.' },
];

/* ------------------------------------------------------------------ */
/* Tarjeta con barrido holografico, reutilizada en varias zonas        */
/* ------------------------------------------------------------------ */
function HoloCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-[#5500AA] via-[#7700CE] to-[#9933FF] shadow-[0_25px_70px_rgba(119,0,206,0.45)] flex flex-col justify-between overflow-hidden ${
        compact ? 'w-52 h-32 p-4' : 'w-[19rem] h-[11.5rem] sm:w-[21rem] sm:h-[12.5rem] p-6'
      }`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 45%, rgba(204,102,255,0.5) 55%, transparent 70%)',
          mixBlendMode: 'overlay',
        }}
        animate={{ x: ['-120%', '120%'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
      />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="relative flex items-start justify-between">
        <div className={`rounded bg-gradient-to-br from-white/50 to-white/20 border border-white/20 ${compact ? 'w-7 h-5' : 'w-10 h-7'}`} />
        <motion.div animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <Nfc className="text-white" size={compact ? 18 : 26} />
        </motion.div>
      </div>
      <div className="relative">
        <div className={`heading text-white tracking-wide ${compact ? 'text-sm' : 'text-xl mb-1'}`}>TU NOMBRE</div>
        <div className={`text-white/65 uppercase tracking-[0.22em] ${compact ? 'text-[8px]' : 'text-[10px]'}`}>Tu puesto · Tu empresa</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ZONA 1 — Escenario interactivo: el producto se prueba               */
/* ------------------------------------------------------------------ */
function TapStage() {
  const [plays, setPlays] = useState(0);
  const [tapped, setTapped] = useState(false);

  // Se reproduce sola al entrar, para que no se vea estatica
  useEffect(() => {
    const t = setTimeout(() => { setTapped(true); setPlays(1); }, 900);
    return () => clearTimeout(t);
  }, []);

  const replay = () => {
    setTapped(false);
    setPlays((p) => p + 1);
    setTimeout(() => setTapped(true), 420);
  };

  const contactRows = [
    { icon: Phone, label: '+52 449 120 4353' },
    { icon: Mail, label: 'tu@empresa.com' },
    { icon: Globe, label: 'tuempresa.com' },
    { icon: Instagram, label: '@tumarca' },
  ];

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 sm:gap-10 h-[22rem] sm:h-[26rem]">
        {/* Tarjeta que se acerca */}
        <motion.div
          key={`card-${plays}`}
          className="relative z-10"
          initial={{ x: 0, rotate: -8 }}
          animate={tapped ? { x: [0, 46, 0], rotate: [-8, -2, -8] } : { x: 0, rotate: -8 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <HoloCard compact />
          {/* Ondas NFC */}
          <AnimatePresence>
            {tapped &&
              [0, 0.25, 0.5].map((d) => (
                <motion.span
                  key={`${plays}-${d}`}
                  className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full border border-[#CC66FF]/60"
                  style={{ width: 60, height: 60 }}
                  initial={{ scale: 0.5, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.2, delay: d, ease: 'easeOut' }}
                />
              ))}
          </AnimatePresence>
        </motion.div>

        {/* Telefono que recibe */}
        <motion.div
          className="relative w-[9.5rem] h-[19rem] sm:w-44 sm:h-[21rem] rounded-[2rem] border border-white/15 bg-[#0B0910] overflow-hidden flex-shrink-0"
          animate={
            tapped
              ? { boxShadow: ['0 0 0 rgba(153,51,255,0)', '0 0 55px rgba(153,51,255,0.5)', '0 0 22px rgba(153,51,255,0.22)'] }
              : { boxShadow: '0 0 0 rgba(153,51,255,0)' }
          }
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-white/15" />
          <div className="pt-8 px-4">
            {/* Sin AnimatePresence: con mode="wait" la salida del estado inicial
                no resolvia y el perfil nunca llegaba a montarse. */}
            <div>
              {!tapped ? (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5 pt-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-2 rounded-full bg-white/[0.06]" style={{ width: `${80 - i * 18}%` }} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key={`profile-${plays}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 220, damping: 16 }}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7700CE] to-[#CC66FF] mx-auto mb-2.5"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.72 }}
                    className="text-center mb-4"
                  >
                    <div className="heading text-white text-[11px]">TU NOMBRE</div>
                    <div className="text-white/40 text-[8px] uppercase tracking-[0.18em]">Tu puesto</div>
                  </motion.div>
                  <div className="space-y-1.5">
                    {contactRows.map((row, i) => (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.85 + i * 0.09 }}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]"
                      >
                        <row.icon className="text-[#CC66FF] flex-shrink-0" size={10} />
                        <span className="text-white/55 text-[8px] truncate">{row.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="mt-3 flex items-center justify-center gap-1 py-1.5 rounded-md bg-[#CC66FF] text-black text-[8px] font-bold"
                  >
                    <Check size={9} strokeWidth={3} />
                    CONTACTO GUARDADO
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <button
        onClick={replay}
        className="group mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/12 bg-white/[0.03] hover:border-[#CC66FF]/50 hover:bg-white/[0.06] transition-colors cursor-pointer"
      >
        <Hand className="text-[#CC66FF] group-hover:-translate-y-0.5 transition-transform" size={14} />
        <span className="text-white/60 text-xs tracking-wide">Toca para verlo otra vez</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ZONA 2 — Recorrido pegajoso: el visual se queda, el texto avanza    */
/* ------------------------------------------------------------------ */
function StickyJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Se calcula el paso desde el rect del contenedor en cada scroll.
     Se probo useScroll de motion y no disparaba: mide en el montaje y aqui
     el alto real cambia despues (fuentes, contenido diferido). Leer el rect
     en el momento no depende de ese timing. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      if (recorrido <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / recorrido));
      const i = Math.min(steps.length - 1, Math.floor(p * steps.length));
      setActive((prev) => (prev === i ? prev : i));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const Current = steps[active];

  return (
    <>
      {/* Escritorio: una sola zona alta con el visual fijo */}
      <div ref={ref} className="hidden lg:block relative" style={{ height: `${steps.length * 85}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 w-full">
            <div className="grid grid-cols-2 gap-16 items-center">
              {/* Texto que avanza */}
              <div>
                <div className="flex items-center gap-2 mb-8">
                  {steps.map((s, i) => (
                    <div
                      key={s.n}
                      className={`h-0.5 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-[#CC66FF]' : 'w-5 bg-white/15'}`}
                    />
                  ))}
                </div>

                {/* motion.div con key, SIN AnimatePresence: con mode="wait" la
                    salida no resolvia y el bloque se quedaba congelado en el
                    primer paso. Al cambiar la key, React monta el nuevo y este
                    entra animado; no hay salida que pueda bloquearse. */}
                <motion.div
                  key={Current.n}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <span className="heading text-6xl text-white/[0.08]">{Current.n}</span>
                    <div className="w-12 h-12 rounded-md border border-white/10 bg-white/[0.03] flex items-center justify-center">
                      <Current.icon className="text-[#9933FF]" size={21} />
                    </div>
                  </div>
                  <h3 className="heading text-4xl text-white mb-5">{Current.title}</h3>
                  <p className="text-white/50 text-lg leading-relaxed max-w-md">{Current.description}</p>
                </motion.div>
              </div>

              {/* Visual fijo */}
              <div className="relative flex items-center justify-center h-[26rem]">
                <motion.div
                  animate={{ rotate: active === 2 ? 0 : -7, scale: active === 3 ? 0.94 : 1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <HoloCard />
                </motion.div>

                {/* Capa por paso */}
                <AnimatePresence>
                  {active === 1 && (
                    <motion.div
                      key="chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      {[0, 0.4].map((d) => (
                        <motion.span
                          key={d}
                          className="absolute rounded-full border border-[#CC66FF]/50"
                          style={{ width: 120, height: 120 }}
                          animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: 'easeOut' }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {active === 2 && (
                    <motion.div
                      key="tap"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="absolute right-4 w-28 h-52 rounded-[1.5rem] border border-white/15 bg-[#0B0910] flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                      >
                        <Check className="text-[#CC66FF]" size={22} strokeWidth={3} />
                        <span className="text-white/45 text-[9px] text-center px-3">Contacto guardado</span>
                      </motion.div>
                    </motion.div>
                  )}
                  {active === 3 && (
                    <motion.div
                      key="update"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      className="absolute -bottom-2 flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-[#0B0910]"
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
                        <RefreshCw className="text-[#CC66FF]" size={13} />
                      </motion.div>
                      <span className="text-white/50 text-xs">Perfil actualizado · sin reimprimir</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key={`cap-${active}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-14 text-white/30 text-[11px] tracking-[0.25em] uppercase"
                >
                  {Current.caption}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movil: mismo contenido, sin scroll pegajoso (no funciona bien en tactil) */}
      <div className="lg:hidden px-4 py-16 space-y-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-4 border-l-2 border-[#9933FF]/30 pl-5 py-1"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="heading text-2xl text-white/15">{s.n}</span>
                <s.icon className="text-[#9933FF]" size={17} />
              </div>
              <h3 className="heading text-lg text-white mb-1.5">{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Pieza del bento                                                     */
/* ------------------------------------------------------------------ */
function Tile({ className = '', children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.45 }}
      className={`relative border border-white/10 bg-white/[0.015] hover:bg-white/[0.035] hover:border-white/20 transition-colors overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function TarjetasDigitalesPage() {
  const { openAssistant } = useApp();
  const cta = () => openAssistant(SERVICE_NAME, 'cotizar tarjetas de presentación digital NFC');

  return (
    <>
      <DynamicSEO
        title="Tarjetas de Presentación Digital NFC - INÉDITO DIGITAL"
        description="Tarjetas de presentación digitales con tecnología NFC. Comparte tu contacto, redes y portafolio con un solo toque, sin apps y siempre actualizadas."
        keywords={['tarjeta de presentacion digital', 'tarjeta nfc', 'tarjeta de presentacion nfc aguascalientes', 'business card nfc', 'tarjeta digital de contacto']}
      />

      <div className="relative bg-[#07060B]">
        {/* Fondo propio: grid de puntos + aurora. No usa TopographyCanvas ni Floating3D. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(153,51,255,0.5) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
              maskImage: 'radial-gradient(ellipse 75% 55% at 50% 30%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 30%, black, transparent)',
            }}
          />
          <motion.div
            className="absolute -top-1/4 left-1/4 w-[34rem] h-[34rem] rounded-full bg-[#7700CE]/20 blur-[130px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10">
          {/* ---------- ZONA 1 — Escenario interactivo ---------- */}
          <section className="px-4 pt-10 pb-16 md:pt-16 md:pb-20">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link to="/servicios" className="inline-flex items-center gap-1.5 text-white/35 hover:text-white text-xs transition-colors group">
                  <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                  Servicios
                </Link>
                <span className="text-white/15">/</span>
                <span className="inline-flex items-center gap-1.5 text-[#CC66FF] text-xs font-bold tracking-[0.18em]">
                  <Nfc size={12} />
                  NFC
                </span>
              </div>

              <TapStage />

              <div className="max-w-3xl mx-auto text-center mt-12">
                <h1 className="heading text-white leading-[1.08] mb-5">
                  TU TARJETA DE PRESENTACIÓN,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9933FF] to-[#CC66FF]">AHORA DIGITAL</span>
                </h1>
                <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                  Comparte tu contacto, redes y portafolio con un solo toque. Sin imprimir, sin apps, siempre al día.
                </p>
                <button
                  onClick={cta}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-md bg-white text-black hover:bg-[#CC66FF] transition-colors cursor-pointer"
                >
                  <span className="heading text-sm tracking-[0.08em]">COTIZAR MI TARJETA</span>
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </section>

          {/* ---------- ZONA 2 — Recorrido pegajoso ---------- */}
          <StickyJourney />

          {/* ---------- ZONA 3 — Bento asimetrico ---------- */}
          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(9rem,auto)] gap-px bg-white/10 border border-white/10">
                {/* Pieza grande: la tarjeta */}
                <Tile className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-5 p-8 !bg-[#07060B]">
                  <HoloCard />
                  <div className="text-center">
                    <p className="text-white/45 text-sm max-w-xs leading-relaxed">
                      Acabado premium con chip NFC dentro. El diseño es tuyo; el contenido lo cambias cuando quieras.
                    </p>
                  </div>
                </Tile>

                {/* Beneficios */}
                {benefits.map((b, i) => (
                  <Tile key={b.title} className="p-6 !bg-[#07060B]" delay={i * 0.05}>
                    <b.icon className="text-[#9933FF] mb-3" size={19} />
                    <h3 className="heading text-sm text-white mb-1.5">{b.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{b.description}</p>
                  </Tile>
                ))}

                {/* Ficha rapida */}
                {specs.map((s, i) => (
                  <Tile key={s.label} className="p-6 flex flex-col justify-center !bg-[#07060B]" delay={i * 0.05}>
                    <div className="text-white/30 text-[10px] tracking-[0.22em] uppercase mb-1.5">{s.label}</div>
                    <div className="heading text-xl text-white">{s.value}</div>
                  </Tile>
                ))}

                {/* Publico */}
                <Tile className="col-span-2 lg:col-span-3 p-7 !bg-[#07060B]">
                  <div className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-4">Ideal para</div>
                  <div className="flex flex-wrap gap-2">
                    {idealFor.map((item) => (
                      <span key={item} className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/55 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </Tile>

                {/* Wallet */}
                <Tile className="col-span-2 lg:col-span-1 p-6 flex flex-col justify-center gap-2.5 !bg-[#07060B]">
                  <Wallet className="text-[#CC66FF]" size={19} />
                  <p className="text-white/50 text-xs leading-relaxed">Se guarda en Apple Wallet y Google Wallet</p>
                </Tile>
              </div>
            </div>
          </section>

          {/* ---------- ZONA 4 — Cierre compacto: FAQ + CTA juntos ---------- */}
          <section className="px-4 pb-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
                <div>
                  <div className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-5">Preguntas frecuentes</div>
                  <FAQAccordion items={faqItems} variant="dark" />
                </div>

                <div className="relative border border-white/10 bg-white/[0.02] overflow-hidden lg:sticky lg:top-28">
                  <motion.div
                    className="absolute -top-20 -right-12 w-56 h-56 rounded-full bg-[#7700CE]/25 blur-[90px]"
                    animate={{ opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="relative z-10 p-8">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-flex mb-5"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_35px_rgba(119,0,206,0.45)]">
                        <Nfc className="text-white" size={22} />
                      </div>
                    </motion.div>
                    <h2 className="heading text-xl md:text-2xl mb-3 text-white leading-tight">¿Listo para modernizar tu tarjeta?</h2>
                    <p className="text-white/45 text-sm mb-6 leading-relaxed">
                      Cotiza tu tarjeta NFC y empieza a compartir tu contacto con un solo toque.
                    </p>
                    <button
                      onClick={cta}
                      className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-md bg-white text-black hover:bg-[#CC66FF] transition-colors cursor-pointer"
                    >
                      <span className="heading text-sm tracking-[0.08em]">COTIZAR AHORA</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
