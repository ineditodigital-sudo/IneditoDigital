import { useEffect, useRef, useState } from 'react';
import { useIdioma, type Idioma } from '../idioma';

/*
 * El interruptor de idioma.
 *
 * Dos letras y una pastilla que se desliza. Sin banderas: una bandera es un
 * país, no un idioma, y el inglés del sitio no es de nadie en particular.
 * Tampoco un globo terráqueo al lado, que solo repetiría lo que ya dicen las
 * letras.
 *
 * El detalle que importa: al pulsar, la pastilla se desliza ANTES de cambiar
 * el idioma. Cambiar de idioma vuelve a montar la página, y ese montaje deja
 * la pastilla ya en su lugar; si el deslizamiento no fuera primero, el control
 * jamás se vería moverse y el clic se sentiría muerto.
 */

const RETARDO = 180;   // lo que tarda el deslizamiento antes del cambio

export default function CambioIdioma({ compacto = false }: { compacto?: boolean }) {
  const { idioma, cambiar } = useIdioma();

  /* El idioma que la pastilla ya está mostrando, que durante esos 180 ms va
     por delante del idioma real de la página. */
  const [pintado, setPintado] = useState<Idioma>(idioma);
  const reloj = useRef<number | null>(null);

  useEffect(() => () => { if (reloj.current) window.clearTimeout(reloj.current); }, []);

  const pulsar = (destino: Idioma) => {
    if (destino === pintado) return;
    setPintado(destino);
    if (reloj.current) window.clearTimeout(reloj.current);
    reloj.current = window.setTimeout(() => cambiar(destino), RETARDO);
  };

  const alto = compacto ? 28 : 30;
  const ancho = compacto ? 32 : 36;

  return (
    <div
      role="group"
      aria-label={idioma === 'en' ? 'Language' : 'Idioma'}
      className="relative inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] p-[2px] transition-colors hover:border-white/25"
      style={{ height: alto }}
    >
      {/* La pastilla. Va detrás de las letras y se mueve con transform, que es
          lo único que el navegador puede animar sin volver a maquetar. */}
      <span
        aria-hidden
        className="absolute left-[2px] top-[2px] rounded-full bg-[#7700CE]"
        style={{
          width: ancho,
          height: alto - 4,
          transform: `translateX(${pintado === 'en' ? ancho : 0}px)`,
          transition: 'transform 200ms cubic-bezier(.23,1,.32,1)',
        }}
      />
      {(['es', 'en'] as const).map((v) => (
        <button
          key={v}
          type="button"
          lang={v}
          onClick={() => pulsar(v)}
          aria-pressed={pintado === v}
          className={[
            'relative z-10 font-mono text-[10.5px] font-semibold uppercase tracking-[.1em]',
            'transition-colors duration-200 active:scale-[.94]',
            pintado === v ? 'text-white' : 'text-white/45 hover:text-white/75',
          ].join(' ')}
          style={{ width: ancho, height: alto - 4, transitionProperty: 'color, transform' }}
        >
          {v === 'es' ? 'ES' : 'EN'}
        </button>
      ))}
    </div>
  );
}
