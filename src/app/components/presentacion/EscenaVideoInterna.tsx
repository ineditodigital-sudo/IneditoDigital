import { Player, type PlayerRef } from '@remotion/player';
import { useEffect, useRef } from 'react';
import { CLARA, DURACION, LIENZO, OSCURA, type Idioma } from '../../../remotion/marca';
import { ESCENAS } from '../../../remotion/registro';

/*
 * La escena, tocada por el reproductor de Remotion.
 *
 * Vive en su propio archivo porque el deck lo carga en diferido: Remotion y su
 * reproductor pesan, y quien abre la carta de servicios no tiene por qué
 * esperarlos antes de ver la portada.
 *
 * El reproductor ESCALA la composición para que quepa en su caja. Ahí está la
 * ganancia grande frente a las escenas de CSS: aquellas se recortaban en cuanto
 * la caja se hacía baja y había que encogerlas a mano; esta se ve entera
 * siempre, porque escalar un lienzo de 1600x1000 es exactamente lo que hace.
 *
 * La paleta va como prop y no como variables CSS: así la misma composición
 * sirve dentro del deck (con su tema) y en `npm run video`, donde no existe
 * ninguna hoja de estilos del sitio.
 */
export default function EscenaVideoInterna({
  nombre,
  idioma,
  tema,
  quieto,
  sangrado,
}: {
  nombre: string;
  idioma: Idioma;
  tema: 'oscuro' | 'claro';
  /** Con prefers-reduced-motion no se reproduce: se deja el último cuadro. */
  quieto: boolean;
  /** Sin fondo propio, para fundirse con la lámina. */
  sangrado?: boolean;
}) {
  const ref = useRef<PlayerRef>(null);

  /*
   * El arranque, a mano y no con autoPlay.
   *
   * Con `autoPlay` el reproductor se quedaba clavado en el cuadro CERO: decía
   * estar reproduciendo —isPlaying devolvía true— pero su reloj no avanzaba
   * nunca, y el cuadro cero es justo el que todavía no ha dibujado nada. En una
   * junta eso se ve como una caja vacía al lado del servicio, que es como
   * estuvo hasta que se midió cuadro a cuadro.
   *
   * Un seekTo antes del play sí lo pone en marcha. Va dentro de un
   * requestAnimationFrame para que ocurra con el reproductor ya montado y
   * medido, no a mitad del primer render.
   */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const p = ref.current;
      if (!p) return;
      if (quieto) {
        /* Sin movimiento se deja el último cuadro, que es donde cada escena
           cuenta su conclusión: nadie pierde información por no ver el baile. */
        p.seekTo(DURACION - 1);
        p.pause();
        return;
      }
      p.seekTo(0);
      p.play();
    });
    return () => cancelAnimationFrame(id);
  }, [nombre, quieto]);

  const Escena = ESCENAS[nombre];
  if (!Escena) return null;

  return (
    <Player
      ref={ref}
      component={Escena}
      inputProps={{ paleta: tema === 'oscuro' ? OSCURA : CLARA, idioma, sangrado }}
      durationInFrames={DURACION}
      fps={LIENZO.fps}
      compositionWidth={LIENZO.ancho}
      compositionHeight={LIENZO.alto}
      /* Sin mandos ni clic: es una ilustración que se mueve, no un video que
         alguien vaya a pausar a media junta. */
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      loop={!quieto}
      initiallyMuted
      acknowledgeRemotionLicense
      style={{ width: '100%', height: '100%' }}
    />
  );
}
