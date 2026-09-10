import { Player } from '@remotion/player';
import { CLARA, DURACION, LIENZO, OSCURA, type Idioma } from '../../../remotion/marca';
import { ESCENAS } from '../../../remotion/registro';

/*
 * La escena, tocada por el reproductor de Remotion.
 *
 * Esto vive en su propio archivo porque el deck lo carga en diferido: Remotion
 * y su reproductor pesan, y quien abre la carta de servicios no tiene por qué
 * esperarlos antes de ver la portada.
 *
 * El reproductor ESCALA la composición para que quepa en su caja. Ahí está la
 * ganancia grande frente a las escenas de antes: las de CSS se recortaban en
 * cuanto la caja se hacía baja —en un teléfono había que encogerlas a mano— y
 * esta se ve entera siempre, a cualquier tamaño, porque escalar un lienzo de
 * 1600x1000 es exactamente lo que hace.
 *
 * La paleta va como prop y no como variables CSS: así la misma composición
 * sirve dentro del deck (con su tema) y en `npx remotion render`, donde no
 * existe ninguna hoja de estilos del sitio.
 */
export default function EscenaVideoInterna({
  nombre,
  idioma,
  tema,
  quieto,
}: {
  nombre: string;
  idioma: Idioma;
  tema: 'oscuro' | 'claro';
  /** Con prefers-reduced-motion no se reproduce: se deja el último cuadro. */
  quieto: boolean;
}) {
  const Escena = ESCENAS[nombre];
  if (!Escena) return null;

  return (
    <Player
      component={Escena}
      inputProps={{ paleta: tema === 'oscuro' ? OSCURA : CLARA, idioma }}
      durationInFrames={DURACION}
      fps={LIENZO.fps}
      compositionWidth={LIENZO.ancho}
      compositionHeight={LIENZO.alto}
      /* Sin mandos ni clic: es una ilustración que se mueve, no un video que
         alguien vaya a pausar a media junta. */
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      loop={!quieto}
      autoPlay={!quieto}
      /* Quieto se queda en el último cuadro, que es donde cada escena cuenta su
         conclusión: nadie pierde información por no ver el movimiento. */
      initialFrame={quieto ? DURACION - 1 : 0}
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%' }}
    />
  );
}
