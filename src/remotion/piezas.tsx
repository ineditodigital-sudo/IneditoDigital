import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { Paleta } from './marca';

/*
 * Las piezas comunes de las escenas. Aquí NO se anima nada.
 *
 * Todo lo que se mueve vive en la escena que lo mueve, con interpolate() a la
 * vista: así se lee de un golpe qué pasa en qué cuadro. Estas piezas solo
 * ponen la caja, el borde y el sitio.
 *
 * El reparto vertical es el mismo en las nueve, y ese es el punto: hay una
 * banda para el rótulo, una para la escena y una para el remate, y ninguna
 * invade a la otra. Antes cada escena repartía a ojo y en las estrechas el
 * título acababa encima de la animación.
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

/** El lienzo de una escena, con su cuadrícula de puntos y sus tres bandas. */
export function Escenario({
  paleta,
  rotulo,
  remate,
  children,
}: {
  paleta: Paleta;
  /** La banda de arriba. Dice qué se está viendo. */
  rotulo?: React.ReactNode;
  /** La banda de abajo. Dice a qué conclusión llega. */
  remate?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AbsoluteFill style={{ background: paleta.fondo, overflow: 'hidden', fontFamily: LETRA }}>
      {/* la trama de puntos de la casa, desvanecida hacia los bordes */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, ${paleta.moradoSuave} 2.5px, transparent 2.5px)`,
          backgroundSize: '58px 58px',
          maskImage: 'radial-gradient(ellipse 74% 74% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 74% 74% at 50% 50%, black, transparent)',
          opacity: 0.55,
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

      {/* la banda de en medio: lo que de verdad cuenta la escena */}
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

/** El rótulo de arriba: mono, espaciado, en morado. */
export function Rotulo({ paleta, children }: { paleta: Paleta; children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 34,
        letterSpacing: 6,
        textTransform: 'uppercase',
        color: paleta.morado,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** La píldora del remate. Lleva la conclusión de la escena. */
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
        gap: 14,
        border: `2px solid ${c}`,
        borderRadius: 999,
        padding: '16px 34px',
        fontSize: 36,
        color: c,
        opacity: opacidad,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** Una caja con el borde y el fondo de la casa. */
export function Caja({
  paleta,
  style,
  children,
  fuerte,
}: {
  paleta: Paleta;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** La variante con más contraste, para lo que hay que mirar. */
  fuerte?: boolean;
}) {
  return (
    <div
      style={{
        border: `2px solid ${paleta.linea}`,
        background: fuerte ? paleta.caja2 : paleta.caja,
        borderRadius: 26,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Una barra de progreso. El relleno se recorta, no se remaquete. */
export function Barra({
  paleta,
  valor,
  color,
  alto = 18,
}: {
  paleta: Paleta;
  /** 0 a 100. */
  valor: number;
  color: string;
  alto?: number;
}) {
  return (
    <div
      style={{
        height: alto,
        borderRadius: 999,
        background: paleta.pista,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          borderRadius: 999,
          background: color,
          translate: `${valor - 100}% 0`,
        }}
      />
    </div>
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
