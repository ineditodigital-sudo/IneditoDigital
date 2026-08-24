import { ReactNode } from 'react';

/*
 * Los logotipos de los modelos de IA que el sitio nombra.
 *
 * Regla del proyecto: cuando se menciona ChatGPT, Claude, Gemini o Perplexity,
 * aparece su marca, no solo el nombre en texto. Van en SVG inline y en
 * monocromo (heredan currentColor): asi respetan el tema del sitio y no
 * convierten cada lista en un arcoiris de marcas ajenas.
 *
 * Son trazados geometricos simplificados de las marcas publicas, uso
 * referencial (decir "trabajamos para que ChatGPT te encuentre" requiere
 * poder nombrar a ChatGPT).
 */

type Props = { size?: number; className?: string };

/** OpenAI / ChatGPT: el nudo hexagonal. */
export function LogoOpenAI({ size = 20, className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.2a4.2 4.2 0 0 1 3.9 2.6 4.2 4.2 0 0 1 4 6.6 4.2 4.2 0 0 1-3.1 6.9 4.2 4.2 0 0 1-7.7 1 4.2 4.2 0 0 1-4-6.6 4.2 4.2 0 0 1 3.1-6.9A4.2 4.2 0 0 1 12 3.2Z" />
      <path d="m8.6 9.4 6.8 3.9v4M15.4 9l-6.8 3.9" />
    </svg>
  );
}

/** Claude / Anthropic: el estallido radial. */
export function LogoClaude({ size = 20, className = '' }: Props) {
  const rayos = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {rayos.map((a) => (
        <line
          key={a}
          x1={12 + 4.2 * Math.cos((a * Math.PI) / 180)}
          y1={12 + 4.2 * Math.sin((a * Math.PI) / 180)}
          x2={12 + (a % 90 === 0 ? 9.5 : 7.6) * Math.cos((a * Math.PI) / 180)}
          y2={12 + (a % 90 === 0 ? 9.5 : 7.6) * Math.sin((a * Math.PI) / 180)}
        />
      ))}
    </svg>
  );
}

/** Gemini: el destello de cuatro puntas. */
export function LogoGemini({ size = 20, className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 5.5 4.5 9.4 10 10-5.5.6-9.4 4.5-10 10-.6-5.5-4.5-9.4-10-10 5.5-.6 9.4-4.5 10-10Z" />
    </svg>
  );
}

/** Perplexity: el rombo de lineas entrelazadas. */
export function LogoPerplexity({ size = 20, className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5v19M12 8 5 3.5v6L12 14l7-4.5v-6L12 8ZM5 14.5v6L12 16l7 4.5v-6" />
    </svg>
  );
}

/** Copilot / Microsoft: la cinta doble. */
export function LogoCopilot({ size = 20, className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9.5C4.7 6.6 6 5 8.2 5c2.4 0 3.2 1.8 3.8 4.2.6-2.4 1.4-4.2 3.8-4.2 2.2 0 3.5 1.6 4.2 4.5M20 14.5c-.7 2.9-2 4.5-4.2 4.5-2.4 0-3.2-1.8-3.8-4.2-.6 2.4-1.4 4.2-3.8 4.2-2.2 0-3.5-1.6-4.2-4.5" />
    </svg>
  );
}

/** Google (AI Overviews): el destello propio de Google AI. */
export function LogoGoogleAI({ size = 20, className = '' }: Props) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 4c.5 4 3.5 7 7.5 7.5-4 .5-7 3.5-7.5 7.5-.5-4-3.5-7-7.5-7.5C8.5 11 11.5 8 12 4Z" />
      <circle cx="19" cy="5" r="2" />
    </svg>
  );
}

/** Devuelve el logo que corresponde a un nombre escrito en el panel. */
export function logoPorNombre(nombre: string): ((p: Props) => ReactNode) | null {
  const n = nombre.toLowerCase();
  if (n.includes('chatgpt') || n.includes('openai')) return LogoOpenAI;
  if (n.includes('claude') || n.includes('anthropic')) return LogoClaude;
  if (n.includes('gemini')) return LogoGemini;
  if (n.includes('perplexity')) return LogoPerplexity;
  if (n.includes('copilot')) return LogoCopilot;
  if (n.includes('overview') || n.includes('google')) return LogoGoogleAI;
  return null;
}

/** Franja compacta con las cuatro marcas principales, para listas en texto. */
export function FranjaLogosIA({ size = 16, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="ChatGPT, Claude, Gemini y Perplexity">
      <LogoOpenAI size={size} />
      <LogoClaude size={size} />
      <LogoGemini size={size} />
      <LogoPerplexity size={size} />
    </span>
  );
}
