import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Check, ScanSearch, SlidersHorizontal, Target } from 'lucide-react';

/*
 * El ciclo de trabajo contado dentro de una pantalla.
 *
 * Versión 2, pedida así: en lugar de un lienzo abstracto, un monitor donde el
 * tablero del cliente se arma paso a paso, y un teléfono que recibe el aviso.
 * Cuatro pasos —objetivos, conectar, auditar, ajustar—, avance automático
 * mientras está a la vista y cada paso tocable.
 *
 * Va en su propio chunk (la portada lo importa con lazy) y no arranca ningún
 * temporizador hasta estar en pantalla: el índice no paga nada por tenerla.
 * Sin nombres de herramientas a propósito: el sistema se ve, no se enumera.
 */

const suave = [0.22, 1, 0.36, 1] as const;

/** Una pieza que entra cuando el paso `n` está activo. */
const pieza = (activo: number, n: number, delay = 0) => ({
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: activo >= n ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.97 },
  transition: { duration: 0.45, delay: activo >= n ? delay : 0, ease: suave },
});

const KPIS = [
  { rotulo: 'Contactos', valor: '330' },
  { rotulo: 'Costo por contacto', valor: '$143' },
  { rotulo: 'Ventas', valor: '39' },
  { rotulo: 'Retorno', valor: '3.2x' },
];

/* En el paso de ajuste el presupuesto se reacomoda: una barra baja y las de
   la derecha suben. Ese movimiento ES el mensaje. */
const BARRAS = [42, 56, 50, 66, 78, 62];
const BARRAS_AJUSTADAS = [42, 56, 30, 66, 92, 88];

