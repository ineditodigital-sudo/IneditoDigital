import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, MapPin, Star, TrendingUp, Zap } from 'lucide-react';

/*
 * Una escena por lámina. Ninguna se repite y ninguna es decorativa.
 *
 * La regla es la misma que en el sitio: si la animación no explica el servicio,
 * es adorno, y en una presentación de venta el adorno cuesta atención. La de
 * sitios web enseña una página armándose y midiendo su carga; la de publicidad
 * enseña presupuesto moviéndose de lo que no rinde a lo que sí; la de agentes
 * enseña la hora repetida en pregunta y respuesta.
 *
 * Dos reglas de la casa que esto respeta:
 *  - El TEXTO no se anima. Se lee completo desde el primer cuadro; lo que vive
 *    son las piezas alrededor.
 *  - Con prefers-reduced-motion cada escena se queda en su último paso, que es
 *    el que cuenta el resultado. Nadie pierde información por no ver el baile.
 *
 * Los colores salen de variables del tema, así que la misma escena funciona en
 * claro y en oscuro sin una segunda versión.
 */

const SAL = [0.23, 1, 0.32, 1] as const;   // el ease-out con pegada

/*
 * El idioma del deck.
 *
 * No usa el del sitio: el deck se manda por enlace y su interruptor no debe
 * remontar nada, asi que lleva el suyo y lo baja por contexto. Con d() cada
 * escena elige su version sin que haya que pasar una prop por diez firmas.
 */
const Lengua = createContext<'es' | 'en'>('es');
const useD = () => {
  const i = useContext(Lengua);
  return (es: string, en: string) => (i === 'en' ? en : es);
};

/** El paso de un ciclo, o el último si el sistema pide quietud. */
function usePaso(total: number, ms: number, activo: boolean) {
  const [paso, setPaso] = useState(0);
  useEffect(() => {
    if (!activo) return;
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    let t: ReturnType<typeof setInterval> | undefined;
    const aplicar = () => {
      clearInterval(t);
      if (mq.matches) return setPaso(total - 1);
      t = setInterval(() => setPaso((p) => (p + 1) % total), ms);
    };
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => {
      clearInterval(t);
      mq.removeEventListener('change', aplicar);
    };
  }, [total, ms, activo]);
  return paso;
}

function Marco({ children, etiqueta }: { children: React.ReactNode; etiqueta: string }) {
  return (
    <div
      role="img"
      aria-label={etiqueta}
      /* En movil la escena cede: 16/10 y tope de media pantalla, para que el
         nombre, la descripcion y las tres tarjetas quepan sin scroll. En
         pantalla grande recupera su proporcion y su aire. */
      className="relative aspect-[16/10] max-h-[25svh] w-full overflow-hidden rounded-3xl border p-3.5 sm:max-h-[34svh] sm:p-6 lg:aspect-[4/3] lg:max-h-none lg:p-8"
      style={{
        borderColor: 'var(--p-linea)',
        background: 'var(--p-caja)',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--p-punto) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black, transparent)',
        }}
      />
      {/*
        En telefono el contenido se ESCALA, no se recorta.
        La caja mide 16/10 con tope de 25svh, y las escenas se dibujaron para
        una de 4/3: sin esto la mitad de cada fila queda fuera del marco. Con
        122% de ancho y scale(.82) el resultado vuelve a medir justo el 100%
        —1.22 x 0.82 = 1— y el margen negativo lo recentra. Escalar es una
        transformacion: no vuelve a maquetar nada y se ve nitido.
      */}
      <div
        aria-hidden="true"
        className="relative -ml-[11%] flex h-full w-[122%] origin-center flex-col justify-center gap-2.5 [transform:scale(.82)] sm:-ml-[6%] sm:w-[112%] sm:[transform:scale(.893)] lg:ml-0 lg:w-full lg:gap-3 lg:[transform:none]"
      >
        {children}
      </div>
    </div>
  );
}

