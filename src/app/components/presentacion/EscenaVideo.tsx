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
        Teléfono y tableta: la caja con marco, tan grande como deje el hueco.
        Quien la contiene es un size container que ocupa lo que sobra de la
        lámina, así que el ancho sale del menor de dos: todo el ancho, o el alto
        disponible por 1.6. Nunca desborda y nunca deja la escena chica si hay
        sitio.

        Escritorio: sin marco ni fondo, pegada al borde derecho de su columna
        —el mismo borde donde terminan las tarjetas— y del alto que permita la
        ventana. Antes sangraba hasta el borde de la pantalla y en monitores
        anchos quedaba corrida a la derecha, lejos del resto de la lámina.
      */
      className={[
        'relative aspect-[16/10] shrink-0 overflow-hidden',
        'w-[min(100cqw,calc(100cqh*1.6))] rounded-3xl border',
        'border-[color:var(--p-linea)] bg-[color:var(--p-caja)]',
        'lg:rounded-none lg:border-0 lg:bg-transparent',
        '[@media(min-width:1024px)_and_(min-height:821px)]:w-[min(100%,calc(50svh*1.6))]',
        '[@media(min-width:1024px)_and_(max-height:820px)]:w-[min(100%,calc((100svh-410px)*1.6))]',
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