/** La pantalla del monitor: el tablero armándose por pasos. */
function PantallaTablero({ activo }: { activo: number }) {
  const barras = activo >= 3 ? BARRAS_AJUSTADAS : BARRAS;
  return (
    <div className="relative flex h-full flex-col gap-2.5 bg-[#F3F4F9] p-3.5 sm:p-4">
      {/* paso 1: el objetivo que pone dirección */}
      <div className="flex items-center justify-between gap-2">
        <motion.div
          {...pieza(activo, 0)}
          className="flex items-center gap-2 rounded-lg border border-[#7700CE]/25 bg-white px-2.5 py-1.5 shadow-sm"
        >
          <Target size={11} className="shrink-0 text-[#7700CE]" />
          <span className="text-[9.5px] font-semibold text-slate-800 sm:text-[10.5px]">
            Objetivo de dirección: +20% de ventas
          </span>
        </motion.div>
        {/* paso 3: la IA revisando */}
        <motion.div
          {...pieza(activo, 2)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#7700CE]/10 px-2 py-1"
        >
          <ScanSearch size={10} className="text-[#7700CE]" />
          <span className="font-mono text-[7.5px] uppercase tracking-[.14em] text-[#7700CE]">IA auditando</span>
        </motion.div>
      </div>

      {/* paso 2: los indicadores se conectan */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {KPIS.map((k, i) => (
          <motion.div key={k.rotulo} {...pieza(activo, 1, i * 0.09)} className="rounded-lg bg-white p-1.5 shadow-sm sm:p-2">
            <div className="truncate text-[7px] font-medium uppercase tracking-wide text-slate-400 sm:text-[7.5px]">
              {k.rotulo}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-slate-900 sm:text-[13px]">
              {k.valor}
              {/* paso 3: la palomita de la revisión */}
              {i === 3 && (
                <motion.span {...pieza(activo, 2, 0.25)} className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500">
                  <Check size={7} strokeWidth={4} className="text-white" />
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* paso 2: la curva se dibuja; paso 4: las barras se reacomodan */}
      <motion.div {...pieza(activo, 1, 0.25)} className="relative flex-1 rounded-lg bg-white p-2 shadow-sm">
        <svg viewBox="0 0 200 54" preserveAspectRatio="none" className="absolute inset-x-2 top-2 h-[46%] w-[calc(100%-1rem)]">
          <motion.path
            d="M2,46 C30,44 44,36 66,34 C92,31 108,22 132,18 C158,13 178,10 198,6"
            fill="none"
            stroke="#7700CE"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={activo >= 1 ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: suave }}
          />
        </svg>
        <div className="absolute inset-x-2 bottom-2 flex h-[38%] items-end gap-1">
          {barras.map((a, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-[#7700CE] to-[#CC66FF]"
              initial={{ height: 0 }}
              animate={activo >= 1 ? { height: `${a}%` } : { height: 0 }}
              transition={{ duration: 0.5, delay: activo >= 3 ? 0.1 : 0.35 + i * 0.05, ease: suave }}
            />
          ))}
        </div>
        {/* la línea de barrido de la auditoría */}
        <motion.div
          className="pointer-events-none absolute inset-x-1 top-3 h-px bg-gradient-to-r from-transparent via-[#7700CE] to-transparent"
          animate={activo === 2 ? { opacity: [0, 0.85, 0], y: [0, 58, 0] } : { opacity: 0 }}
          transition={activo === 2 ? { duration: 2.1, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
        />
      </motion.div>

      {/* paso 4: el ajuste que sale de la revisión */}
      <motion.div
        {...pieza(activo, 3)}
        className="flex items-center gap-1.5 self-start rounded-full border border-[#7700CE]/25 bg-white px-2.5 py-1 shadow-sm"
      >
        <SlidersHorizontal size={10} className="text-[#7700CE]" />
        <span className="text-[8.5px] font-medium text-slate-700 sm:text-[9.5px]">
          Presupuesto movido a lo que sí convierte
        </span>
      </motion.div>
    </div>
  );
}

export default function ProcesoCiclo({
  pasos,
}: {
  pasos: { step: string; title: string; description: string }[];
}) {
  const [activo, setActivo] = useState(0);
  const [enVista, setEnVista] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  /* Tocar un paso manda sobre el avance automático durante unos segundos. */
  const manualHasta = useRef(0);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const ojo = new IntersectionObserver(
      (es) => setEnVista(es.some((e) => e.isIntersecting)),
      { threshold: 0.3 }
    );
    ojo.observe(el);
    return () => ojo.disconnect();
  }, []);

  useEffect(() => {
    if (!enVista) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActivo(3);
      return;
    }
    const t = window.setInterval(() => {
      if (Date.now() < manualHasta.current) return;
      setActivo((a) => (a + 1) % 4);
    }, 2800);
    return () => window.clearInterval(t);
  }, [enVista]);

  const elegir = (i: number) => {
    manualHasta.current = Date.now() + 9000;
    setActivo(i);
  };

  return (
    <div ref={raiz} className="grid items-center gap-8 lg:grid-cols-2 md:gap-12">
      {/* el monitor, con el teléfono recibiendo el aviso */}
      <div className="relative pb-10 pr-4 sm:pr-10">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16101d] shadow-2xl">
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
            <span className="ml-3 flex-1 truncate rounded-md bg-white/[.06] px-3 py-1 text-center font-mono text-[9.5px] tracking-wide text-white/45">
              inedito.digital · tu tablero
            </span>
          </div>
          <div className="aspect-[16/10]">
            <PantallaTablero activo={activo} />
          </div>
          {/* el progreso de los cuatro pasos */}
          <div className="flex gap-1 bg-[#16101d] p-2">
            {pasos.map((p, i) => (
              <span key={p.step} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/15">
                <motion.span
                  className="block h-full rounded-full bg-[#CC66FF]"
                  animate={{ width: activo >= i ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: suave }}
                />
              </span>
            ))}
          </div>
        </div>

        {/* el teléfono: el aviso de la auditoría llega a dirección */}
        <motion.div
          {...pieza(activo, 2, 0.2)}
          className="absolute -bottom-2 right-0 w-[34%] max-w-[170px] sm:w-[32%]"
        >
          <div className="overflow-hidden rounded-[1.4rem] border-[5px] border-[#16101d] bg-[#16101d] shadow-2xl ring-1 ring-white/10">
            <div className="relative">
              <span className="absolute left-1/2 top-1.5 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-black/70" />
              <img
                src="/tablero-movil.webp"
                alt="El tablero en un teléfono"
                width={390}
                height={800}
                loading="lazy"
                decoding="async"
                className="block w-full rounded-[1.05rem]"
              />
              {/* la notificación del reporte */}
              <motion.div
                {...pieza(activo, 3, 0.15)}
                className="absolute inset-x-1.5 top-7 flex items-center gap-1.5 rounded-xl bg-white/95 px-2 py-1.5 shadow-lg"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-[#7700CE]">
                  <Bell size={10} className="text-white" />
                </span>
                <span className="text-[7.5px] font-semibold leading-tight text-slate-800">
                  Tu reporte del mes está listo
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* los pasos, tocables */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
        {pasos.map((p, i) => {
          const este = activo === i;
          return (
            <button
              key={p.step}
              onClick={() => elegir(i)}
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                este
                  ? 'border-[#7700CE]/50 bg-[#7700CE]/[.05] shadow-[0_10px_30px_-14px_rgba(119,0,206,.45)]'
                  : 'border-white/10 bg-white/[.04] hover:border-[#7700CE]/40'
              }`}
            >
              <div
                className={`heading mb-3 text-3xl md:text-4xl ${este ? 'bg-clip-text text-transparent' : 'text-white/15'}`}
                style={este ? { backgroundImage: 'linear-gradient(120deg,#7700CE,#CC66FF)' } : undefined}
              >
                {p.step}
              </div>
              <h3 className="heading mb-2 text-lg text-white md:text-xl">{p.title}</h3>
              <p className="text-xs text-white/65 md:text-sm">{p.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
