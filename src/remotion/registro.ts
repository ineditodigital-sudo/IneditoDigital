import type React from 'react';
import type { PropsEscena } from './marca';
import { EscenaLocal, EscenaPosicionamiento, EscenaWeb } from './escenas/presencia';
import { EscenaAgentes, EscenaEspectaculares, EscenaPublicidad } from './escenas/demanda';
import { EscenaAuditoria, EscenaTablero, EscenaVentas } from './escenas/negocio';
import { EscenaTienda } from './escenas/tienda';

/*
 * Qué escena le toca a cada servicio.
 *
 * Una sola lista para las dos salidas: el deck la usa para pintar la escena de
 * la lámina, y Root.tsx la recorre para registrar las composiciones en el
 * Studio y en `npx remotion render`. Si mañana entra un servicio nuevo, se
 * añade aquí y aparece en los dos sitios.
 *
 * Las llaves son los `escena` de src/app/components/presentacion/contenido.ts.
 */
export const ESCENAS: Record<string, React.FC<PropsEscena>> = {
  web: EscenaWeb,
  ecommerce: EscenaTienda,
  posicionamiento: EscenaPosicionamiento,
  local: EscenaLocal,
  publicidad: EscenaPublicidad,
  espectaculares: EscenaEspectaculares,
  agentes: EscenaAgentes,
  ventas: EscenaVentas,
  auditoria: EscenaAuditoria,
  tablero: EscenaTablero,
};

export type NombreEscena = keyof typeof ESCENAS;
