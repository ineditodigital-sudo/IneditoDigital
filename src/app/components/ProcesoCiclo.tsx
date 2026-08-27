import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ScanSearch, SlidersHorizontal, Target } from 'lucide-react';

/*
 * El ciclo de trabajo, contado en una escena que se explica sola.
 *
 * Es la misma idea de las escenas de las fichas de servicio, pero para la
 * portada: cuatro pasos —objetivos, conectar, auditar, ajustar— y una escena
 * que avanza sola mientras está a la vista. Tocar un paso la lleva ahí y
 * pausa el avance un momento.
 *
 * Va en su propio chunk (la portada lo importa con lazy) y no arranca ningún
 * temporizador hasta estar en pantalla: el índice no paga nada por tenerla.
 */

const suave = [0.22, 1, 0.36, 1] as const;

/** Una pieza que entra cuando el paso `n` está activo. */
const pieza = (activo: number, n: number, delay = 0) => ({
  initial: { opacity: 0, y: 10, scale: 0.97 },
  animate: activo >= n ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.97 },
  transition: { duration: 0.45, delay: activo >= n ? delay : 0, ease: suave },
});

const FUENTES = ['Search Console', 'Analytics', 'Campañas', 'ERP / ventas'];

/* Las barras del panel. En el paso de ajuste el presupuesto se reacomoda:
   una baja y las de la derecha suben. Ese movimiento ES el mensaje. */
const BARRAS = [40, 55, 48, 66, 78, 62];
const BARRAS_AJUSTADAS = [40, 55, 30, 66, 92, 88];

function Escena({ activo }: { activo: number }) {
  const barras = activo >= 3 ? BARRAS_AJUSTADAS : BARRAS;
  return (
    <div className="absolute inset-0 flex flex-col p-5 sm:p-7">
      {/* paso 1: el objetivo que pone dirección */}
      <motion.div
        {...pieza(activo, 0)}
        className="self-start rounded-xl border border-[#CC66FF]/35 px-3.5 py-2.5"
        style={{ background: 'linear-gradient(120deg, rgba(119,0,206,.30), rgba(119,0,206,.08))' }}
      >
        <div className="flex items-center gap-1.5">
          <Target size={11} className="text-[#CC66FF]" />
          <span className="font-mono text-[8.5px] uppercase tracking-[.16em] text-[#CC66FF]">
            Objetivo · Dirección
          </span>
        </div>
        <div className="mt-1 text-[12.5px] font-semibold text-white/90">+20% de ventas este año</div>
      </motion.div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-3 sm:gap-4">
        {/* paso 2: las fuentes */}
        <div className="space-y-1.5">
          {FUENTES.map((f, i) => (
            <motion.div
              key={f}
              {...pieza(activo, 1, i * 0.08)}
              className="rounded-lg border border-white/12 bg-white/[.05] px-2.5 py-1.5 text-[9px] text-white/60"
            >
              {f}
            </motion.div>
          ))}
        </div>

        {/* los cables hacia el tablero */}
        <svg width="38" height="104" className="shrink-0 overflow-visible">
          {FUENTES.map((_, i) => (
            <motion.path
              key={i}
              d={`M0,${13 + i * 26} C20,${13 + i * 26} 20,52 38,52`}
              fill="none"
              stroke="#9933FF"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={activo >= 1 ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: suave }}
            />
          ))}
        </svg>

        {/* paso 3: el tablero que la IA revisa */}
        <motion.div {...pieza(activo, 1, 0.3)} className="relative w-40 rounded-xl border border-white/12 bg-white/[.05] p-3 sm:w-44">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[.14em] text-white/40">Tablero</span>
            <motion.span
              {...pieza(activo, 2)}
              className="flex items-center gap-1 rounded-full bg-[#CC66FF]/15 px-1.5 py-0.5"
            >
              <ScanSearch size={9} className="text-[#CC66FF]" />
              <span className="font-mono text-[7.5px] uppercase tracking-[.12em] text-[#CC66FF]">IA audita</span>
            </motion.span>
          </div>
          <div className="flex h-12 items-end gap-1">
            {barras.map((a, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#7700CE] to-[#CC66FF]"
                initial={{ height: 0 }}
                animate={activo >= 2 ? { height: `${a}%` } : { height: 0 }}
                transition={{ duration: 0.5, delay: activo >= 3 ? 0.1 : 0.15 + i * 0.06, ease: suave }}
              />
            ))}
          </div>
          {/* la línea de barrido de la revisión */}
          <motion.div
            className="pointer-events-none absolute inset-x-2 top-8 h-px bg-gradient-to-r from-transparent via-[#CC66FF] to-transparent"
            animate={activo === 2 ? { opacity: [0, 0.9, 0], y: [0, 26, 0] } : { opacity: 0 }}
            transition={activo === 2 ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
          />
        </motion.div>
      </div>

      {/* paso 4: el ajuste que sale de la revisión */}
      <motion.div
        {...pieza(activo, 3)}
        className="flex items-center gap-2 self-start rounded-full border border-white/12 bg-white/[.06] px-3 py-1.5"
      >
        <SlidersHorizontal size={11} className="text-[#CC66FF]" />
        <span className="text-[10px] text-white/75">Presupuesto movido a lo que sí convierte</span>
      </motion.div>

      {/* el distintivo, como en las escenas de servicios */}
      <motion.div
        {...pieza(activo, 3, 0.15)}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#CC66FF]/40 bg-[#CC66FF]/15 px-3 py-1.5 backdrop-blur"
      >
        <Check size={12} className="text-[#CC66FF]" strokeWidth={3} />
        <span className="font-mono text-[9.5px] uppercase tracking-[.14em] text-[#CC66FF]">Medido contra ventas</span>
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
      {/* la escena */}
      <div className="relative overflow-hidden rounded-3xl border border-black/10 shadow-xl">
        <div
          className="relative aspect-[4/3]"
          style={{ background: 'radial-gradient(90% 90% at 30% 0%, #1C0629 0%, #0D0010 60%)' }}
        >
          <Escena activo={activo} />
        </div>
        {/* el progreso de los cuatro pasos */}
        <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/30 p-2">
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
                  : 'border-gray-200 bg-white/80 hover:border-[#7700CE]/25'
              }`}
            >
              <div
                className={`heading mb-3 text-3xl md:text-4xl ${este ? 'bg-clip-text text-transparent' : 'text-gray-300'}`}
                style={este ? { backgroundImage: 'linear-gradient(120deg,#7700CE,#CC66FF)' } : undefined}
              >
                {p.step}
              </div>
              <h3 className="heading mb-2 text-lg text-black md:text-xl">{p.title}</h3>
              <p className="text-xs text-gray-600 md:text-sm">{p.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
