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
  tinta: string;
  suave: string;
  mudo: string;
  /* El morado de la casa y su pareja para los degradados. Una barra de un solo
     color es una raya; una con dos tonos es luz. */
  morado: string;
  morado2: string;
  /* El segundo tono, para los resplandores del fondo y los datos que no son la
     marca. Cian porque es lo que menos pelea con el morado. */
  acento: string;
  verde: string;
  verde2: string;
  ambar: string;
  /* De qué color es la oscuridad debajo de las cosas. En claro no es negro:
     una sombra negra sobre fondo claro ensucia. */
  sombra: string;
};

/** El tema oscuro, que es la casa. Es el que usa el render a video. */
export const OSCURA: Paleta = {
  fondo: '#080611',
  tinta: '#F4F2F8',
  suave: 'rgba(244,242,248,.74)',
  mudo: 'rgba(244,242,248,.46)',
  morado: '#B44BFF',
  morado2: '#E48CFF',
  acento: '#3DD8FF',
  verde: '#00C97A',
  verde2: '#5BFFB0',
  ambar: '#FFB65C',
  sombra: '#02000A',
};

export const CLARA: Paleta = {
  fondo: '#F7F4FC',
  tinta: '#120A1C',
  suave: 'rgba(18,10,28,.70)',
  mudo: 'rgba(18,10,28,.46)',
  morado: '#7700CE',
  morado2: '#A34BFF',
  acento: '#0090C4',
  verde: '#008750',
  verde2: '#00B96E',
  ambar: '#C07A10',
  sombra: '#3A2A55',
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
