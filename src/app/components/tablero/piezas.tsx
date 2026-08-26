import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, ArrowUpRight, Maximize2, Minus } from 'lucide-react';

/**
 * Las piezas sueltas del tablero.
 *
 * Todo está pensado para fondo claro: el resto del sitio es negro, pero un
 * tablero de trabajo se lee mejor en blanco y así se parece a lo que el
 * cliente va a tener abierto todo el día.
 */

export const MORADO = '#7700CE';

/* ------------------------------------------------------------- tarjeta */

export function Tarjeta({
  children,
  className = '',
  retraso = 0,
  alMontar = false,
}: {
  children: ReactNode;
  className?: string;
  retraso?: number;
  /**
   * Aparecer al montar en vez de al entrar en pantalla.
   *
   * Lo que se ve sin bajar —los cuatro indicadores— no puede depender de un
   * IntersectionObserver. Si por lo que sea no dispara, la primera pantalla se
   * queda en blanco, y en una expo eso es la demostración entera.
   */
  alMontar?: boolean;
}) {
  const entrada = alMontar
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' } };
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      {...entrada}
      transition={{ duration: 0.5, delay: retraso, ease: [0.22, 0.61, 0.36, 1] }}
      className={`min-w-0 rounded-2xl border border-[var(--t-borde)] bg-[var(--t-tarjeta)] shadow-[var(--t-sombra)] ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function TituloBloque({
  titulo,
  sub,
  extra,
  alAmpliar,
}: {
  titulo: string;
  sub?: string;
  extra?: ReactNode;
  /** Si viene, aparece el botón de abrir la gráfica en grande. */
  alAmpliar?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--t-borde-suave)] px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <div className="text-[15px] font-semibold tracking-tight text-[var(--t-txt)]">{titulo}</div>
        {sub && <p className="mt-0.5 text-[13px] leading-snug text-[var(--t-txt-3)]">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        {extra}
        {alAmpliar && <BotonAmpliar alPulsar={alAmpliar} />}
      </div>
    </div>
  );
}

/** Abre la gráfica en grande, con sus controles y los números de atrás. */
export function BotonAmpliar({ alPulsar }: { alPulsar: () => void }) {
  return (
    <button
      onClick={alPulsar}
      title="Ver en grande"
      aria-label="Ver en grande"
      className="shrink-0 rounded-lg border border-[var(--t-borde)] p-1.5 text-[var(--t-txt-3)] transition-colors hover:border-[#7700CE]/40 hover:bg-[#7700CE]/[.06] hover:text-[#7700CE]"
    >
      <Maximize2 size={14} strokeWidth={2} />
    </button>
  );
}

/* ------------------------------------------------------------ contador */

/**
 * Una cifra que cuenta hasta su valor y vuelve a contar cada vez que cambia.
 *
 * No es la CifraAnimada del resto del sitio: aquella anima una sola vez, al
 * aparecer. Aquí el número cambia cuando se cambia el periodo, y esa es
 * justamente la parte que se quiere ver en movimiento frente a la gente.
 */
export function Contador({
  valor,
  formato = (n: number) => Math.round(n).toLocaleString('es-MX'),
  duracion = 900,
  className = '',
}: {
  valor: number;
  formato?: (n: number) => string;
  duracion?: number;
  className?: string;
}) {
  const [n, setN] = useState(valor);
  const desde = useRef(valor);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      desde.current = valor;
      setN(valor);
      return;
    }
    const a = desde.current;
    let cuadro = 0;
    let t0: number | null = null;
    const paso = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / duracion, 1);
      setN(a + (valor - a) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) cuadro = requestAnimationFrame(paso);
      else desde.current = valor;
    };
    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [valor, duracion]);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {formato(n)}
    </span>
  );
}

/* --------------------------------------------------------- variaciones */

export function Variacion({ pct, invertido = false }: { pct: number; invertido?: boolean }) {
  const plano = Math.abs(pct) < 0.6;
  const bueno = invertido ? pct < 0 : pct > 0;
  /*
   * La flecha sigue al numero y el color sigue a si eso es bueno.
   * Antes las dos seguian al color, y el costo por contacto —que bajo 23%—
   * salia con flecha hacia ARRIBA. Verde, pero al reves de lo que decia.
   */
  const Icono = plano ? Minus : pct > 0 ? ArrowUpRight : ArrowDownRight;
  const tono = plano
    ? 'bg-[var(--t-pista)] text-[var(--t-txt-3)]'
    : bueno
    ? 'bg-[var(--t-ok-bg)] text-[var(--t-ok-tx)]'
    : 'bg-[var(--t-mal-bg)] text-[var(--t-mal-tx)]';
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${tono}`}>
      <Icono size={12} strokeWidth={2.4} />
      {plano ? 'sin cambio' : `${pct > 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`}
    </span>
  );
}

