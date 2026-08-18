import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useMotionValue } from 'motion/react';
import {
  Nfc,
  Zap,
  RefreshCw,
  Leaf,
  Sparkles as SparklesIcon,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Palette,
  Cpu,
  Hand,
  Globe,
  Instagram,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router';
import FAQAccordion from '../components/FAQAccordion';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';

/*
 * ESTRUCTURA A PROPOSITO DISTINTA al resto del sitio.
 *
 * Las paginas de servicio del sitio son la misma pila vertical de secciones
 * a todo lo ancho, cada una con su titulo y una rejilla debajo. Aqui el
 * recorrido es otro:
 *
 *   1. ESCENARIO INTERACTIVO   el producto se prueba, no se describe
 *   2. RECORRIDO PEGAJOSO      el visual queda fijo y el texto avanza
 *   3. COMPARACION             impresa vs NFC, lado a lado
 *   4. BENTO ASIMETRICO        ficha y publico en una composicion
 *   5. CIERRE COMPACTO         FAQ y CTA juntos
 *
 * DESIGN SYSTEM: se respetan los tokens del sitio.
 *   - redondeos: rounded-full en botones, rounded-2xl/3xl en tarjetas,
 *     rounded-xl en piezas chicas (theme.css: --radius-button 999px,
 *     --radius-card 24px)
 *   - tipografia: .heading = Hanson en mayusculas; cuerpo por defecto
 *   - iconos: lucide-react en los tamanos que ya usa el sitio (16/18/20/28)
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

/* Beneficios reformulados como comparacion directa contra la tarjeta impresa */
const comparison = [
  { impresa: 'Dictas o tecleas tus datos', nfc: 'Un toque y queda guardado' },
  { impresa: 'Los datos quedan congelados', nfc: 'La editas cuando quieras' },
  { impresa: 'Reimprimes con cada cambio', nfc: 'Cero reimpresiones' },
  { impresa: 'Termina en un cajón', nfc: 'Una impresión que se recuerda' },
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
/* Tarjeta con barrido holografico                                     */
/* ------------------------------------------------------------------ */
function HoloCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br from-[#5500AA] via-[#7700CE] to-[#9933FF] shadow-[0_25px_70px_rgba(119,0,206,0.45)] flex flex-col justify-between overflow-hidden ${
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
        <div className={`rounded-lg bg-gradient-to-br from-white/50 to-white/20 border border-white/20 ${compact ? 'w-7 h-5' : 'w-10 h-7'}`} />
        <motion.div animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <Nfc className="text-white" size={compact ? 18 : 28} />
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
/* ZONA 1 — Escenario interactivo                                      */
/* ------------------------------------------------------------------ */
function TapStage() {
  const [plays, setPlays] = useState(0);
  const [tapped, setTapped] = useState(false);

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
        <motion.div
          key={`card-${plays}`}
          className="relative z-10"
          initial={{ x: 0, rotate: -8 }}
          animate={tapped ? { x: [0, 46, 0], rotate: [-8, -2, -8] } : { x: 0, rotate: -8 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <HoloCard compact />
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
        </motion.div>

        <motion.div
          className="relative w-[9.5rem] h-[19rem] sm:w-44 sm:h-[21rem] rounded-3xl border border-white/15 bg-[#0B0910] overflow-hidden flex-shrink-0"
          animate={
            tapped
              ? { boxShadow: ['0 0 0 rgba(153,51,255,0)', '0 0 55px rgba(153,51,255,0.5)', '0 0 22px rgba(153,51,255,0.22)'] }
              : { boxShadow: '0 0 0 rgba(153,51,255,0)' }
          }
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-white/15" />
          <div className="pt-8 px-4">
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
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} className="text-center mb-4">
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
                        className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]"
                      >
                        <row.icon className="text-[#CC66FF] flex-shrink-0" size={16} />
                        <span className="text-white/55 text-[8px] truncate">{row.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-full bg-[#CC66FF] text-black text-[8px] font-bold"
                  >
                    <Check size={16} strokeWidth={3} />
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
        className="group mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/12 bg-white/[0.03] hover:border-[#CC66FF]/50 hover:bg-white/[0.06] transition-colors cursor-pointer"
      >
        <Hand className="text-[#CC66FF] group-hover:-translate-y-0.5 transition-transform" size={16} />
        <span className="text-white/60 text-xs tracking-wide">Toca para verlo otra vez</span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ZONA 2 — Recorrido pegajoso                                         */
/* ------------------------------------------------------------------ */
function StickyJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  // Progreso continuo para el riel: se anima sin provocar re-render
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      if (recorrido <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / recorrido));
      progress.set(p);
      const yaEmpezo = p > 0.02;
      setStarted((prev) => (prev === yaEmpezo ? prev : yaEmpezo));
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
  }, [progress]);

  const Current = steps[active];

  return (
    <>
      {/* Escritorio: zona alta con el visual fijo */}
      <div ref={ref} className="hidden lg:block relative" style={{ height: `${steps.length * 95}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 w-full">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-10 xl:gap-16 items-center">
              {/* Riel de progreso: hace visible cuanto recorrido queda */}
              <div className="relative h-72 w-px bg-white/10 self-center">
                <motion.div
                  className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#9933FF] to-[#CC66FF] origin-top"
                  style={{ scaleY: progress }}
                />
                {steps.map((s, i) => (
                  <div
                    key={s.n}
                    className="absolute -left-[7px] flex items-center gap-3"
                    style={{ top: `${(i / (steps.length - 1)) * 100}%`, transform: 'translateY(-50%)' }}
                  >
                    <motion.span
                      className="block w-[15px] h-[15px] rounded-full border"
                      animate={
                        i <= active
                          ? { backgroundColor: '#CC66FF', borderColor: '#CC66FF', scale: i === active ? 1.15 : 1 }
                          : { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.2)', scale: 1 }
                      }
                      transition={{ duration: 0.35 }}
                    />
                    <motion.span
                      className="heading text-[11px] tracking-[0.2em]"
                      animate={{ color: i === active ? '#CC66FF' : 'rgba(255,255,255,0.25)' }}
                      transition={{ duration: 0.35 }}
                    >
                      {s.n}
                    </motion.span>
                  </div>
                ))}
              </div>

              {/* Texto que avanza */}
              <div>
                <motion.div
                  key={Current.n}
                  initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                      <Current.icon className="text-[#9933FF]" size={28} />
                    </div>
                    <span className="heading text-7xl text-white/[0.07]">{Current.n}</span>
                  </div>
                  <h3 className="heading text-4xl text-white mb-5">{Current.title}</h3>
                  <p className="text-white/50 text-lg leading-relaxed max-w-md">{Current.description}</p>
                </motion.div>

                {/* Aviso de scroll, solo mientras no ha empezado a avanzar */}
                <motion.div
                  animate={{ opacity: started ? 0 : 1, y: started ? 8 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 mt-10 text-white/30"
                >
                  <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                    <ArrowDown size={16} />
                  </motion.span>
                  <span className="text-[11px] tracking-[0.25em] uppercase">Sigue bajando</span>
                </motion.div>
              </div>

              {/* Visual fijo, con cambio marcado por paso */}
              <div className="relative flex items-center justify-center h-[26rem]">
                <motion.div
                  animate={{
                    rotate: active === 2 ? 2 : -8,
                    scale: active === 3 ? 0.9 : 1,
                    x: active === 2 ? -40 : 0,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <HoloCard />
                </motion.div>

                {/* Paso 02: ondas del chip */}
                {active === 1 &&
                  [0, 0.4].map((d) => (
                    <motion.span
                      key={`chip-${d}`}
                      className="absolute rounded-full border border-[#CC66FF]/50 pointer-events-none"
                      style={{ width: 120, height: 120 }}
                      animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: d, ease: 'easeOut' }}
                    />
                  ))}

                {/* Paso 03: entra el telefono y recibe */}
                {active === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 70, rotate: 6 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-2 w-32 h-56 rounded-3xl border border-white/15 bg-[#0B0910] flex items-center justify-center shadow-[0_0_45px_rgba(153,51,255,0.35)]"
                  >
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="flex flex-col items-center gap-2"
                    >
                      <Check className="text-[#CC66FF]" size={28} strokeWidth={3} />
                      <span className="text-white/45 text-[10px] text-center px-3">Contacto guardado</span>
                    </motion.div>
                  </motion.div>
                )}

                {/* Paso 04: actualizacion */}
                {active === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -bottom-4 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/10 bg-[#0B0910]"
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw className="text-[#CC66FF]" size={16} />
                    </motion.div>
                    <span className="text-white/50 text-xs">Perfil actualizado · sin reimprimir</span>
                  </motion.div>
                )}

                <motion.div
                  key={`cap-${active}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-16 text-white/30 text-[11px] tracking-[0.25em] uppercase whitespace-nowrap"
                >
                  {Current.caption}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movil: linea de tiempo apilada (el scroll pegajoso no va bien en tactil) */}
      <div className="lg:hidden px-4 py-16 space-y-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-4 border-l-2 border-[#9933FF]/30 pl-5 py-1"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="heading text-2xl text-white/15">{s.n}</span>
                <s.icon className="text-[#9933FF]" size={18} />
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
/* ZONA 3 — Beneficios como comparacion: impresa vs NFC                */
/* ------------------------------------------------------------------ */
function Comparison() {
  /* Se usa whileInView + viewport, igual que HomePage y las paginas de
     servicio, en vez de useInView con animate condicional: es el patron ya
     probado en produccion en todo el sitio. */
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="text-white/30 text-[11px] tracking-[0.3em] uppercase mb-4">Beneficios</div>
          <h2 className="heading text-2xl md:text-4xl text-white leading-tight">
            Lo mismo que hacías,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9933FF] to-[#CC66FF]">sin la parte molesta</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Columna apagada: la tarjeta impresa */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/10 bg-white/[0.015] p-7"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
                <CreditCard className="text-white/30" size={20} />
              </div>
              <div>
                <div className="heading text-base text-white/45">Tarjeta impresa</div>
                <div className="text-white/25 text-xs">Como siempre</div>
              </div>
            </div>

            <div className="space-y-4">
              {comparison.map((row, i) => (
                <motion.div
                  key={row.impresa}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <X className="text-white/20 flex-shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                  <span className="text-white/35 text-sm leading-relaxed">{row.impresa}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Columna encendida: la tarjeta NFC */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-[#9933FF]/30 bg-gradient-to-br from-[#9933FF]/[0.07] to-transparent p-7 overflow-hidden"
          >
            <motion.div
              className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#7700CE]/25 blur-[80px] pointer-events-none"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_25px_rgba(119,0,206,0.4)]">
                <Nfc className="text-white" size={20} />
              </div>
              <div>
                <div className="heading text-base text-white">Tarjeta NFC</div>
                <div className="text-[#CC66FF] text-xs">Con Inédito</div>
              </div>
            </div>

            <div className="relative space-y-4">
              {comparison.map((row, i) => (
                <motion.div
                  key={row.nfc}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.12, type: 'spring', stiffness: 300, damping: 18 }}
                    className="w-5 h-5 rounded-full bg-[#CC66FF] flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <Check className="text-black" size={16} strokeWidth={3} />
                  </motion.span>
                  <span className="text-white/75 text-sm leading-relaxed">{row.nfc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Tile({ className = '', children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-colors overflow-hidden ${className}`}
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
          {/* ---------- ZONA 1 ---------- */}
          <section className="px-4 pt-10 pb-14 md:pt-16 md:pb-16">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link to="/servicios" className="inline-flex items-center gap-1.5 text-white/35 hover:text-white text-xs transition-colors group">
                  <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  Servicios
                </Link>
                <span className="text-white/15">/</span>
                <span className="inline-flex items-center gap-1.5 text-[#CC66FF] text-xs font-bold tracking-[0.18em]">
                  <Nfc size={16} />
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
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.45)] cursor-pointer"
                >
                  <span className="heading text-sm tracking-[0.08em]">COTIZAR MI TARJETA</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Señal de scroll explicita hacia el recorrido */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="flex flex-col items-center gap-3 mt-16"
              >
                <span className="text-white/30 text-[11px] tracking-[0.3em] uppercase">Desliza para ver cómo funciona</span>
                <motion.div
                  animate={{ y: [0, 9, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center"
                >
                  <ArrowDown className="text-[#CC66FF]" size={18} />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ---------- ZONA 2 ---------- */}
          <StickyJourney />

          {/* ---------- ZONA 3 — Beneficios ---------- */}
          <Comparison />

          {/* ---------- ZONA 4 — Bento ---------- */}
          <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(9rem,auto)] gap-4">
                <Tile className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-5 p-8">
                  <HoloCard />
                  <p className="text-white/45 text-sm max-w-xs leading-relaxed text-center">
                    Acabado premium con chip NFC dentro. El diseño es tuyo; el contenido lo cambias cuando quieras.
                  </p>
                </Tile>

                {specs.map((s, i) => (
                  <Tile key={s.label} className="p-6 flex flex-col justify-center" delay={i * 0.06}>
                    <div className="text-white/30 text-[10px] tracking-[0.22em] uppercase mb-1.5">{s.label}</div>
                    <div className="heading text-2xl text-white">{s.value}</div>
                  </Tile>
                ))}

                <Tile className="col-span-2 lg:col-span-4 p-7" delay={0.1}>
                  <div className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-4">Ideal para</div>
                  <div className="flex flex-wrap gap-2">
                    {idealFor.map((item) => (
                      <span key={item} className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-white/55 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </Tile>
              </div>
            </div>
          </section>

          {/* ---------- ZONA 5 — Cierre ---------- */}
          <section className="px-4 pb-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
                <div>
                  <div className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-5">Preguntas frecuentes</div>
                  <FAQAccordion items={faqItems} variant="dark" />
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden lg:sticky lg:top-28">
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
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_35px_rgba(119,0,206,0.45)]">
                        <Nfc className="text-white" size={28} />
                      </div>
                    </motion.div>
                    <h2 className="heading text-xl md:text-2xl mb-3 text-white leading-tight">¿Listo para modernizar tu tarjeta?</h2>
                    <p className="text-white/45 text-sm mb-6 leading-relaxed">
                      Cotiza tu tarjeta NFC y empieza a compartir tu contacto con un solo toque.
                    </p>
                    <button
                      onClick={cta}
                      className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:shadow-[0_0_30px_rgba(119,0,206,0.45)] cursor-pointer"
                    >
                      <span className="heading text-sm tracking-[0.08em]">COTIZAR AHORA</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
