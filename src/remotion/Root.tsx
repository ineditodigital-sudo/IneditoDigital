import { Composition } from 'remotion';
import { DURACION, LIENZO, OSCURA, PROPS_BASE } from './marca';
import { ESCENAS } from './registro';

/*
 * Lo que ve Remotion Studio y lo que renderiza `npx remotion render`.
 *
 * Se registra recorriendo el mismo mapa que usa el deck, así que no hay dos
 * listas que puedan desincronizarse: si una escena existe, se puede previsualizar
 * y se puede exportar a video.
 *
 *   npx remotion studio          para verlas y ajustar cuadro a cuadro
 *   npx remotion render web out/web.mp4     para sacar una en video
 */
export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(ESCENAS).map(([id, Escena]) => (
      <Composition
        key={id}
        id={id}
        component={Escena}
        durationInFrames={DURACION}
        fps={LIENZO.fps}
        width={LIENZO.ancho}
        height={LIENZO.alto}
        defaultProps={{ ...PROPS_BASE, paleta: OSCURA }}
      />
    ))}
  </>
);
