import { useState } from 'react';

/**
 * La portada de un artículo.
 *
 * Ocho de los quince artículos no tienen imagen, y la tarjeta pintaba un
 * `<img>` con la fuente vacía: el hueco roto del navegador. Cuando no hay
 * foto, aquí se dibuja una en movimiento con el degradado de la casa, en
 * lugar de dejar el marco vacío o inventar una foto de banco que no dice
 * nada del texto.
 *
 * No lleva la inicial del título: una letra dentro de un cuadro es el recurso
 * de siempre y no aporta.
 *
 * Cada artículo sale distinto pero SIEMPRE igual a sí mismo: los colores y
 * las posiciones salen del slug, no del azar. Un fondo que cambia en cada
 * carga se ve como un error.
 */

/** Un número estable a partir del texto, entre 0 y 1. */
function semilla(txt: string, corrimiento = 0): number {
  let h = 2166136261 ^ corrimiento;
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export default function PortadaArticulo({
  imagen,
  titulo,
  slug,
  className = '',
}: {
  imagen?: string;
  titulo: string;
  slug: string;
  className?: string;
}) {
  const [fallo, setFallo] = useState(false);
  const hayFoto = Boolean(imagen && imagen.trim() !== '') && !fallo;

  if (hayFoto) {
    return (
      <img
        src={imagen}
        alt={titulo}
        loading="lazy"
        onError={() => setFallo(true)}
        className={className}
      />
    );
  }

  /* Tres manchas de luz. La primera siempre es el morado de la marca para que
     todas las portadas se reconozcan como del mismo sitio; las otras dos se
     mueven dentro de la gama. */
  const a = semilla(slug, 1);
  const b = semilla(slug, 2);
  const c = semilla(slug, 3);
  const tono = 268 + Math.round(b * 42) - 21; // alrededor del morado de la casa

  return (
    <div
      className={`portada-viva relative overflow-hidden ${className}`}
      role="img"
      aria-label={titulo}
      style={{ background: '#0B0A12' }}
    >
      <span
        className="portada-mancha"
        style={{
          background: 'radial-gradient(circle, rgba(140,20,235,1), rgba(119,0,206,0) 66%)',
          width: '105%', height: '155%',
          left: `${-18 + a * 26}%`, top: `${-46 + a * 22}%`,
          animationDuration: `${17 + Math.round(a * 9)}s`,
        }}
      />
      <span
        className="portada-mancha portada-mancha--2"
        style={{
          background: `radial-gradient(circle, hsla(${tono}, 100%, 62%, .95), hsla(${tono}, 100%, 66%, 0) 60%)`,
          width: '85%', height: '135%',
          left: `${34 + b * 30}%`, top: `${-12 + b * 34}%`,
          animationDuration: `${21 + Math.round(b * 11)}s`,
        }}
      />
      <span
        className="portada-mancha portada-mancha--3"
        style={{
          background: 'radial-gradient(circle, rgba(214,124,255,.8), rgba(204,102,255,0) 62%)',
          width: '70%', height: '110%',
          left: `${6 + c * 52}%`, top: `${26 + c * 26}%`,
          animationDuration: `${25 + Math.round(c * 10)}s`,
        }}
      />
      {/* La retícula de puntos de la portada del sitio, para que la pieza
          pertenezca a la marca y no parezca un degradado cualquiera. */}
      <span
        aria-hidden
        className="absolute inset-0 opacity-[.22]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Una vinieta muy leve en la esquina inferior, para que la portada
          asiente sobre la tarjeta y no flote. Nada mas: encima no va texto,
          asi que oscurecerla entera solo la apagaba. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 30% 10%, transparent 40%, rgba(9,8,15,.55))' }}
      />
    </div>
  );
}
