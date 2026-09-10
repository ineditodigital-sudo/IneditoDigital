import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Paleta } from './marca';

/*
 * El material de las escenas: vidrio, luz y profundidad.
 *
 * La versión anterior de este archivo dibujaba rectángulos con un borde de 2 px
 * sobre una rejilla de puntos, y el resultado parecía una terminal ejecutando
 * comandos. El problema no era el ritmo: era que nada tenía superficie. Un
 * borde plano no es un objeto, y sin objetos no hay nada que mirar.
 *
 * Lo que cambia:
 *
 * VIDRIO en vez de contorno. Cada caja lleva un degradado propio —más claro
 * arriba, como si la luz cayera de arriba— un filo brillante en el borde
 * superior y una sombra debajo. Eso es lo que hace que se lea como algo que
 * está PUESTO sobre el fondo y no dibujado en él.
 *
 * LUZ en vez de color. Las barras y los anillos no se rellenan de un color:
 * emiten. Un degradado dentro y un halo del mismo tono fuera, que es lo que
 * distingue una barra de progreso de una raya de color.
 *
 * PROFUNDIDAD. Sombras largas y suaves, capas que se solapan, y en algunas
 * escenas perspectiva de verdad. Nada vive en el mismo plano que el fondo.
 *
 * Y NADA ESTÁ QUIETO. Los resplandores respiran y los halos laten aunque la
 * escena no esté contando nada en ese momento. Una imagen congelada entre
 * gesto y gesto es lo que hacía que esto pareciera una secuencia de pasos.
 */

export const MARGEN = 88;
export const BANDA_ROTULO = 148;   // arriba: de qué va la escena
export const BANDA_REMATE = 168;   // abajo: la conclusión
/* Aire entre las bandas y lo de en medio. Sin esto el remate quedaba pegado a
   la última fila de la escena y se leían como una sola cosa. */
export const AIRE = 30;

/*
 * La tipografía, escrita a mano y no heredada.
 *
 * Dentro del deck el texto heredaría la del sitio, pero `npx remotion render`
 * abre un Chrome pelado sin ninguna hoja de estilos: ahí todo salía en la
 * serif por defecto. Declararla aquí hace que el video y el deck se vean igual.
 */
export const LETRA = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
export const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";

