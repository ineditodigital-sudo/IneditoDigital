import { Img, staticFile } from 'remotion';
import { conAlfa } from './piezas';
import type { Paleta } from './marca';

/*
 * Las marcas que el cliente reconoce.
 *
 * Dos orígenes, y la diferencia importa:
 *
 * Los cinco logotipos de IA son los ARCHIVOS REALES que ya usa el sitio
 * (public/logos-ia). Vienen en blanco porque los originales son oscuros y el
 * sitio es oscuro.
 *
 * Google y WhatsApp van dibujados con su geometría oficial, que es pública y
 * simple. Lo que NO se hace aquí es inventar un logotipo: un logo aproximado
 * se ve peor que no poner ninguno, y en una carta de servicios que se manda a
 * clientes eso resta en vez de sumar. Para el resto de plataformas se usa una
 * pastilla con el nombre en su color, que es correcto y no finge nada.
 *
 * Todo va dentro de una pastilla oscura para que funcione igual en el tema
 * claro, donde un logotipo blanco desaparecería.
 */

export type MarcaIA = 'openai' | 'claude' | 'gemini' | 'perplexity' | 'copilot';

/** Proporciones de cada archivo, para que ninguno salga estirado. */
const PROPORCION: Record<MarcaIA, number> = {
  openai: 3.427,
  claude: 4.635,
  gemini: 4.438,
  perplexity: 4.156,
  copilot: 4.292,
};

/** La pastilla oscura que sostiene cualquier marca. */
export function Chapa({
  paleta,
  children,
  style,
}: {
  paleta: Paleta;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 24px',
        borderRadius: 999,
        /* Siempre oscura, tambien en el tema claro: los logotipos son blancos
           y sobre fondo claro no se verian. */
        background: 'rgba(14,10,24,.82)',
        border: `1px solid ${conAlfa(paleta.tinta, 0.16)}`,
        boxShadow: `0 12px 30px ${conAlfa(paleta.sombra, 0.45)}, inset 0 1px 0 rgba(255,255,255,.14)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Un logotipo de IA, del archivo real. */
export function LogoIA({ marca, alto = 34 }: { marca: MarcaIA; alto?: number }) {
  return (
    <Img
      src={staticFile(`logos-ia/${marca}.webp`)}
      style={{ height: alto, width: alto * PROPORCION[marca], display: 'block' }}
    />
  );
}

/** La G de Google, con su geometría y sus cuatro colores oficiales. */
export function LogoGoogle({ tam = 34 }: { tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** El globo de WhatsApp, con su trazo oficial. */
export function LogoWhatsApp({ tam = 34, color = '#25D366' }: { tam?: number; color?: string }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path
        fill={color}
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
      />
    </svg>
  );
}

/**
 * Una plataforma sin logotipo propio: el nombre en su color de marca.
 *
 * Es lo correcto cuando no se tiene el archivo oficial. Un nombre bien puesto
 * comunica; un logotipo mal dibujado desprestigia.
 */
export function ChapaTexto({
  paleta,
  nombre,
  color,
  tam = 28,
}: {
  paleta: Paleta;
  nombre: string;
  color: string;
  tam?: number;
}) {
  return (
    <Chapa paleta={paleta} style={{ padding: '13px 24px' }}>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 12px ${conAlfa(color, 0.8)}`,
        }}
      />
      <span style={{ fontSize: tam, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
        {nombre}
      </span>
    </Chapa>
  );
}

/** Los colores de marca de las plataformas que salen sin logotipo propio. */
export const COLOR_MARCA = {
  meta: '#0866FF',
  shopify: '#95BF47',
  woocommerce: '#7F54B3',
  mercadolibre: '#FFE600',
  googleAds: '#4285F4',
} as const;
