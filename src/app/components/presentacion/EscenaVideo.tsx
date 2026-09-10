import { Suspense, lazy } from 'react';
import type { Idioma } from '../../../remotion/marca';

/*
 * El marco de la escena, y la carga en diferido de Remotion.
 *
 * El marco se queda aquí y no dentro de la composición a propósito: el borde y
 * el redondeo son del deck, no del video. Cuando una escena se exporte a MP4
 * para redes tiene que salir a sangre, sin la caja del deck alrededor.
 *
 * Una sola proporción, 16:10, en teléfono y en proyector. Antes eran dos —4:3
 * arriba y 16:10 abajo— y esa era la razón de que hubiera que recortar: ahora
 * el reproductor escala y no sobra ni falta nada.
 */

const Interna = lazy(() => import('./EscenaVideoInterna'));

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
  return (
    <div
      /*
        En telefono el ancho lo manda el ALTO de la ventana, no el de la
        pantalla: 23svh de alto por 1.6 de proporcion. Asi la escena encoge sola
        en un telefono corto y el nombre, la descripcion y las tres tarjetas
        siempre caben. Se limita el ancho y no el alto para no romper el 16:10 y
        que el reproductor no tenga que poner franjas. Va en clase y no en
        estilo porque un estilo en linea no lo podria levantar el breakpoint.
      */
      className="relative mx-auto aspect-[16/10] w-full max-w-[min(100%,calc(23svh*1.6))] overflow-hidden rounded-3xl border lg:max-w-none"
      style={{ borderColor: 'var(--p-linea)', background: 'var(--p-caja)' }}
    >
      {/* Mientras baja el reproductor queda la caja vacía, no un hueco que
          salte: la caja ya ocupa su sitio y el contenido aparece dentro. */}
      <Suspense fallback={null}>
        <Interna nombre={nombre} idioma={idioma} tema={tema} quieto={quieto} />
      </Suspense>
    </div>
  );
}
