/*
 * Lo que comparten todas las escenas: la paleta, el idioma y el ritmo.
 *
 * Las escenas se ven en dos sitios y tienen que servir igual en los dos: dentro
 * del deck, a través de <Player>, donde el tema puede ser claro u oscuro; y en
 * `npx remotion render`, que produce un MP4 y donde no existe ninguna variable
 * CSS del sitio. Por eso los colores viajan como PROPS y no como var(--p-*):
 * un prop se puede pasar desde el deck y también tiene un valor por defecto que
 * el render usa sin preguntar.
 */

export type Idioma = 'es' | 'en';

export type Paleta = {
  fondo: string;
  caja: string;
  caja2: string;
  linea: string;
  tinta: string;
  suave: string;
  mudo: string;
  morado: string;
  moradoSuave: string;
  verde: string;
  ambar: string;
  pista: string;
};

/** El tema oscuro, que es la casa. Es el que usa el render a video. */
export const OSCURA: Paleta = {
  fondo: '#0B0810',
  caja: 'rgba(255,255,255,.04)',
  caja2: 'rgba(255,255,255,.07)',
  linea: 'rgba(255,255,255,.14)',
  tinta: '#F2F0F6',
  suave: 'rgba(242,240,246,.72)',
  mudo: 'rgba(242,240,246,.45)',
  morado: '#CC66FF',
  moradoSuave: 'rgba(119,0,206,.28)',
  verde: '#00E585',
  ambar: '#FFCF7A',
  pista: 'rgba(255,255,255,.10)',
};

export const CLARA: Paleta = {
  fondo: '#FFFFFF',
  caja: '#FFFFFF',
  caja2: '#F1EDF8',
  linea: 'rgba(10,10,10,.12)',
  tinta: '#0A0A0A',
  suave: 'rgba(10,10,10,.68)',
  mudo: 'rgba(10,10,10,.45)',
  morado: '#7700CE',
  moradoSuave: 'rgba(119,0,206,.12)',
  verde: '#00A860',
  ambar: '#D99B1F',
  pista: 'rgba(10,10,10,.09)',
};

export type PropsEscena = {
  paleta: Paleta;
  idioma: Idioma;
};

export const PROPS_BASE: PropsEscena = { paleta: OSCURA, idioma: 'es' };

/*
 * El lienzo.
 *
 * 1600x1000 (16:10) para todas. Una sola proporción en todo el deck significa
 * que el <Player> escala y NUNCA recorta: el problema que antes se resolvía a
 * mano encogiendo el contenido en móvil desaparece, porque escalar la
 * composición entera es justo lo que el Player hace.
 *
 * Las medidas de dentro son unidades de composición, no píxeles de pantalla.
 * A la anchura que tiene la escena en un escritorio la composición se ve a
 * ~0.29, así que un texto de 44 aquí se lee como uno de 13 allá.
 */
export const LIENZO = { ancho: 1600, alto: 1000, fps: 30 };

/** Cinco segundos por escena: da para tres tiempos sin que se haga larga. */
export const DURACION = 150;

/** El ease-out con pegada de la casa, en bezier para Remotion. */
export const SAL = [0.23, 1, 0.32, 1] as const;

/** Elige la versión del texto sin arrastrar el idioma por diez firmas. */
export const dice = (idioma: Idioma) => (es: string, en: string) =>
  idioma === 'en' ? en : es;