/** Convierte un color de la paleta en el mismo tono con otra opacidad. */
export function conAlfa(color: string, a: number) {
  if (color.startsWith('#')) {
    const n = parseInt(color.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  return color.replace(/rgba?\(([^)]+)\)/, (_, p) => {
    const [r, g, b] = String(p).split(',');
    return `rgba(${r},${g},${b},${a})`;
  });
}

/* ───────────────────────────── el escenario ───────────────────────────── */

/**
 * El lienzo de una escena.
 *
 * El fondo ya no es una rejilla: son dos resplandores de color muy abiertos
 * sobre un degradado. Es lo que da la sensación de que la escena está dentro
 * de algo y no encima de un papel cuadriculado.
 */
export function Escenario({
  paleta,
  rotulo,
  remate,
  /** 0 a 1: mueve los resplandores del fondo para que nunca esté quieto. */
  respira = 0,
  children,
}: {
  paleta: Paleta;
  rotulo?: React.ReactNode;
  remate?: React.ReactNode;
  respira?: number;
  children: React.ReactNode;
}) {
  return (
    <AbsoluteFill style={{ background: paleta.fondo, overflow: 'hidden', fontFamily: LETRA }}>
      {/* el fondo: un degradado y dos blooms que se mueven despacio */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% -10%, ${conAlfa(paleta.morado, 0.16)}, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 46% at ${18 + respira * 8}% ${74 - respira * 10}%, ${conAlfa(paleta.morado, 0.3)}, transparent 70%)`,
          opacity: 0.7,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at ${84 - respira * 7}% ${22 + respira * 9}%, ${conAlfa(paleta.acento, 0.22)}, transparent 70%)`,
          opacity: 0.6,
        }}
      />

      {rotulo ? (
        <div
          style={{
            position: 'absolute',
            left: MARGEN,
            right: MARGEN,
            top: 52,
            height: BANDA_ROTULO - 52,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          {rotulo}
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: MARGEN,
          right: MARGEN,
          top: rotulo ? BANDA_ROTULO + AIRE : MARGEN,
          bottom: remate ? BANDA_REMATE + AIRE : MARGEN,
        }}
      >
        {children}
      </div>

      {remate ? (
        <div
          style={{
            position: 'absolute',
            left: MARGEN,
            right: MARGEN,
            bottom: 46,
            height: BANDA_REMATE - 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {remate}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

/**
 * El rótulo de arriba.
 *
 * Ya no va en mono con seis de espaciado: eso era medio motivo de que esto
 * pareciera una consola. Ahora es una etiqueta de vidrio, con su punto vivo
 * al lado, que es como se rotula un panel y no como se imprime un prompt.
 */
export function Rotulo({
  paleta,
  pulso = 1,
  children,
}: {
  paleta: Paleta;
  /** 0 a 1: el latido del punto. */
  pulso?: number;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '13px 26px 13px 22px',
        borderRadius: 999,
        fontSize: 30,
        color: paleta.suave,
        whiteSpace: 'nowrap',
        background: `linear-gradient(150deg, ${conAlfa(paleta.tinta, 0.1)}, ${conAlfa(paleta.tinta, 0.03)})`,
        border: `1px solid ${conAlfa(paleta.tinta, 0.14)}`,
        boxShadow: `0 10px 30px ${conAlfa(paleta.sombra, 0.35)}`,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: paleta.morado,
          boxShadow: `0 0 ${10 + pulso * 14}px ${conAlfa(paleta.morado, 0.9)}`,
          opacity: 0.6 + pulso * 0.4,
        }}
      />
      {children}
    </span>
  );
}

/** La píldora del remate: la conclusión, encendida. */
export function Remate({
  paleta,
  opacidad,
  color,
  children,
}: {
  paleta: Paleta;
  opacidad: number;
  color?: string;
  children: React.ReactNode;
}) {
  const c = color ?? paleta.morado;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        borderRadius: 999,
        padding: '18px 38px',
        fontSize: 36,
        fontWeight: 600,
        color: '#fff',
        opacity: opacidad,
        whiteSpace: 'nowrap',
        background: `linear-gradient(120deg, ${c}, ${conAlfa(c, 0.7)})`,
        boxShadow: `0 0 46px ${conAlfa(c, 0.5 * opacidad)}, 0 16px 40px ${conAlfa(paleta.sombra, 0.5)}`,
        /* el filo de arriba: lo que hace que se lea como una superficie */
        borderTop: `1px solid ${conAlfa('#ffffff', 0.4)}`,
      }}
    >
      {children}
    </span>
  );
}

/* ───────────────────────────── superficies ───────────────────────────── */

/**
 * Una superficie de vidrio.
 *
 * Tres cosas la hacen material: el degradado (la luz cae de arriba), el filo
 * claro del borde superior y la sombra proyectada. Quitando cualquiera de las
 * tres vuelve a parecer un rectángulo dibujado.
 */
export function Vidrio({
  paleta,
  style,
  children,
  /** La variante encendida: para lo que hay que mirar. */
  activa,
  /** El tono del encendido. Por defecto, el morado de la casa. */
  tono,
  /** 0 a 1: fuerza del halo cuando está activa. */
  halo = 1,
}: {
  paleta: Paleta;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  activa?: boolean;
  tono?: string;
  halo?: number;
}) {
  const t = tono ?? paleta.morado;
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 30,
        background: activa
          ? `linear-gradient(158deg, ${conAlfa(t, 0.3)}, ${conAlfa(t, 0.08)})`
          : `linear-gradient(158deg, ${conAlfa(paleta.tinta, 0.1)}, ${conAlfa(paleta.tinta, 0.025)})`,
        border: `1px solid ${activa ? conAlfa(t, 0.55) : conAlfa(paleta.tinta, 0.12)}`,
        boxShadow: activa
          ? `0 0 ${40 * halo}px ${conAlfa(t, 0.4 * halo)}, 0 20px 44px ${conAlfa(paleta.sombra, 0.5)}, inset 0 1px 0 ${conAlfa('#ffffff', 0.28)}`
          : `0 16px 38px ${conAlfa(paleta.sombra, 0.42)}, inset 0 1px 0 ${conAlfa('#ffffff', 0.12)}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * El destello que cruza una superficie encendida.
 *
 * Es la raya de luz que atraviesa la fila dorada de la referencia. Cuesta un
 * degradado y es lo que separa «esta fila es de otro color» de «esta fila
 * brilla».
 */
export function Destello({ avance, alto = '100%' }: { avance: number; alto?: string | number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${avance * 160 - 40}%`,
        width: '34%',
        height: alto,
        pointerEvents: 'none',
        background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.34), transparent)',
        filter: 'blur(6px)',
      }}
    />
  );
}

