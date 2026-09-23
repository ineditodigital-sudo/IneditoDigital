import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import '../../styles/iconos-servicio.css';

/*
 * El ícono animado de cada servicio (/servicios).
 *
 * Cada dibujo cuenta en un segundo qué hace su servicio: el sitio se arma,
 * tu resultado sube al primer lugar, el pin cae en el mapa, el embudo deja
 * pasar al cliente. Se anima una vez al entrar en pantalla y se repite al
 * pasar el cursor por su tarjeta, solo con ratón: en el teléfono un toque
 * ya navega. No hay bucles; diecinueve íconos moviéndose a la vez serían
 * ruido.
 *
 * El movimiento vive en iconos-servicio.css (transform, opacity y el trazo
 * de las líneas); aquí solo se decide cuándo. Con «reducir movimiento» se
 * quedan quietos.
 *
 * Todos van en una retícula de 32 × 32 con trazo de 1.5, en el morado claro
 * del sitio, y lo que importa de cada uno en blanco.
 */

const B = '#fff';

type Dibujo = {
  /** Lo que dura la animación completa, con los retrasos de sus piezas. */
  duracion: number;
  svg: (id: string) => ReactNode;
};

/* Una línea que se dibuja: su largo se normaliza a 1 para animar el trazo. */
const traza = { pathLength: 1 } as const;