/*
 * La barra crece con transform, no con width.
 *
 * El truco es que el relleno mide siempre el 100% y se desliza desde fuera:
 * el contenedor recorta lo que sobra por la izquierda y le presta su propio
 * redondeo, así que se ve igual que animando el ancho —cap redondo incluido—
 * pero sin volver a maquetar en cada cuadro de los seiscientos y pico
 * milisegundos, que en una presentación a pantalla completa se nota.
 */
const Barra = ({ v, color, retraso = 0 }: { v: number; color: string; retraso?: number }) => (
  <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--p-pista)' }}>
    <div
      className="h-full w-full rounded-full"
      style={{
        background: color,
        transform: `translateX(${v - 100}%)`,
        transition: `transform 620ms cubic-bezier(${SAL.join(',')}) ${retraso}ms`,
      }}
    />
  </div>
);

/* ════════════════════════════════ 1 · Portada y cierre: la onda de la casa */

export function EscenaOnda({ activo }: { activo: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const lineas = 11;
  return (
    <div className="relative aspect-[4/3] w-full">
      <svg
        ref={ref}
        viewBox="0 0 400 300"
        className="h-full w-full overflow-visible"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        {Array.from({ length: lineas }).map((_, i) => {
          const y = 40 + i * 22;
          const amp = 14 + Math.sin(i * 0.8) * 8;
          const d = `M -20 ${y} C 80 ${y - amp}, 160 ${y + amp}, 240 ${y - amp * 0.6} S 380 ${y + amp * 0.5}, 420 ${y}`;
          return (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke="var(--p-onda)"
              strokeWidth={1.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={activo ? { pathLength: 1, opacity: 0.65 - i * 0.03 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.1, delay: i * 0.055, ease: SAL }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ════════════════════════════════ 2 · Auditoría: los hallazgos, priorizados */

/*
 * Los hallazgos aparecen de uno en uno con su severidad, y al final la lista
 * se ordena por impacto. Es literalmente lo que entrega el servicio: no una
 * lista de avisos, sino un plan con qué se hace primero.
 */
export function EscenaAuditoria({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(5, 1400, activo);
  const hallazgos = [
    { t: d('Carga en 6.2 s en teléfono', 'Loads in 6.2 s on mobile'), s: 'alta', p: 1 },
    { t: d('14 páginas fuera del índice', '14 pages outside the index'), s: 'alta', p: 2 },
    { t: d('Ficha sin categoría principal', 'Listing with no primary category'), s: 'media', p: 3 },
  ];
  const color = (s: string) => (s === 'alta' ? 'var(--p-ambar)' : 'var(--p-mudo)');

  return (
    <Marco
      etiqueta={d(
        'Tres hallazgos con su severidad, ordenados por impacto en un plan de trabajo',
        'Three findings with their severity, ordered by impact into a work plan',
      )}
    >
      <div className="space-y-2">
        {hallazgos.map((h, i) => (
          <motion.div
            key={h.t}
            className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
            style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja2)' }}
            animate={{
              opacity: paso > i ? 1 : 0.12,
              /* al llegar al último paso se numeran: el plan priorizado */
              x: paso >= 4 ? 6 : 0,
            }}
            transition={{ duration: 0.42, ease: SAL, delay: paso >= 4 ? i * 0.05 : 0 }}
          >
            <motion.span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: color(h.s) }}
              animate={{ scale: paso === i + 1 ? [1, 1.9, 1] : 1 }}
              transition={{ duration: 0.5, ease: SAL }}
            />
            <span className="flex-1 text-[11px] leading-tight md:text-[12.5px]" style={{ color: 'var(--p-tinta)' }}>
              {h.t}
            </span>
            <motion.span
              className="shrink-0 font-mono text-[10px] tabular-nums"
              style={{ color: 'var(--p-morado)' }}
              animate={{ opacity: paso >= 4 ? 1 : 0 }}
              transition={{ duration: 0.35, ease: SAL }}
            >
              #{h.p}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 text-center">
        <motion.div
          animate={{ opacity: paso >= 4 ? 1 : 0.2 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px]"
          style={{ borderColor: 'var(--p-morado)', color: 'var(--p-morado)' }}
        >
          <Check size={11} strokeWidth={3} />
          {d('Plan ordenado por impacto', 'Plan ordered by impact')}
        </motion.div>
      </div>
    </Marco>
  );
}

/* ════════════════════════════════ 3 · Web: la página se arma y se mide */

export function EscenaWeb({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(5, 700, activo);
  const bloques = [
    'h-6 w-2/5',
    'h-3 w-full',
    'h-3 w-4/5',
    'h-9 w-1/3 rounded-lg',
  ];
  return (
    <Marco etiqueta={d('Una página armándose bloque a bloque y su tiempo de carga', 'A page assembling block by block, and its load time')}>
      <div
        className="rounded-2xl border p-4"
        style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja2)' }}
      >
        <div className="mb-3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full" style={{ background: 'var(--p-pista)' }} />
          ))}
        </div>
        <div className="space-y-2.5">
          {bloques.map((b, i) => (
            <motion.div
              key={i}
              className={`${b} rounded`}
              style={{ background: i === 3 ? 'var(--p-morado)' : 'var(--p-pista)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={paso > i ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: SAL }}
            />
          ))}
        </div>
      </div>
      <motion.div
        animate={{ opacity: paso >= 4 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-3 flex items-center justify-center gap-2 text-[12px]"
        style={{ color: 'var(--p-verde)' }}
      >
        <Zap size={14} strokeWidth={2.6} />
        <span className="font-mono">0.9 s</span>
      </motion.div>
    </Marco>
  );
}

/* ════════════════════════════════ 4 · Posicionamiento: subir y ser citado */

export function EscenaPosicionamiento({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(2, 2600, activo);
  const arriba = paso === 1;
  const filas = [0, 1, 2, 3];
  return (
    <Marco etiqueta={d('Un resultado subiendo en la lista y una IA citando la marca', 'A result climbing the list and an AI quoting the brand')}>
      <div className="space-y-2">
        {filas.map((i) => {
          const tuyo = arriba ? i === 0 : i === 3;
          return (
            <motion.div
              key={i}
              layout
              transition={{ type: 'spring', stiffness: 210, damping: 26 }}
              style={{
                order: tuyo ? 0 : i + 1,
                borderColor: tuyo ? 'var(--p-morado)' : 'var(--p-linea)',
                background: tuyo ? 'var(--p-moradoSuave)' : 'var(--p-caja2)',
              }}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
            >
              <span
                className="font-mono text-[11px]"
                style={{ color: tuyo ? 'var(--p-morado)' : 'var(--p-mudo)' }}
              >
                #{tuyo ? 1 : i + 2}
              </span>
              <span className="h-2 flex-1 rounded" style={{ background: 'var(--p-pista)' }} />
              {tuyo && (
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--p-morado)' }}>
                  {d('Tú', 'You')}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      <motion.div
        animate={{ opacity: arriba ? 1 : 0.2, y: arriba ? 0 : 6 }}
        transition={{ duration: 0.5, ease: SAL }}
        className="mt-3 rounded-xl border px-3.5 py-2.5 text-[11.5px] leading-snug"
        style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja2)', color: 'var(--p-suave)' }}
      >
        <span className="mr-1.5 font-mono text-[10px]" style={{ color: 'var(--p-morado)' }}>IA</span>
        {d('…te recomiendo considerar Inédito Digital, en Aguascalientes.', '…I would consider Inédito Digital, in Aguascalientes.')}
      </motion.div>
    </Marco>
  );
}

/* ════════════════════════════════ 5 · Local: el mapa decide primero */

export function EscenaLocal({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(3, 1500, activo);
  return (
    <Marco etiqueta={d('El bloque de tres negocios en el mapa, por encima de los resultados normales', 'The three-business map block, above the normal results')}>
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja2)', height: '52%' }}
      >
        <svg viewBox="0 0 200 90" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          {[18, 40, 62].map((y) => (
            <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="var(--p-linea)" strokeWidth="1" />
          ))}
          {[45, 100, 155].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="90" stroke="var(--p-linea)" strokeWidth="1" />
          ))}
        </svg>
        {[
          { x: '26%', y: '30%', d: 0 },
          { x: '54%', y: '58%', d: 1 },
          { x: '76%', y: '26%', d: 2 },
        ].map((p, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: p.x, top: p.y }}
            initial={{ opacity: 0, y: -10, scale: 0.85 }}
            animate={paso >= p.d ? { opacity: 1, y: 0, scale: i === 0 ? 1.15 : 1 } : { opacity: 0, y: -10, scale: 0.85 }}
            transition={{ duration: 0.5, ease: SAL }}
          >
            <MapPin
              size={i === 0 ? 24 : 19}
              strokeWidth={2.4}
              style={{ color: i === 0 ? 'var(--p-morado)' : 'var(--p-mudo)' }}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.2, scale: 0.9 }}
            animate={paso >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0.2, scale: 0.9 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: SAL }}
          >
            <Star size={14} fill="var(--p-ambar)" style={{ color: 'var(--p-ambar)' }} />
          </motion.span>
        ))}
        <span className="ml-1 font-mono text-[11px]" style={{ color: 'var(--p-mudo)' }}>
          5.0 · 20
        </span>
      </div>
    </Marco>
  );
}

/* ════════════════════════════════ 6 · Publicidad: el dinero se mueve */

export function EscenaPublicidad({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(2, 2400, activo);
  const ok = paso === 1;
  const campanas = [
    { n: d('Búsqueda', 'Search'), a: 34, b: 54 },
    { n: 'Display', a: 44, b: 13 },
    { n: 'Video', a: 22, b: 33 },
  ];
  return (
    <Marco etiqueta={d('El presupuesto moviéndose de la campaña que no rinde a la que sí', 'Budget moving from the campaign that does not pay to the one that does')}>
      <div className="space-y-4">
        {campanas.map((c, i) => {
          const v = ok ? c.b : c.a;
          const cae = c.b < c.a;
          return (
            <div key={c.n}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[12.5px]" style={{ color: 'var(--p-suave)' }}>{c.n}</span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--p-mudo)' }}>{v}%</span>
              </div>
              <Barra
                v={v}
                retraso={i * 70}
                color={ok && cae ? 'var(--p-pistaFuerte)' : 'var(--p-morado)'}
              />
            </div>
          );
        })}
      </div>
      <motion.div
        animate={{ opacity: ok ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-3 flex items-center justify-center gap-1.5 text-[11px]"
        style={{ color: 'var(--p-verde)' }}
      >
        <TrendingUp size={13} strokeWidth={2.6} />
        {d('Costo por cliente −38%', 'Cost per customer −38%')}
      </motion.div>
    </Marco>
  );
}

/* ════════════════════════════════ 7 · Espectaculares: la ciudad se llena */

export function EscenaEspectaculares({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(2, 2800, activo);
  /* Puntos con posición estable: sembrados de una semilla fija para que la
     ciudad se vea igual en cada visita y no baile entre láminas. */
  const puntos = useRef(
    Array.from({ length: 48 }).map((_, i) => {
      const s = Math.sin(i * 12.9898) * 43758.5453;
      const t = Math.sin(i * 78.233) * 12345.6789;
      return {
        x: 8 + ((s - Math.floor(s)) * 84),
        y: 8 + ((t - Math.floor(t)) * 84),
        libre: i % 3 === 0,
      };
    }),
  ).current;

  return (
    <Marco etiqueta={d('Los espacios publicitarios repartidos por la ciudad', 'The advertising sites spread across the city')}>
      <div
        className="relative flex-1 overflow-hidden rounded-2xl border"
        style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja2)' }}
      >
        {puntos.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.libre ? 7 : 5,
              height: p.libre ? 7 : 5,
              background: p.libre ? 'var(--p-verde)' : 'var(--p-mudo)',
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={activo ? { opacity: p.libre ? 1 : 0.4, scale: 1 } : { opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.5, delay: Math.min(i * 0.018, 0.9), ease: SAL }}
          />
        ))}
        <motion.div
          className="absolute inset-x-0 bottom-0 px-3 py-2 text-center font-mono text-[11px]"
          style={{ color: 'var(--p-mudo)', background: 'var(--p-caja)' }}
          animate={{ opacity: paso >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          {d('317 espacios · 107 libres', '317 sites · 107 available')}
        </motion.div>
      </div>
    </Marco>
  );
}

/* ════════════════════════════════ 8 · Agentes: la hora repetida */

export function EscenaAgentes({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(4, 1300, activo);
  return (
    <Marco etiqueta={d('Una consulta a las 23:47 contestada al momento', 'An enquiry at 23:47, answered on the spot')}>
      <div className="mb-1 flex items-center gap-2 font-mono text-[11px]" style={{ color: 'var(--p-mudo)' }}>
        <Clock size={13} style={{ color: 'var(--p-morado)' }} />
        23:47
      </div>
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        className="max-w-[82%] self-start rounded-2xl rounded-bl-sm px-4 py-2.5 text-[13px]"
        style={{ background: 'var(--p-caja2)', color: 'var(--p-suave)' }}
      >
        {d('¿Todavía tienen disponible?', 'Do you still have it available?')}
      </motion.div>
      <motion.div
        animate={{ opacity: paso === 1 ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="flex gap-1 self-end pr-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--p-morado)' }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </motion.div>
      <motion.div
        animate={{ opacity: paso >= 2 ? 1 : 0, y: paso >= 2 ? 0 : 10 }}
        transition={{ duration: 0.45, ease: SAL }}
        className="max-w-[86%] self-end rounded-2xl rounded-br-sm px-4 py-2.5 text-[13px] text-white"
        style={{ background: 'linear-gradient(120deg,#7700CE,#9933FF)' }}
      >
        {d('Sí, quedan tres. ¿Te aparto uno?', 'Yes, three left. Shall I hold one?')}
      </motion.div>
      <motion.div
        animate={{ opacity: paso >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="mt-1 flex items-center justify-end gap-1.5 text-[11px]"
        style={{ color: 'var(--p-verde)' }}
      >
        <Check size={13} strokeWidth={3} />
        {d('4 segundos', '4 seconds')}
      </motion.div>
    </Marco>
  );
}

/* ════════════════════════════════ 9 · Ventas: la lista se ordena */

const PROSPECTOS = [
  { n: 'Constructora del Bajío', en: 'Bajío Construction', p: 92 },
  { n: 'Clínica Santa Fe', en: 'Santa Fe Clinic', p: 74 },
  { n: 'Contacto sin empresa', en: 'Lead with no company', p: 21 },
  { n: 'Distribuidora Norte', en: 'Norte Distribution', p: 58 },
];

export function EscenaVentas({ activo }: { activo: boolean }) {
  const d = useD();
  const paso = usePaso(2, 2400, activo);
  const orden = paso === 0 ? [0, 1, 2, 3] : [0, 1, 3, 2];
  const listo = paso === 1;
  return (
    <Marco etiqueta={d('Una lista de prospectos ordenándose por probabilidad de cierre', 'A list of prospects sorting itself by likelihood of closing')}>
      <div className="mb-1 text-[10px] uppercase tracking-[.16em]" style={{ color: 'var(--p-mudo)' }}>
        {listo ? d('Por probabilidad', 'By likelihood') : d('Por orden de llegada', 'In order of arrival')}
      </div>
      <div className="flex flex-col gap-2">
        {PROSPECTOS.map((p, i) => {
          const pos = orden.indexOf(i);
          const primero = listo && pos === 0;
          return (
            <motion.div
              key={p.n}
              layout
              transition={{ type: 'spring', stiffness: 210, damping: 26 }}
              style={{
                order: pos,
                borderColor: primero ? 'var(--p-morado)' : 'var(--p-linea)',
                background: primero ? 'var(--p-moradoSuave)' : 'var(--p-caja2)',
              }}
              className="rounded-xl border px-3 py-2"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <span className="truncate text-[12.5px]" style={{ color: 'var(--p-tinta)' }}>{d(p.n, p.en)}</span>
                <span
                  className="font-mono text-[11.5px]"
                  style={{ color: primero ? 'var(--p-morado)' : 'var(--p-mudo)' }}
                >
                  {p.p}
                </span>
              </div>
              <Barra
                v={listo ? p.p : 18}
                retraso={i * 60}
                color={primero ? 'var(--p-morado)' : 'var(--p-pistaFuerte)'}
              />
            </motion.div>
          );
        })}
      </div>
    </Marco>
  );
}

/* ════════════════════════════════ 10 · Tablero: una sola pantalla */

function Cifra({ hasta, sufijo = '', activo }: { hasta: number; sufijo?: string; activo: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!activo) return setV(0);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(hasta);
    let t0: number | null = null;
    let id = 0;
    const paso = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / 900, 1);
      setV(Math.round(hasta * (1 - Math.pow(1 - p, 3))));
      if (p < 1) id = requestAnimationFrame(paso);
    };
    id = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(id);
  }, [hasta, activo]);
  return (
    <span className="font-mono">
      {v.toLocaleString('es-MX')}
      {sufijo}
    </span>
  );
}

export function EscenaTablero({ activo }: { activo: boolean }) {
  const d = useD();
  const datos = [
    { l: d('Visitas', 'Visits'), v: 4820, s: '' },
    { l: d('Contactos', 'Leads'), v: 137, s: '' },
    { l: d('Costo x cliente', 'Cost per customer'), v: 412, s: '' },
    { l: d('Cerradas', 'Closed'), v: 19, s: '' },
  ];
  return (
    <Marco etiqueta={d('Un tablero con las cifras del mes en una sola pantalla', 'A dashboard with the month’s figures on one screen')}>
      <div className="grid grid-cols-2 gap-3">
        {datos.map((d, i) => (
          <motion.div
            key={d.l}
            className="rounded-2xl border p-3.5"
            style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja2)' }}
            initial={{ opacity: 0, y: 12 }}
            animate={activo ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: SAL }}
          >
            <div className="text-[9.5px] uppercase tracking-[.16em]" style={{ color: 'var(--p-mudo)' }}>
              {d.l}
            </div>
            <div className="mt-1.5 text-[22px] md:text-[26px]" style={{ color: 'var(--p-tinta)' }}>
              <Cifra hasta={d.v} sufijo={d.s} activo={activo} />
            </div>
          </motion.div>
        ))}
      </div>
    </Marco>
  );
}

/* ════════════════════════════════ el repartidor */

export function Escena({ nombre, activo, idioma = 'es' }: {
  nombre: string;
  activo: boolean;
  idioma?: 'es' | 'en';
}) {
  return <Lengua.Provider value={idioma}>{elegir(nombre, activo)}</Lengua.Provider>;
}

function elegir(nombre: string, activo: boolean) {
  switch (nombre) {
    case 'auditoria':        return <EscenaAuditoria activo={activo} />;
    case 'web':              return <EscenaWeb activo={activo} />;
    case 'posicionamiento':  return <EscenaPosicionamiento activo={activo} />;
    case 'local':            return <EscenaLocal activo={activo} />;
    case 'publicidad':       return <EscenaPublicidad activo={activo} />;
    case 'espectaculares':   return <EscenaEspectaculares activo={activo} />;
    case 'agentes':          return <EscenaAgentes activo={activo} />;
    case 'ventas':           return <EscenaVentas activo={activo} />;
    case 'tablero':          return <EscenaTablero activo={activo} />;
    default:                 return <EscenaOnda activo={activo} />;
  }
}
