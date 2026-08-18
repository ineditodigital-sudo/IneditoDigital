import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, useMotionValue } from 'motion/react';
import {
  Nfc,
  RefreshCw,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Palette,
  Link2,
  SlidersHorizontal,
  MousePointer2,
  User,
  Users,
  Globe,
  Instagram,
  Phone,
  MessageCircle,
  CreditCard,
} from 'lucide-react';
import { Link } from 'react-router';
import FAQAccordion from '../components/FAQAccordion';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { contenido } from '../cms';

/*
 * ESTRUCTURA A PROPOSITO DISTINTA al resto del sitio.
 *
 *   1. ESCENARIO EN LOOP    el producto se muestra solo, en bucle
 *   2. RECORRIDO PEGAJOSO   la tarjeta SE ARMA paso a paso con el scroll
 *   3. COMPARACION          impresa vs NFC, sobre fondo blanco
 *   4. BENTO ASIMETRICO     ficha y publico
 *   5. CIERRE               FAQ sobre blanco + CTA
 *
 * El blanco vuelve en las zonas 3 y 5 para no perder el ritmo del sitio,
 * pero sin recuperar la formula de secciones apiladas del resto.
 *
 * DESIGN SYSTEM: rounded-full en botones, rounded-2xl/3xl en tarjetas;
 * .heading = Hanson; iconos lucide en 16/18/20/28.
 */

const SERVICE_NAME = 'Tarjetas de Presentación Digital NFC';

/* Cada paso suma una pieza a la tarjeta: el visual es acumulativo, para que
   se entienda como se arma desde cero. */
const steps = [
  {
    n: '01',
    icon: Palette,
    title: 'Diseño personalizado a tu identidad de marca',
    description: 'Tu logo, tus colores y tu tipografía sobre la tarjeta física. Tú la apruebas antes de que se produzca nada.',
    benefit: 'Tu marca, no una plantilla genérica',
    building: 'Se aplica tu identidad',
  },
  {
    n: '02',
    icon: Link2,
    title: 'Conexión con tu propia página de contacto',
    description: 'Creamos tu página de contacto y programamos el chip NFC para que apunte a ella. Tarjeta y página quedan vinculadas.',
    benefit: 'Tu propia página, no un perfil de terceros',
    building: 'Tarjeta y página vinculadas',
  },
  {
    n: '03',
    icon: Nfc,
    title: 'Acércala para compartir',
    description: 'Acercas la tarjeta a cualquier celular y tu página de contacto se abre al instante. Sin apps y sin escanear códigos.',
    benefit: 'Compartes en 1 segundo, no en 1 minuto',
    building: 'Tu página se abre en su celular',
  },
  {
    n: '04',
    icon: SlidersHorizontal,
    title: 'Personaliza cualquier elemento de tu página',
    description: 'Cambias colores, botones, enlaces, redes y secciones cuando quieras. La tarjeta física nunca se reimprime.',
    benefit: 'Editas todo sin reimprimir nada',
    building: 'Se edita en vivo',
  },
];

/* Acentos que va probando la animacion de personalizacion del paso 04 */
const acentos = ['#CC66FF', '#22D3EE', '#F59E0B'];

const comparacionDe = (t: (k: string, r: string) => string) => [
  { impresa: t('f1_impresa', 'Dictas o tecleas tus datos'), nfc: t('f1_nfc', 'Un toque y queda guardado') },
  { impresa: t('f2_impresa', 'Los datos quedan congelados'), nfc: t('f2_nfc', 'La editas cuando quieras') },
  { impresa: t('f3_impresa', 'Reimprimes con cada cambio'), nfc: t('f3_nfc', 'Cero reimpresiones') },
  { impresa: t('f4_impresa', 'Termina en un cajón'), nfc: t('f4_nfc', 'Una impresión que se recuerda') },
];

const fichaDe = (t: (k: string, r: string) => string) => [
  { label: t('e1_label', 'Compartir'), value: t('e1_valor', 'Un toque') },
  { label: t('e2_label', 'Apps'), value: t('e2_valor', 'Ninguna') },
  { label: t('e3_label', 'Ediciones'), value: t('e3_valor', 'Ilimitadas') },
  { label: t('e4_label', 'Entrega'), value: t('e4_valor', '3–5 días') },
];