/* ─────────────────────────────── la luz ─────────────────────────────── */

/**
 * Una barra que emite luz.
 *
 * El relleno es un degradado con halo propio, y la cabeza lleva un punto más
 * brillante: así se lee de dónde viene y hacia dónde va. El recorte del
 * contenedor evita remaquetar en cada cuadro.
 */
export function BarraLuz({
  paleta,
  valor,
  color,
  color2,
  alto = 22,
  /** El punto de la cabeza, como el avión de la referencia. */
  cabeza,
}: {
  paleta: Paleta;
  /** 0 a 100. */
  valor: number;
  color: string;
  color2?: string;
  alto?: number;
  cabeza?: React.ReactNode;
}) {
  const c2 = color2 ?? color;
  return (
    <div
      style={{
        position: 'relative',
        height: alto,
        borderRadius: 999,
        background: conAlfa(paleta.tinta, 0.08),
        boxShadow: `inset 0 1px 3px ${conAlfa(paleta.sombra, 0.6)}`,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: 999, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}, ${c2})`,
            boxShadow: `0 0 ${alto * 1.5}px ${conAlfa(c2, 0.85)}`,
            translate: `${valor - 100}% 0`,
          }}
        />
      </div>
      {cabeza ? (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: `${valor}%`,
            translate: '-50% -50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {cabeza}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Un anillo de progreso, como el de carga de la referencia.
 *
 * Va en SVG porque un arco con degradado y remate redondo no se puede hacer
 * con bordes. El halo lo pone un filtro de desenfoque sobre una copia del
 * mismo trazo.
 */
export function Anillo({
  paleta,
  valor,
  color,
  color2,
  tam = 300,
  grosor = 26,
  children,
}: {
  paleta: Paleta;
  /** 0 a 100. */
  valor: number;
  color: string;
  color2?: string;
  tam?: number;
  grosor?: number;
  children?: React.ReactNode;
}) {
  const id = `anillo-${color.replace(/[^a-z0-9]/gi, '')}`;
  const r = (tam - grosor) / 2;
  const vuelta = 2 * Math.PI * r;
  const c2 = color2 ?? color;

  return (
    <div style={{ position: 'relative', width: tam, height: tam }}>
      <svg width={tam} height={tam} style={{ display: 'block', rotate: '-90deg' }}>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
          <filter id={`${id}-halo`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={grosor * 0.5} />
          </filter>
        </defs>
        <circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          fill="none"
          stroke={conAlfa(paleta.tinta, 0.08)}
          strokeWidth={grosor}
        />
        {/* la copia desenfocada: el halo */}
        <circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={vuelta}
          strokeDashoffset={vuelta * (1 - valor / 100)}
          filter={`url(#${id}-halo)`}
          opacity={0.9}
        />
        <circle
          cx={tam / 2}
          cy={tam / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={vuelta}
          strokeDashoffset={vuelta * (1 - valor / 100)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Un resplandor suelto: sirve para poner luz detrás de algo concreto. */
export function Resplandor({
  color,
  tam,
  opacidad = 1,
  style,
}: {
  color: string;
  tam: number;
  opacidad?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: tam,
        height: tam,
        borderRadius: 999,
        background: `radial-gradient(circle, ${conAlfa(color, 0.55)}, transparent 68%)`,
        opacity: opacidad,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

/** Un número grande, en degradado. Para el dato que sostiene la escena. */
export function Cifra({
  color,
  color2,
  tam = 96,
  children,
}: {
  color: string;
  color2?: string;
  tam?: number;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        fontSize: tam,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: -1,
        backgroundImage: `linear-gradient(140deg, ${color}, ${color2 ?? color})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        /* el degradado en el texto se come el halo, asi que va detras */
        filter: `drop-shadow(0 0 26px ${conAlfa(color2 ?? color, 0.45)})`,
      }}
    >
      {children}
    </span>
  );
}

/** Una palomita dibujada, para no arrastrar una librería de iconos al video. */
export function Palomita({ color, tam = 30, grosor = 4 }: { color: string; tam?: number; grosor?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <path
        d="M4 12.5 L9.5 18 L20 6.5"
        stroke={color}
        strokeWidth={grosor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