const DIBUJOS: Record<string, Dibujo> = {
  /* Sitio web: la página se arma, título, texto y botón. */
  web: {
    duracion: 900,
    svg: () => (
      <>
        <rect x="4" y="6" width="24" height="20" rx="3" />
        <path d="M4 11H28" strokeOpacity={0.55} />
        <circle cx="7.3" cy="8.5" r="0.85" fill="currentColor" stroke="none" />
        <circle cx="9.9" cy="8.5" r="0.85" fill="currentColor" stroke="none" />
        <circle cx="12.5" cy="8.5" r="0.85" fill="currentColor" stroke="none" />
        <rect className="isv-web-h" x="8" y="14" width="11" height="2.6" rx="1.3" fill={B} stroke="none" />
        <rect className="isv-web-b" x="21" y="14" width="3" height="2.6" rx="1.3" fill="currentColor" stroke="none" />
        <path className="isv-web-l1 traza" {...traza} d="M8 19.8H24" strokeOpacity={0.6} />
        <path className="isv-web-l2 traza" {...traza} d="M8 22.8H18.5" strokeOpacity={0.6} />
      </>
    ),
  },

  /* Posicionamiento en Google: tu resultado sube del tercer lugar al primero. */
  seo: {
    duracion: 1000,
    svg: () => (
      <>
        <rect x="4" y="4" width="24" height="6.5" rx="3.25" />
        <circle cx="8.3" cy="7.25" r="1.5" />
        <path d="M9.4 8.35L10.4 9.35" />
        <path className="isv-seo-q traza" {...traza} d="M13 7.25H22" strokeOpacity={0.55} />
        <g className="isv-seo-otro">
          <rect x="6" y="18.5" width="3" height="3" rx="0.9" strokeOpacity={0.6} />
          <path d="M11.5 20H22" strokeOpacity={0.5} />
          <rect x="6" y="23.5" width="3" height="3" rx="0.9" strokeOpacity={0.6} />
          <path d="M11.5 25H24" strokeOpacity={0.5} />
        </g>
        <g className="isv-seo-yo">
          <rect x="6" y="13.5" width="3" height="3" rx="0.9" fill={B} stroke="none" />
          <path d="M11.5 15H25" stroke={B} />
        </g>
      </>
    ),
  },

  /* Posicionamiento en IA: la respuesta del asistente te nombra a ti. */
  geo: {
    duracion: 1200,
    svg: () => (
      <>
        <path d="M8 5H21A4 4 0 0 1 25 9V16.5A4 4 0 0 1 21 20.5H12.5L8 24.5V20.5A4 4 0 0 1 4 16.5V9A4 4 0 0 1 8 5Z" />
        <path className="isv-geo-l traza" {...traza} d="M8.5 10H19" strokeOpacity={0.55} />
        <rect className="isv-geo-chip" x="8.5" y="13" width="11" height="3.6" rx="1.8" fill={B} stroke="none" />
        <path className="isv-geo-chispa" d="M26 2.5L27 5L29.5 6L27 7L26 9.5L25 7L22.5 6L25 5Z" fill={B} stroke="none" />
      </>
    ),
  },

  /* Ficha de Google: el pin cae en el mapa. */
  ficha: {
    duracion: 950,
    svg: () => (
      <>
        <ellipse cx="16" cy="24.8" rx="7.5" ry="2.2" strokeOpacity={0.45} />
        <ellipse className="isv-ficha-onda onda" cx="16" cy="24.8" rx="7.5" ry="2.2" stroke={B} />
        <g className="isv-ficha-pin">
          <path d="M16 3.5A7 7 0 0 1 23 10.5C23 15.5 16 22.5 16 22.5S9 15.5 9 10.5A7 7 0 0 1 16 3.5Z" fill="currentColor" fillOpacity={0.18} />
          <circle cx="16" cy="10.5" r="2.6" fill={B} stroke="none" />
        </g>
      </>
    ),
  },

  /* Agente de IA para WhatsApp: llega un mensaje y ya le están contestando. */
  whatsapp: {
    duracion: 1750,
    svg: () => (
      <>
        <g className="isv-wa-in">
          <rect x="3" y="4.5" width="16" height="9" rx="4.5" strokeOpacity={0.7} />
          <path d="M7 9H15" strokeOpacity={0.5} />
        </g>
        <g className="isv-wa-out">
          <rect x="11" y="16.5" width="18" height="10" rx="5" fill="currentColor" fillOpacity={0.22} />
          <circle className="isv-wa-d1" cx="16" cy="21.5" r="1.25" fill={B} stroke="none" />
          <circle className="isv-wa-d2" cx="20" cy="21.5" r="1.25" fill={B} stroke="none" />
          <circle className="isv-wa-d3" cx="24" cy="21.5" r="1.25" fill={B} stroke="none" />
        </g>
      </>
    ),
  },

  /* IA de ventas: la aguja califica al prospecto y se va a lo alto. */
  ventas: {
    duracion: 950,
    svg: () => (
      <>
        <path d="M5 22A11 11 0 0 1 27 22" strokeOpacity={0.35} />
        <path className="isv-ventas-valor traza" {...traza} d="M5 22A11 11 0 0 1 23.78 14.22" stroke={B} strokeWidth={2} />
        <path className="isv-ventas-aguja" d="M16 22L21.3 16.7" stroke={B} />
        <circle cx="16" cy="22" r="1.9" fill={B} stroke="none" />
      </>
    ),
  },

  /* Funnels de venta: entran tres, sale un cliente. */
  funnels: {
    duracion: 1400,
    svg: () => (
      <>
        <path d="M28.5 4.75H3.5L13.5 16.8V24.75L18.5 27.25V16.8Z" />
        <circle className="isv-fun-d isv-fun-d1" cx="11" cy="2.5" r="1.3" fill={B} stroke="none" />
        <circle className="isv-fun-d isv-fun-d2" cx="16" cy="2.5" r="1.3" fill={B} stroke="none" />
        <circle className="isv-fun-d isv-fun-d3" cx="21" cy="2.5" r="1.3" fill={B} stroke="none" />
        <circle className="isv-fun-sale" cx="16" cy="30" r="1.5" fill={B} stroke="none" />
      </>
    ),
  },

  /* Google Ads: alguien le da clic a tu anuncio. */
  ads: {
    duracion: 1150,
    svg: () => (
      <>
        <rect x="3" y="4.5" width="22" height="14" rx="3" />
        <rect x="6.5" y="8" width="5.5" height="3.2" rx="1.6" fill={B} stroke="none" />
        <path d="M14.5 9.6H21.5" strokeOpacity={0.55} />
        <path d="M6.5 14.6H18" strokeOpacity={0.55} />
        <circle className="isv-ads-onda onda" cx="19.5" cy="16.5" r="3.2" stroke={B} />
        <path className="isv-ads-cursor" d="M19.5 16.5V26.1L21.9 23.7L23.7 27.3L24.9 26.7L23.1 23.1H26.1Z" fill={B} stroke="#0A0A0F" strokeWidth={0.9} />
      </>
    ),
  },

  /* ChatGPT Ads: tu anuncio aparece dentro de la conversación. */
  chatgpt: {
    duracion: 1050,
    svg: () => (
      <>
        <path d="M8 4H24A4 4 0 0 1 28 8V19A4 4 0 0 1 24 23H13L8 27.5V23A4 4 0 0 1 4 19V8A4 4 0 0 1 8 4Z" />
        <path className="isv-gpt-l traza" {...traza} d="M8 8.5H22" strokeOpacity={0.55} />
        <g className="isv-gpt-card">
          <rect x="8" y="11.5" width="16" height="8" rx="2" fill="currentColor" fillOpacity={0.2} stroke={B} />
          <rect className="isv-gpt-img" x="10" y="13.5" width="4" height="4" rx="1" fill={B} stroke="none" />
          <path className="isv-gpt-l2 traza" {...traza} d="M16 15.5H21.5" stroke={B} />
        </g>
      </>
    ),
  },

  /* Estrategia de canales: tres caminos, y se elige el que va primero. */
  canales: {
    duracion: 1400,
    svg: () => (
      <>
        <circle cx="5.5" cy="16" r="2.2" fill={B} stroke="none" />
        <path className="isv-can-tronco traza" {...traza} d="M7.7 16H13" />
        <path className="isv-can-r1 traza" {...traza} d="M13 16C17 16 17.5 7.5 22.5 7.5" />
        <path className="isv-can-r2 traza" {...traza} d="M13 16H22.5" strokeOpacity={0.6} />
        <path className="isv-can-r3 traza" {...traza} d="M13 16C17 16 17.5 24.5 22.5 24.5" strokeOpacity={0.6} />
        <rect className="isv-can-n1" x="23" y="5.5" width="4.5" height="4" rx="1.2" fill={B} stroke="none" />
        <rect className="isv-can-n2" x="23" y="14" width="4.5" height="4" rx="1.2" strokeOpacity={0.7} />
        <rect className="isv-can-n3" x="23" y="22.5" width="4.5" height="4" rx="1.2" strokeOpacity={0.7} />
      </>
    ),
  },

  /* Tablero de resultados: las barras crecen y la tendencia sube. */
  tablero: {
    duracion: 1250,
    svg: () => (
      <>
        <path d="M4 27.5H28" strokeOpacity={0.45} />
        <rect className="isv-tab-b1" x="6" y="21" width="3.6" height="6" rx="0.8" fill="currentColor" fillOpacity={0.35} stroke="none" />
        <rect className="isv-tab-b2" x="11.8" y="17" width="3.6" height="10" rx="0.8" fill="currentColor" fillOpacity={0.35} stroke="none" />
        <rect className="isv-tab-b3" x="17.6" y="14" width="3.6" height="13" rx="0.8" fill="currentColor" fillOpacity={0.35} stroke="none" />
        <rect className="isv-tab-b4" x="23.4" y="10" width="3.6" height="17" rx="0.8" fill="currentColor" fillOpacity={0.6} stroke="none" />
        <path className="isv-tab-linea traza" {...traza} d="M7.8 17.5L13.6 13L19.4 10L25.2 5.5" stroke={B} />
        <circle className="isv-tab-punto" cx="25.2" cy="5.5" r="1.5" fill={B} stroke="none" />
      </>
    ),
  },

  /* Diagnóstico con IA: la lupa revisa tu presencia y la IA marca el hallazgo. */
  diagnostico: {
    duracion: 1500,
    svg: () => (
      <>
        <rect x="4" y="3.5" width="16" height="22" rx="2.5" strokeOpacity={0.8} />
        <path d="M8 9H16" strokeOpacity={0.5} />
        <path d="M8 13H14" strokeOpacity={0.5} />
        <path d="M8 17H16" strokeOpacity={0.5} />
        <g className="isv-diag-lupa">
          <circle cx="20" cy="19.5" r="5" stroke={B} fill="#0B0512" fillOpacity={0.55} />
          <path d="M23.6 23.1L27.5 27" stroke={B} strokeWidth={2.2} />
        </g>
        <path className="isv-diag-chispa" d="M26 2.5L26.9 4.8L29.2 5.7L26.9 6.6L26 8.9L25.1 6.6L22.8 5.7L25.1 4.8Z" fill={B} stroke="none" />
      </>
    ),
  },

  /* Branding: la paleta de la marca se abre en abanico. */
  branding: {
    duracion: 800,
    svg: () => (
      <>
        <rect className="isv-br-a" x="12" y="5" width="8" height="20" rx="2" fill="currentColor" fillOpacity={0.2} />
        <rect x="12" y="5" width="8" height="20" rx="2" fill="currentColor" fillOpacity={0.45} />
        <g className="isv-br-c">
          <rect x="12" y="5" width="8" height="20" rx="2" fill={B} stroke={B} />
          <circle cx="16" cy="10" r="1.8" fill="#9933FF" stroke="none" />
        </g>
        <circle cx="16" cy="25.2" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
  },

  /* Servicios QR: el código se escanea de arriba abajo. */
  qr: {
    duracion: 1400,
    svg: () => (
      <>
        <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" />
        <rect x="7" y="7" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
        <rect x="19.5" y="4.5" width="8" height="8" rx="1.5" />
        <rect x="22" y="7" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
        <rect x="4.5" y="19.5" width="8" height="8" rx="1.5" />
        <rect x="7" y="22" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
        <g className="isv-qr-mod" fill="currentColor" stroke="none">
          <rect x="15" y="5" width="2.4" height="2.4" rx="0.5" />
          <rect x="15" y="10" width="2.4" height="2.4" rx="0.5" />
          <rect x="15" y="15" width="2.4" height="2.4" rx="0.5" />
          <rect x="20" y="15" width="2.4" height="2.4" rx="0.5" />
          <rect x="25" y="15" width="2.4" height="2.4" rx="0.5" />
          <rect x="5" y="15" width="2.4" height="2.4" rx="0.5" />
          <rect x="10" y="15" width="2.4" height="2.4" rx="0.5" />
          <rect x="15" y="20" width="2.4" height="2.4" rx="0.5" />
          <rect x="15" y="25" width="2.4" height="2.4" rx="0.5" />
          <rect x="20" y="22.5" width="2.4" height="2.4" rx="0.5" />
          <rect x="25" y="20" width="2.4" height="2.4" rx="0.5" />
          <rect x="25" y="25" width="2.4" height="2.4" rx="0.5" />
        </g>
        <path className="isv-qr-scan onda" d="M2.5 5H29.5" stroke={B} strokeWidth={1.8} />
      </>
    ),
  },

  /* Creación de logo: la pluma traza la curva entre sus dos puntos. */
  logo: {
    duracion: 1000,
    svg: () => (
      <>
        <path className="isv-logo-h" d="M6 25L11 8M26 7L21 24" strokeOpacity={0.4} strokeWidth={1} />
        <circle className="isv-logo-h" cx="11" cy="8" r="1.1" fill="currentColor" stroke="none" />
        <circle className="isv-logo-h" cx="21" cy="24" r="1.1" fill="currentColor" stroke="none" />
        <path className="isv-logo-curva traza" {...traza} d="M6 25C11 8 21 24 26 7" stroke={B} strokeWidth={1.8} />
        <rect className="isv-logo-a1" x="4.6" y="23.6" width="2.8" height="2.8" rx="0.5" fill="#0B0512" stroke={B} />
        <rect className="isv-logo-a2" x="24.6" y="5.6" width="2.8" height="2.8" rx="0.5" fill="#0B0512" stroke={B} />
      </>
    ),
  },

  /* Activaciones para expo: los reflectores barren el stand. */
  expo: {
    duracion: 1350,
    svg: () => (
      <>
        <path className="isv-expo-f1" d="M3.5 3.5L10.5 15H14.5Z" fill={B} fillOpacity={0.2} stroke="none" />
        <path className="isv-expo-f2" d="M28.5 3.5L21.5 15H17.5Z" fill={B} fillOpacity={0.2} stroke="none" />
        <circle cx="3.5" cy="3.5" r="1.4" fill={B} stroke="none" />
        <circle cx="28.5" cy="3.5" r="1.4" fill={B} stroke="none" />
        <path d="M7 15L9 10.5H23L25 15Z" />
        <rect x="8" y="15" width="16" height="12" rx="1.5" />
        <path d="M8 20H24" strokeOpacity={0.45} />
        <path className="isv-expo-estrella" d="M16 3.8L16.8 5.9L18.9 6.7L16.8 7.5L16 9.6L15.2 7.5L13.1 6.7L15.2 5.9Z" fill={B} stroke="none" />
      </>
    ),
  },

  /* Tarjetas NFC: la tarjeta comparte tu contacto al acercarla. */
  nfc: {
    duracion: 800,
    svg: () => (
      <>
        <rect x="3.5" y="8.5" width="17" height="15" rx="2.5" />
        <rect className="isv-nfc-chip" x="6.5" y="12.5" width="4.5" height="3.6" rx="0.8" fill={B} stroke="none" />
        <path d="M6.5 19.5H15.5" strokeOpacity={0.5} />
        <path className="isv-nfc-o1" d="M23.5 13.5A3.5 3.5 0 0 1 23.5 18.5" stroke={B} />
        <path className="isv-nfc-o2" d="M25.6 11.4A6.5 6.5 0 0 1 25.6 20.6" strokeOpacity={0.8} />
        <path className="isv-nfc-o3" d="M27.7 9.3A9.5 9.5 0 0 1 27.7 22.7" strokeOpacity={0.5} />
      </>
    ),
  },

  /* LinkedIn de empresa: el perfil se completa y queda verificado. */
  linkedin: {
    duracion: 1100,
    svg: () => (
      <>
        <rect x="3.5" y="4.5" width="25" height="23" rx="3" />
        <circle cx="10.5" cy="12" r="3.5" strokeOpacity={0.9} />
        <path className="isv-li-n traza" {...traza} d="M17 10.5H24.5" stroke={B} />
        <path className="isv-li-s traza" {...traza} d="M17 14H22" strokeOpacity={0.55} />
        <path className="isv-li-l1 traza" {...traza} d="M7.5 20H24.5" strokeOpacity={0.55} />
        <path className="isv-li-l2 traza" {...traza} d="M7.5 23.5H19" strokeOpacity={0.55} />
        <g className="isv-li-check">
          <circle cx="13.3" cy="14.8" r="2.3" fill={B} stroke="none" />
          <path d="M12.3 14.8L13.1 15.6L14.5 14.1" stroke="#7700CE" strokeWidth={1.1} />
        </g>
      </>
    ),
  },

  /* Espectaculares: el anuncio entra al panel y se encienden las luces. */
  espectaculares: {
    duracion: 1150,
    svg: (id) => (
      <>
        <defs>
          <clipPath id={`${id}-panel`}>
            <rect x="4" y="5.5" width="24" height="14" rx="1" />
          </clipPath>
        </defs>
        <path d="M16 20.5V28.5M12 28.5H20" />
        <rect x="3" y="4.5" width="26" height="16" rx="1.5" />
        <g clipPath={`url(#${id}-panel)`}>
          <g className="isv-esp-anuncio">
            <circle cx="9" cy="10" r="2" fill={B} stroke="none" />
            <path d="M5 18.5L11 12.5L15 16.5L19.5 11.5L27 18.5" stroke={B} />
          </g>
        </g>
        <path d="M10 3.6V4.5M22 3.6V4.5" />
        <g className="isv-esp-luz" fill={B} stroke="none">
          <circle cx="10" cy="2.6" r="1" />
          <circle cx="22" cy="2.6" r="1" />
        </g>
      </>
    ),
  },

  /* Un servicio nuevo del panel que todavía no tiene dibujo propio. */
  generico: {
    duracion: 650,
    svg: () => (
      <>
        <circle cx="16" cy="16" r="11" strokeOpacity={0.4} />
        <path className="isv-gen-estrella" d="M16 7.5L18.2 13.8L24.5 16L18.2 18.2L16 24.5L13.8 18.2L7.5 16L13.8 13.8Z" fill={B} stroke="none" />
      </>
    ),
  },
};

/* El dibujo de cada servicio, por el último tramo de su ruta o por su slug:
   /servicios/google-ads, /servicios-ia/whatsapp, 'branding'… */
const POR_RUTA: Record<string, string> = {
  'diseno-y-desarrollo-web': 'web',
  'posicionamiento-organico': 'seo',
  'posicionamiento-en-ia': 'geo',
  'ficha-de-google': 'ficha',
  whatsapp: 'whatsapp',
  ventas: 'ventas',
  'funnels-de-venta': 'funnels',
  'google-ads': 'ads',
  'chatgpt-ads': 'chatgpt',
  'estrategia-de-canales': 'canales',
  'tablero-de-resultados': 'tablero',
  'auditoria-con-ia': 'diagnostico',
  branding: 'branding',
  'servicios-qr': 'qr',
  'creacion-de-logo': 'logo',
  'activaciones-para-expo': 'expo',
  'tarjetas-de-presentacion-digital': 'nfc',
  'linkedin-de-empresa': 'linkedin',
  'anuncios-espectaculares': 'espectaculares',
};

const claveDeIcono = (rutaOSlug: string) =>
  POR_RUTA[rutaOSlug.split('/').filter(Boolean).pop() ?? ''] ?? 'generico';

/*
 * espera: congelado en el primer cuadro, antes de verse (ver la hoja).
 * anima:  corriendo.
 * null:   en reposo, el dibujo terminado. Es lo que ve quien pidió reducir
 *         el movimiento, o si algo falla.
 */
type Estado = 'espera' | 'anima' | null;

const reducir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function IconoServicio({
  ruta,
  tamano = 'md',
  retraso = 0,
  className = '',
}: {
  /** La ruta del servicio (/servicios/google-ads) o su slug. */
  ruta: string;
  tamano?: 'sm' | 'md' | 'lg';
  /** Espera antes de la animación de entrada, para escalonar una fila. */
  retraso?: number;
  className?: string;
}) {
  const clave = claveDeIcono(ruta);
  const dibujo = DIBUJOS[clave] ?? DIBUJOS.generico;
  const ref = useRef<HTMLSpanElement>(null);
  const [estado, setEstado] = useState<Estado>(null);
  /* Para el clipPath de los espectaculares: un id por ícono en la página. */
  const id = `isv${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  /* Antes del primer pintado, para que no se vea ni un cuadro del dibujo
     terminado antes de su entrada. */
  useLayoutEffect(() => {
    if (!reducir()) setEstado('espera');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reducir()) return;

    let actual: Estado = 'espera';
    let espera = 0;
    let fin = 0;
    const poner = (e: Estado) => {
      actual = e;
      setEstado(e);
    };
    /* Una animación a la vez: si ya va, no se reinicia a medias, que se vería
       como un salto. Termina sola y vuelve al dibujo en reposo. */
    const jugar = (demora: number) => {
      if (actual === 'anima' || espera) return;
      espera = window.setTimeout(() => {
        espera = 0;
        poner('anima');
        fin = window.setTimeout(() => poner(null), dibujo.duracion + 60);
      }, demora);
    };

    /* 1. Al entrar en pantalla, una vez. */
    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
          jugar(retraso);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    /* 2. Al pasar el cursor por su tarjeta, solo con ratón. */
    const tarjeta = el.closest('a, [data-tarjeta]');
    const conRaton = window.matchMedia('(hover: hover) and (pointer: fine)');
    const alEntrar = () => {
      if (conRaton.matches) jugar(0);
    };
    tarjeta?.addEventListener('pointerenter', alEntrar);

    return () => {
      io.disconnect();
      tarjeta?.removeEventListener('pointerenter', alEntrar);
      window.clearTimeout(espera);
      window.clearTimeout(fin);
    };
  }, [dibujo.duracion, retraso]);

  return (
    <span
      ref={ref}
      className={`isv isv-${tamano} ${className}`}
      data-anim={estado ?? undefined}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dibujo.svg(id)}
      </svg>
    </span>
  );
}