const publicoDe = (t: (k: string, r: string) => string) => [
  t('p1', 'Emprendedores y freelancers que hacen networking'),
  t('p2', 'Equipos comerciales que comparten contacto al vuelo'),
  t('p3', 'Consultores que actualizan su información seguido'),
  t('p4', 'Empresas que cuidan su imagen en cada interacción'),
  t('p5', 'Agentes inmobiliarios y asesores en ferias y eventos'),
];

const preguntasDe = (t: (k: string, r: string) => string) => [
  { q: t('q1', '¿Necesito instalar una aplicación para usarla?'), a: t('r1', 'No. Funciona con la tecnología NFC que ya traen los smartphones modernos, tanto Android como iPhone desde el modelo 7. Solo acercas la tarjeta.') },
  { q: t('q2', '¿Qué pasa si cambio de número o de trabajo?'), a: t('r2', 'Actualizas tu perfil digital en línea y el cambio se refleja al instante en tu tarjeta, sin reimprimir nada.') },
  { q: t('q3', '¿Qué información puedo compartir?'), a: t('r3', 'Contacto, redes sociales, sitio web, portafolio, ubicación y hasta un video de presentación, todo desde un solo toque.') },
  { q: t('q4', '¿Cuánto tarda la entrega?'), a: t('r4', 'El diseño y la programación toman entre 3 y 5 días hábiles después de aprobar el diseño de tu tarjeta.') },
  { q: t('q5', '¿Puedo pedir tarjetas para todo mi equipo?'), a: t('r5', 'Sí. Cotizamos desde una sola persona hasta equipos completos, con diseño unificado para toda la empresa y una página de contacto propia para cada integrante. Nos adaptamos al tamaño de tu equipo.') },
];

/* Botones de la pagina de contacto que abre la tarjeta */
const accionesDe = (t: (k: string, r: string) => string) => [
  { icon: Phone, label: t('a1', 'Guardar contacto'), principal: true },
  { icon: MessageCircle, label: t('a2', 'WhatsApp') },
  { icon: Globe, label: t('a3', 'tuempresa.com') },
  { icon: Instagram, label: t('a4', '@tumarca') },
];

/* ------------------------------------------------------------------ */
/* Tarjeta que se ARMA por pasos. step -1 = lienzo en blanco.          */
/* ------------------------------------------------------------------ */
function BuildingCard({ step, compact = false }: { step: number; compact?: boolean }) {
  const tTel = contenido('tarjetas-de-presentacion-digital', 'telefono');
  const size = compact ? 'w-52 h-32 p-4' : 'w-[19rem] h-[11.5rem] sm:w-[21rem] sm:h-[12.5rem] p-6';

  return (
    <div className={`relative rounded-2xl overflow-hidden ${size}`}>
      {/* Lienzo vacio: se ve antes de que entre la marca */}
      <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02]" />

      {/* Paso 01: entra la identidad y pinta la tarjeta */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#5500AA] via-[#7700CE] to-[#9933FF] shadow-[0_25px_70px_rgba(119,0,206,0.45)] transition-[opacity,transform] duration-700 ease-out"
        style={{ opacity: step >= 0 ? 1 : 0, transform: step >= 0 ? 'scale(1)' : 'scale(0.94)' }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 45%, rgba(204,102,255,0.5) 55%, transparent 70%)',
          mixBlendMode: 'overlay',
        }}
        animate={{ x: ['-120%', '120%'] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
        animate={{ opacity: step >= 0 ? 0.2 : 0 }}
        transition={{ duration: 0.6 }}
      />

      <div className={`relative h-full flex flex-col justify-between ${compact ? '' : ''}`}>
        <div className="flex items-start justify-between">
          {/* Modulo del chip: aparece en el paso 02 */}
          <div
            className={`rounded-lg bg-gradient-to-br from-white/60 to-white/25 border border-white/25 transition-[opacity,transform] duration-500 ease-out ${compact ? 'w-7 h-5' : 'w-10 h-7'}`}
            style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'scale(1)' : 'scale(0.4)' }}
          />
          <div
            className="transition-[opacity,transform] duration-500 ease-out"
            style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'scale(1)' : 'scale(0.4)' }}
          >
            <motion.span className="block" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              <Nfc className="text-white" size={compact ? 18 : 28} />
            </motion.span>
          </div>
        </div>

        {/* Nombre: entra con el diseño, paso 01 */}
        <div
          className="transition-[opacity,transform] duration-500 ease-out"
          style={{ opacity: step >= 0 ? 1 : 0, transform: step >= 0 ? 'translateY(0)' : 'translateY(10px)' }}
        >
          <div className={`heading text-white tracking-wide ${compact ? 'text-sm' : 'text-xl mb-1'}`}>{tTel('nombre', 'TU NOMBRE')}</div>
          <div className={`text-white/65 uppercase tracking-[0.22em] ${compact ? 'text-[8px]' : 'text-[10px]'}`}>{tTel('puesto', 'Tu puesto · Tu empresa')}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Telefono que recibe el perfil                                       */