/* --------------------------------------------------------- minigrafica */

/** La rayita bajo cada indicador. Se dibuja sola de izquierda a derecha. */
export function Rayita({ datos, color = MORADO }: { datos: number[]; color?: string }) {
  if (datos.length < 2) return null;
  const alto = 34;
  const ancho = 120;
  const max = Math.max(...datos);
  const min = Math.min(...datos);
  const rango = max - min || 1;
  const puntos = datos.map((v, i) => {
    const x = (i / (datos.length - 1)) * ancho;
    const y = alto - ((v - min) / rango) * (alto - 6) - 3;
    return [x, y] as const;
  });
  const linea = puntos.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${linea} L${ancho},${alto} L0,${alto} Z`;
  const id = `r${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} className="h-9 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      />
      <motion.path
        d={linea}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------- anillo */

/** El anillo de la calificación de la auditoría. */
export function Anillo({
  valor,
  antes,
  tamano = 168,
}: {
  valor: number;
  antes?: number;
  tamano?: number;
}) {
  const r = tamano / 2 - 14;
  const vuelta = 2 * Math.PI * r;
  const color = valor >= 70 ? '#16A34A' : valor >= 45 ? '#D97706' : '#E11D48';

  return (
    <div className="relative shrink-0" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} className="-rotate-90">
        <circle cx={tamano / 2} cy={tamano / 2} r={r} fill="none" stroke="var(--t-pista)" strokeWidth="13" />
        {antes !== undefined && (
          <circle
            cx={tamano / 2}
            cy={tamano / 2}
            r={r - 12}
            fill="none"
            stroke="var(--t-antes)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (r - 12)}
            strokeDashoffset={2 * Math.PI * (r - 12) * (1 - antes / 100)}
          />
        )}
        <motion.circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={vuelta}
          initial={{ strokeDashoffset: vuelta }}
          whileInView={{ strokeDashoffset: vuelta * (1 - valor / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Contador valor={valor} duracion={1400} className="text-4xl font-bold tracking-tight text-[var(--t-txt)]" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--t-txt-3)]">de 100</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- barra */

export function BarraArea({
  nombre,
  valor,
  antes,
}: {
  nombre: string;
  valor: number;
  antes: number;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-[var(--t-txt-2)]">{nombre}</span>
        <span className="text-[13px] font-semibold tabular-nums text-[var(--t-txt)]">
          {valor}
          <span className="ml-1.5 text-[11px] font-normal text-[var(--t-txt-3)]">antes {antes}</span>
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-[var(--t-pista)]">
        <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--t-antes)]" style={{ width: `${antes}%` }} />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: `linear-gradient(90deg, ${MORADO}, #AA66FF)` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${valor}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- gravedad */

export const GRAVEDAD = {
  critico: { texto: 'Crítico', clase: 'bg-[var(--t-mal-bg)] text-[var(--t-mal-tx)] ring-[var(--t-mal-ring)]' },
  importante: { texto: 'Importante', clase: 'bg-[var(--t-aviso-bg)] text-[var(--t-aviso-tx)] ring-[var(--t-aviso-ring)]' },
  menor: { texto: 'Menor', clase: 'bg-[var(--t-pista)] text-[var(--t-txt-2)] ring-[var(--t-borde)]' },
} as const;

export function Etiqueta({ gravedad }: { gravedad: keyof typeof GRAVEDAD }) {
  const g = GRAVEDAD[gravedad];
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${g.clase}`}>
      {g.texto}
    </span>
  );
}
