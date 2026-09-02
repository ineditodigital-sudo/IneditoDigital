/*
 * Los logotipos de los modelos de IA que el sitio nombra.
 *
 * Regla del proyecto: cuando se menciona ChatGPT, Claude, Gemini o Perplexity,
 * aparece su marca, no solo el nombre en texto.
 *
 * Son los logotipos reales, no dibujos aproximados. Vienen en BLANCO porque
 * los originales son oscuros —estan hechos para fondo claro— y sobre el negro
 * del sitio no se verian. Es el tratamiento que las propias marcas preven para
 * fondos oscuros, y ademas deja la fila coherente en vez de mezclar cinco
 * paletas ajenas.
 *
 * Se generan con scripts/logos-ia.py desde los originales de marca/.
 */

type Props = { alto?: number; className?: string };

type Marca = { archivo: string; nombre: string; proporcion: number };

/* La proporcion evita que el navegador los deforme o de saltos al cargar. */
export const MARCAS_IA: Record<string, Marca> = {
  openai:     { archivo: 'openai',     nombre: 'ChatGPT',    proporcion: 3.427 },
  claude:     { archivo: 'claude',     nombre: 'Claude',     proporcion: 4.635 },
  gemini:     { archivo: 'gemini',     nombre: 'Gemini',     proporcion: 4.438 },
  perplexity: { archivo: 'perplexity', nombre: 'Perplexity', proporcion: 4.156 },
  copilot:    { archivo: 'copilot',    nombre: 'Copilot',    proporcion: 4.292 },
};

export function LogoIA({ marca, alto = 24, className = '' }: Props & { marca: keyof typeof MARCAS_IA }) {
  const m = MARCAS_IA[marca];
  if (!m) return null;
  return (
    <img
      src={`/logos-ia/${m.archivo}.webp`}
      alt={m.nombre}
      width={Math.round(alto * m.proporcion)}
      height={alto}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ height: alto, width: 'auto' }}
    />
  );
}

/** Resuelve la marca a partir del texto que hay escrito en el panel. */
export function marcaPorNombre(texto: string): keyof typeof MARCAS_IA | null {
  const n = texto.toLowerCase();
  if (n.includes('chatgpt') || n.includes('openai')) return 'openai';
  if (n.includes('claude') || n.includes('anthropic')) return 'claude';
  if (n.includes('gemini')) return 'gemini';
  if (n.includes('perplexity')) return 'perplexity';
  if (n.includes('copilot')) return 'copilot';
  return null;
}

/** Fila compacta con las cuatro marcas principales, para listas en texto. */
export function FranjaLogosIA({ alto = 20, className = '' }: Props) {
  return (
    <span
      className={`inline-flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}
      aria-label="ChatGPT, Claude, Gemini y Perplexity"
    >
      {(['openai', 'claude', 'gemini', 'perplexity'] as const).map((k) => (
        <LogoIA key={k} marca={k} alto={alto} className="opacity-70 transition-opacity hover:opacity-100" />
      ))}
    </span>
  );
}
