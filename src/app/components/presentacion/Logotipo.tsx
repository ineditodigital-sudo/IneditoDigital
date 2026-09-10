/*
 * El logo de Inédito, dibujado.
 *
 * El archivo de marca (media/inedito-logo.png) trae el texto en blanco, así que
 * en el tema claro del deck desaparecería. Aquí el isotipo va en SVG —el
 * semicírculo morado con su mordida y el cuarto gris, medidos del original— y
 * la palabra se compone con la display de la casa sobre var(--p-tinta). Con eso
 * el mismo logo sirve en oscuro y en claro sin mantener dos imágenes, se ve
 * nítido a cualquier tamaño y no cuesta una petición de red.
 *
 * Las proporciones salen del PNG: radio exterior 50, interior 33.33 (dos
 * tercios), morado #7700CE y gris #B7B7B7.
 */

const MORADO = '#7700CE';
const GRIS = '#B7B7B7';

/** Solo la marca, sin palabra. Sirve de favicon del deck y de sello suelto. */
export function Isotipo({ tam = 28, className = '' }: { tam?: number; className?: string }) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* el semicírculo izquierdo, con el cuarto de abajo mordido */}
      <path
        d="M50,0 A50,50 0 0 0 50,100 Z M50,50 L16.667,50 A33.333,33.333 0 0 0 50,83.333 Z"
        fill={MORADO}
        fillRule="evenodd"
      />
      {/* el cuarto gris, abajo a la derecha */}
      <path d="M50,50 L83.333,50 A33.333,33.333 0 0 1 50,83.333 Z" fill={GRIS} />
    </svg>
  );
}

/**
 * La marca completa: isotipo y palabra.
 *
 * `escala` multiplica todo a la vez para que la esquina y el cierre usen el
 * mismo lockup y no dos versiones que se desalinean cuando alguien toque una.
 */
export default function Logotipo({
  escala = 1,
  className = '',
  bajada = true,
}: {
  escala?: number;
  className?: string;
  /** El «agencia digital» de abajo. En la esquina estorba; en el cierre no. */
  bajada?: boolean;
}) {
  const tam = Math.round(30 * escala);

  return (
    /* Sin display propio: quien lo coloca decide si va inline-flex o se
       esconde por breakpoint. Traerlo puesto chocaba con un `hidden` de
       fuera y salian los dos logos a la vez. */
    <span className={`items-center ${className}`} style={{ gap: 10 * escala }}>
      <Isotipo tam={tam} />
      <span className="flex flex-col justify-center" style={{ gap: 2 * escala }}>
        <span
          className="heading leading-none"
          style={{ fontSize: 20 * escala, letterSpacing: 0.5 * escala, color: 'var(--p-tinta)' }}
        >
          INÉDITO
        </span>
        {bajada && (
          <span
            className="font-mono uppercase leading-none"
            style={{
              fontSize: 7.5 * escala,
              letterSpacing: 2.4 * escala,
              color: 'var(--p-mudo)',
            }}
          >
            agencia digital
          </span>
        )}
      </span>
    </span>
  );
}