/* ------------------------------------------------------------------ */
function PhoneScreen({
  filled,
  cycle,
  customizing = false,
  accent = '#CC66FF',
}: {
  filled: boolean;
  cycle: number;
  customizing?: boolean;
  accent?: string;
}) {
  const tTel = contenido('tarjetas-de-presentacion-digital', 'telefono');
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-white/15" />
      <div className="pt-8 px-3.5">
        {!filled ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5 pt-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-2 rounded-full bg-white/[0.06]" style={{ width: `${80 - i * 18}%` }} />
            ))}
          </motion.div>
        ) : (
          <motion.div key={`p-${cycle}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {/* Cabecera de la pagina: el color sigue al acento elegido */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 220, damping: 16 }}
              className="w-11 h-11 mx-auto mb-2"
            >
              <div
                className="w-full h-full rounded-full transition-[background] duration-500"
                style={{ background: `linear-gradient(135deg, ${accent}, #7700CE)` }}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="text-center mb-3">
              <div className="heading text-white text-[11px]">{tTel('nombre', 'TU NOMBRE')}</div>
              <div className="text-white/40 text-[8px] uppercase tracking-[0.18em]">{tTel('puesto', 'Tu puesto · Tu empresa')}</div>
            </motion.div>

            <div className="space-y-1.5">
              {accionesDe(tTel).map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="relative"
                >
                  {/* div plano, NO motion: motion aplica el style por su propio
                      bucle de animacion y el cambio de color no llegaba. Aqui la
                      transicion la hace CSS y el color siempre se aplica. */}
                  <div
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl border transition-colors duration-500"
                    style={
                      a.principal
                        ? { background: accent, borderColor: accent }
                        : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }
                    }
                  >
                    <a.icon
                      className="flex-shrink-0 transition-colors duration-500"
                      style={{ color: a.principal ? '#000' : accent }}
                      size={16}
                    />
                    <span className={`text-[8px] truncate ${a.principal ? 'text-black font-bold' : 'text-white/55'}`}>{a.label}</span>
                  </div>

                  {/* Marco de edicion: aparece en el paso de personalizacion */}
                  {customizing && (
                    <motion.span
                      className="absolute -inset-[3px] rounded-xl border border-dashed pointer-events-none"
                      style={{ borderColor: accent }}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Muestrario de color: hace evidente que se personaliza */}
            {customizing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10"
              >
                <Palette size={16} style={{ color: accent }} />
                <div className="flex gap-1">
                  {acentos.map((c) => (
                    <span
                      key={c}
                      className="w-2 h-2 rounded-full transition-[transform,opacity] duration-300"
                      style={{ background: c, transform: c === accent ? 'scale(1.5)' : 'scale(1)', opacity: c === accent ? 1 : 0.4 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ZONA 1 — Escenario en LOOP automatico                               */
/* ------------------------------------------------------------------ */
function TapStage() {
  const [cycle, setCycle] = useState(0);
  const [tapped, setTapped] = useState(false);

  /* Bucle continuo: no espera ninguna accion del usuario. */
  useEffect(() => {
    let vivo = true;
    let timer: ReturnType<typeof setTimeout>;

    const encender = () => {
      if (!vivo) return;
      setCycle((c) => c + 1);
      setTapped(true);
      timer = setTimeout(apagar, 4200);
    };
    const apagar = () => {
      if (!vivo) return;
      setTapped(false);
      timer = setTimeout(encender, 1400);
    };

    timer = setTimeout(encender, 800);
    return () => { vivo = false; clearTimeout(timer); };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative flex items-center justify-center gap-4 sm:gap-10 h-[22rem] sm:h-[26rem]">
        <motion.div
          key={`card-${cycle}`}
          className="relative z-10"
          initial={{ x: 0, rotate: -8 }}
          animate={tapped ? { x: [0, 46, 0], rotate: [-8, -2, -8] } : { x: 0, rotate: -8 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        >
          <BuildingCard step={3} compact />
          {tapped &&
            [0, 0.25, 0.5].map((d) => (
              <motion.span
                key={`${cycle}-${d}`}
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
          <PhoneScreen filled={tapped} cycle={cycle} />
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ZONA 2 — Recorrido: la tarjeta se arma con el scroll                */
/* ------------------------------------------------------------------ */
function StickyJourney() {
  const tArm = contenido('tarjetas-de-presentacion-digital', 'armado');
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
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

  /* Paso 04: el acento va cambiando solo, en bucle, para que se vea que la
     pagina se personaliza sin que el usuario tenga que hacer nada. */
  const [acento, setAcento] = useState(0);
  useEffect(() => {
    if (active !== 3) return;
    const t = setInterval(() => setAcento((a) => (a + 1) % acentos.length), 1800);
    return () => clearInterval(t);
  }, [active]);
  const accent = active === 3 ? acentos[acento] : acentos[0];

  return (
    <>
      <div ref={ref} className="hidden lg:block relative" style={{ height: `${steps.length * 95}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 w-full">
            {/* Encabezado fijo: explica que esto es un proceso */}
            <div className="text-center mb-10">
              <div className="text-[#CC66FF] text-[11px] tracking-[0.3em] uppercase mb-2">{tArm('etiqueta', 'Así se arma tu tarjeta')}</div>
              <div className="text-white/30 text-xs">Paso {active + 1} de {steps.length}</div>
            </div>

            <div className="grid grid-cols-[auto_1fr_1fr] gap-10 xl:gap-16 items-center">
              {/* Riel de progreso */}
              <div className="relative h-64 w-px bg-white/10 self-center">
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
                          ? { backgroundColor: '#CC66FF', borderColor: '#CC66FF', scale: i === active ? 1.2 : 1 }
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

              {/* Texto */}
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
                  <p className="text-white/50 text-lg leading-relaxed max-w-md mb-6">{Current.description}</p>

                  {/* El beneficio, explicito en cada paso */}
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#9933FF]/10 border border-[#9933FF]/30">
                    <Check className="text-[#CC66FF] flex-shrink-0" size={16} strokeWidth={3} />
                    <span className="text-[#CC66FF] text-sm">{Current.benefit}</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: started ? 0 : 1, y: started ? 8 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-2.5 mt-8 text-white/30"
                >
                  <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                    <ArrowDown size={16} />
                  </motion.span>
                  <span className="text-[11px] tracking-[0.25em] uppercase">{tArm('scroll', 'Sigue bajando para armarla')}</span>
                </motion.div>
              </div>

              {/* Visual: la tarjeta se va armando, acumulativo */}
              <div className="relative flex items-center justify-center h-[24rem]">
                <div
                  className="transition-transform duration-700"
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    transform: `translateX(${active >= 2 ? -50 : 0}px) rotate(${active === 2 ? 2 : -8}deg)`,
                  }}
                >
                  <BuildingCard step={active} />
                </div>

                {/* Paso 02: el vinculo entre la tarjeta y la pagina */}
                {active === 1 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 flex flex-col items-center gap-2"
                    >
                      <div className="w-24 h-40 rounded-2xl border border-white/15 bg-[#0B0910] p-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#CC66FF] to-[#7700CE] mx-auto mb-1.5" />
                        <div className="h-1 w-12 rounded-full bg-white/20 mx-auto mb-2.5" />
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-3 rounded-md bg-white/[0.06] mb-1" />
                        ))}
                      </div>
                      <span className="text-white/35 text-[9px] tracking-[0.15em] uppercase">{tArm('tu_pagina', 'Tu página')}</span>
                    </motion.div>

                    {/* Cable animado tarjeta -> pagina */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                      <motion.line
                        x1="52%" y1="50%" x2="76%" y2="50%"
                        stroke="#CC66FF" strokeWidth="2" strokeDasharray="6 6"
                        animate={{ strokeDashoffset: [0, -24] }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0B0910] border border-[#CC66FF]/50 flex items-center justify-center"
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Link2 className="text-[#CC66FF]" size={16} />
                    </motion.div>
                  </>
                )}

                {/* Pasos 03 y 04: el celular abre tu pagina de contacto */}
                {active >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 70, rotate: 6 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 w-36 h-64 rounded-3xl border border-white/15 bg-[#0B0910] overflow-hidden shadow-[0_0_45px_rgba(153,51,255,0.35)]"
                  >
                    <PhoneScreen filled cycle={active} customizing={active === 3} accent={accent} />
                  </motion.div>
                )}

                {/* Paso 03: ondas del toque */}
                {active === 2 &&
                  [0, 0.35].map((d) => (
                    <motion.span
                      key={`tap-${d}`}
                      className="absolute right-24 rounded-full border border-[#CC66FF]/50 pointer-events-none"
                      style={{ width: 70, height: 70 }}
                      animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: d, ease: 'easeOut' }}
                    />
                  ))}

                {/* Paso 04: cursor que edita */}
                {active === 3 && (
                  <motion.div
                    className="absolute right-8 bottom-6 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border"
                    style={{ borderColor: accent, background: '#0B0910' }}
                    animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <MousePointer2 size={16} style={{ color: accent }} />
                    <span className="text-[9px] text-white/60">{tArm('editando', 'Editando')}</span>
                  </motion.div>
                )}

                {/* Rotulo de lo que acaba de pasar */}
                <motion.div
                  key={`build-${active}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-12 flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 whitespace-nowrap"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CC66FF]" />
                  <span className="text-white/50 text-[11px] tracking-[0.15em] uppercase">{Current.building}</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movil: los mismos pasos, apilados */}
      <div className="lg:hidden px-4 py-16">
        <div className="text-center mb-8">
          <div className="text-[#CC66FF] text-[11px] tracking-[0.3em] uppercase mb-2">{tArm('etiqueta', 'Así se arma tu tarjeta')}</div>
        </div>
        <div className="space-y-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="border-l-2 border-[#9933FF]/30 pl-5 py-1"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <span className="heading text-2xl text-white/15">{s.n}</span>
                <s.icon className="text-[#9933FF]" size={18} />
              </div>
              <h3 className="heading text-lg text-white mb-1.5">{s.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed mb-3">{s.description}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#9933FF]/10 border border-[#9933FF]/30">
                <Check className="text-[#CC66FF] flex-shrink-0" size={16} strokeWidth={3} />
                <span className="text-[#CC66FF] text-xs">{s.benefit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ZONA 3 — Beneficios sobre BLANCO                                    */
/* ------------------------------------------------------------------ */
function Comparison({ t }: { t: (k: string, r: string) => string }) {
  const comparison = comparacionDe(t);
  return (
    <section className="px-4 py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="text-[#7700CE] text-[11px] tracking-[0.3em] uppercase mb-4">{t('etiqueta', 'Beneficios')}</div>
          <h2 className="heading text-2xl md:text-4xl text-black leading-tight">
            {t('titulo_1', 'Lo mismo que hacías,')} <span className="text-[#7700CE]">{t('titulo_2', 'sin la parte molesta')}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Tarjeta impresa: apagada */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-7"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-2xl border border-gray-200 bg-white flex items-center justify-center">
                <CreditCard className="text-gray-400" size={20} />
              </div>
              <div>
                <div className="heading text-base text-gray-500">{t('col_1', 'Tarjeta impresa')}</div>
                <div className="text-gray-400 text-xs">{t('col_1_sub', 'Como siempre')}</div>
              </div>
            </div>
            <div className="space-y-4">
              {comparison.map((row, i) => (
                <motion.div
                  key={row.impresa}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <X className="text-gray-300 flex-shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                  <span className="text-gray-500 text-sm leading-relaxed">{row.impresa}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tarjeta NFC: encendida */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] p-7 overflow-hidden shadow-[0_20px_60px_rgba(119,0,206,0.3)]"
          >
            <div className="relative flex items-center gap-3 mb-7">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center">
                <Nfc className="text-white" size={20} />
              </div>
              <div>
                <div className="heading text-base text-white">{t('col_2', 'Tarjeta NFC')}</div>
                <div className="text-white/70 text-xs">{t('col_2_sub', 'Con Inédito')}</div>
              </div>
            </div>
            <div className="relative space-y-4">
              {comparison.map((row, i) => (
                <motion.div
                  key={row.nfc}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 300, damping: 18 }}
                    className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <Check className="text-[#7700CE]" size={16} strokeWidth={3} />
                  </motion.span>
                  <span className="text-white text-sm leading-relaxed">{row.nfc}</span>
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
  const tPort = contenido('tarjetas-de-presentacion-digital', 'portada');
  const tEq   = contenido('tarjetas-de-presentacion-digital', 'equipos');
  const tCmp  = contenido('tarjetas-de-presentacion-digital', 'comparacion');
  const tFic  = contenido('tarjetas-de-presentacion-digital', 'ficha');
  const tPub  = contenido('tarjetas-de-presentacion-digital', 'publico');
  const tPre  = contenido('tarjetas-de-presentacion-digital', 'preguntas');
  const tCie  = contenido('tarjetas-de-presentacion-digital', 'cierre');
  const tArm  = contenido('tarjetas-de-presentacion-digital', 'armado');
  const cta = () => openAssistant(SERVICE_NAME, 'cotizar tarjetas de presentación digital NFC');
  const specs = fichaDe(tFic);
  const idealFor = publicoDe(tPub);
  const faqItems = preguntasDe(tPre);

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
              maskImage: 'radial-gradient(ellipse 75% 40% at 50% 15%, black, transparent)',
              WebkitMaskImage: 'radial-gradient(ellipse 75% 40% at 50% 15%, black, transparent)',
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

              <div className="max-w-3xl mx-auto text-center mt-10">
                <h1 className="heading text-white leading-[1.08] mb-5">
                  {tPort('titulo_1', 'TU TARJETA DE PRESENTACIÓN,')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9933FF] to-[#CC66FF]">{tPort('titulo_2', 'AHORA DIGITAL')}</span>
                </h1>
                <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                  {tPort('bajada', 'Comparte tu contacto, redes y portafolio con un solo toque. Sin imprimir, sin apps, siempre al día.')}
                </p>
                <button
                  onClick={cta}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.45)] cursor-pointer"
                >
                  <span className="heading text-sm tracking-[0.08em]">{tPort('boton', 'COTIZAR MI TARJETA')}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="flex flex-col items-center gap-3 mt-14"
              >
                <span className="text-white/30 text-[11px] tracking-[0.3em] uppercase">{tArm('desliza', 'Desliza para verla armarse desde cero')}</span>
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
        </div>
      </div>

      {/* ---------- ZONA 3 — BLANCO ---------- */}
      {tCmp.visible() && <Comparison t={tCmp} />}

      {/* ---------- ZONA 4 — Bento oscuro ---------- */}
      <section className="px-4 py-16 md:py-24 bg-[#07060B]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(9rem,auto)] gap-4">
            <Tile className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-5 p-8">
              <BuildingCard step={3} />
              <p className="text-white/45 text-sm max-w-xs leading-relaxed text-center">
                {tFic('texto_tarjeta', 'Acabado premium con chip NFC dentro. El diseño es tuyo; el contenido lo cambias cuando quieras.')}
              </p>
            </Tile>

            {specs.map((s, i) => (
              <Tile key={s.label} className="p-6 flex flex-col justify-center" delay={i * 0.06}>
                <div className="text-white/30 text-[10px] tracking-[0.22em] uppercase mb-1.5">{s.label}</div>
                <div className="heading text-2xl text-white">{s.value}</div>
              </Tile>
            ))}

            <Tile className="col-span-2 lg:col-span-4 p-7" delay={0.1}>
              <div className="text-white/30 text-[10px] tracking-[0.25em] uppercase mb-4">{tPub('titulo', 'Ideal para')}</div>
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

      {/* ---------- ZONA 4b — Una persona o equipo completo ---------- */}
      {tEq.visible() && (
      <section className="px-4 pb-16 md:pb-24 bg-[#07060B]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <div className="text-[#CC66FF] text-[11px] tracking-[0.3em] uppercase mb-3">{tArm('cotiza', 'Cómo se cotiza')}</div>
            <h2 className="heading text-2xl md:text-4xl text-white leading-tight">
              {tEq('titulo_1', 'Para una persona o para')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9933FF] to-[#CC66FF]">{tEq('titulo_2', 'todo tu equipo')}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {[
              {
                icon: User,
                titulo: 'Una persona',
                sub: 'Tu tarjeta, tu página',
                puntos: [
                  'Tu tarjeta con tu identidad de marca',
                  'Tu propia página de contacto editable',
                  'Ideal para freelancers, consultores y vendedores',
                ],
              },
              {
                icon: Users,
                titulo: 'Equipos completos',
                sub: 'Una por cada integrante',
                puntos: [
                  'Una tarjeta y una página por persona',
                  'Diseño unificado para toda la empresa',
                  'Das de alta o cambias integrantes cuando quieras',
                ],
              },
            ].map((op, i) => (
              <motion.div
                key={op.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#9933FF]/40 transition-colors p-7"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] flex items-center justify-center shadow-[0_0_25px_rgba(119,0,206,0.35)]">
                    <op.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="heading text-lg text-white">{op.titulo}</div>
                    <div className="text-white/35 text-xs">{op.sub}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {op.puntos.map((p) => (
                    <div key={p} className="flex items-start gap-2.5">
                      <Check className="text-[#CC66FF] flex-shrink-0 mt-0.5" size={16} strokeWidth={3} />
                      <span className="text-white/55 text-sm leading-relaxed">{p}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 rounded-2xl border border-[#9933FF]/30 bg-[#9933FF]/[0.07] p-6 md:p-7 text-center"
          >
            <p className="text-white/70 text-sm md:text-base mb-5 max-w-2xl mx-auto leading-relaxed">
              {tEq('nota', '¿Son 3 personas? ¿Son 80? Nos adaptamos. Dinos cuántas son y armamos la cotización a la medida de tu equipo.')}
            </p>
            <button
              onClick={cta}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] hover:from-[#9933FF] hover:to-[#7700CE] text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(119,0,206,0.45)] cursor-pointer"
            >
              <span className="heading text-sm tracking-[0.08em]">{tEq('boton', 'COTIZAR PARA MI EQUIPO')}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
      )}

      {/* ---------- ZONA 5 — Cierre sobre BLANCO ---------- */}
      <section className="px-4 py-16 md:py-24 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
            <div>
              <div className="text-[#7700CE] text-[11px] tracking-[0.25em] uppercase mb-5">{tPre('titulo', 'Preguntas frecuentes')}</div>
              <FAQAccordion items={faqItems} />
            </div>

            <div className="relative rounded-2xl bg-gradient-to-br from-[#7700CE] to-[#9933FF] overflow-hidden lg:sticky lg:top-28 shadow-[0_20px_60px_rgba(119,0,206,0.3)]">
              <div className="relative z-10 p-8">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex mb-5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/25 flex items-center justify-center">
                    <Nfc className="text-white" size={28} />
                  </div>
                </motion.div>
                <h2 className="heading text-xl md:text-2xl mb-3 text-white leading-tight">{tCie('titulo', '¿Listo para modernizar tu tarjeta?')}</h2>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  {tCie('texto', 'Cotiza tu tarjeta NFC y empieza a compartir tu contacto con un solo toque.')}
                </p>
                <button
                  onClick={cta}
                  className="group w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-white text-[#7700CE] hover:bg-white/90 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span className="heading text-sm tracking-[0.08em]">{tCie('boton', 'COTIZAR AHORA')}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
