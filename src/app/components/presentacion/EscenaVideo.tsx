import { Suspense, lazy, useEffect, useState } from 'react';
import type { Idioma } from '../../../remotion/marca';

/*
 * La escena dentro del deck.
 *
 * Dos formas según el tamaño, y la diferencia es de fondo:
 *
 * En TELÉFONO va en una caja con marco y redondeo, tan ancha como permita el
 * alto de la ventana. Ahí compite con el nombre y tres tarjetas, así que tiene
 * que ocupar un sitio acotado y reconocible.
 *
 * En ESCRITORIO sale del recuadro. Pierde el marco, pierde el fondo y se
 * extiende hasta el borde de la ventana con un margen negativo, para que sus
 * resplandores se mezclen con los de la lámina. Deja de ser una ilustración
 * pegada al lado y pasa a ser parte de la diapositiva.
 *
 * El fondo transparente hay que pedírselo a la composición, no taparlo desde
 * fuera: por eso `sangrado` viaja como prop hasta el Escenario. Se decide con
 * matchMedia y no con una clase porque React necesita saberlo.
 */

const Interna = lazy(() => import('./EscenaVideoInterna'));

/** ¿Estamos en la disposición de escritorio? El corte es el `lg` de Tailwind. */
function useEscritorio() {
  const [si, setSi] = useState(() =>
    typeof matchMedia === 'function' ? matchMedia('(min-width: 1024px)').matches : false,
  );
  useEffect(() => {
    const mq = matchMedia('(min-width: 1024px)');
    const alCambiar = () => setSi(mq.matches);
    mq.addEventListener('change', alCambiar);
    return () => mq.removeEventListener('change', alCambiar);
  }, []);
  return si;
}

export default function EscenaVideo({
  nombre,
  idioma,
  tema,
  quieto,
}: {
  nombre: string;
  idioma: Idioma;
  tema: 'oscuro' | 'claro';
  quieto: boolean;
}) {
  const escritorio = useEscritorio();

  return (
    <div
      /*
        En teléfono el ancho lo manda el ALTO de la ventana: 22svh por 1.6 de
        proporción. Así la escena encoge sola en un teléfono corto y el nombre,
        la descripción y las tarjetas siempre caben. En escritorio se sueltan el
        tope, el marco y el fondo.
      */
      className={[
        'relative mx-auto aspect-[16/10] w-full overflow-hidden',
        'max-w-[min(100%,calc(22svh*1.6))] rounded-3xl border',
        'border-[color:var(--p-linea)] bg-[color:var(--p-caja)]',
        /*
          En escritorio el tope es de ALTO, y en dos tramos que no se pisan.

          En pantallas bajas (una laptop de 1280x720 o 1366x768) la escena
          cede lo que haga falta para que las tarjetas quepan CON su
          explicación: 410 px es lo que ocupan encabezado, pie y la fila de
          tarjetas más alta del guion, medido. Ocultar la explicación era la
          salida fácil y dejaba las tarjetas en puro título justo en la
          pantalla donde más se va a presentar.

          El reproductor encaja el lienzo dentro de la caja, así que acotarla
          solo le quita aire alrededor; nunca recorta la escena.
        */
        'lg:max-w-none lg:rounded-none lg:border-0 lg:bg-transparent',
        '[@media(min-width:1024px)_and_(min-height:821px)]:max-h-[50svh]',
        '[@media(min-width:1024px)_and_(max-height:820px)]:max-h-[calc(100svh-410px)]',
      ].join(' ')}
    >
      {/* Mientras baja el reproductor queda la caja vacía, no un hueco que
          salte: la caja ya ocupa su sitio y el contenido aparece dentro. */}
      <Suspense fallback={null}>
        <Interna
          nombre={nombre}
          idioma={idioma}
          tema={tema}
          quieto={quieto}
          sangrado={escritorio}
        />
      </Suspense>
    </div>
  );
}
