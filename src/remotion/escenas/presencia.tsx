import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { dice, SAL, type PropsEscena } from '../marca';
import {
  BarraLuz,
  Cifra,
  conAlfa,
  Destello,
  Escenario,
  Palomita,
  Remate,
  Resplandor,
  Rotulo,
  Vidrio,
} from '../piezas';

/*
 * Presencia: el sitio, el buscador y el mapa.
 *
 * Las tres cuentan lo mismo en tres puertas distintas: alguien te busca y algo
 * decide si te encuentra. Cada una tiene tres tiempos y se solapan a propósito
 * —una pieza empieza antes de que la anterior termine— porque una secuencia en
 * la que cada cosa espera su turno se siente lenta aunque dure lo mismo.
 *
 * Y ninguna se queda quieta entre gesto y gesto: los resplandores del fondo
 * respiran y los halos laten. Un cuadro congelado es lo que hacía que esto
 * pareciera una lista de comandos ejecutándose.
 */

const sal = Easing.bezier(...SAL);

const entra = (frame: number, desde: number, dur = 18) => ({
  opacity: interpolate(frame, [desde, desde + dur], [0, 1], {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: sal,
  }),
  translate: interpolate(frame, [desde, desde + dur], [34, 0], {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: sal,
  }),
});

/** El vaivén lento del fondo y de los halos. Nunca se queda plano. */
const aliento = (frame: number, periodo = 90) => (Math.sin((frame / periodo) * Math.PI * 2) + 1) / 2;

/* ═══════════════════════════════ 01 · Sitios web: la página se arma y se mide */

export const EscenaWeb: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  /* Las medidas están calculadas para que los cuatro bloques quepan dentro del
     navegador sin recortarse: 4 x 46 + hero + huecos + relleno tiene que caber
     en lo que deja la banda de en medio menos la fila de la medición. */
  const bloques = [
    { alto: 44, ancho: '32%', desde: 20 },
    { alto: 102, ancho: '100%', desde: 28, hero: true },
    { alto: 44, ancho: '64%', desde: 36 },
    { alto: 44, ancho: '46%', desde: 44 },
  ];

  const segundos = interpolate(frame, [74, 102], [0, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Tu sitio, armándose', 'Your site, assembling')}</Rotulo>}
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [106, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color="#fff" />
          {d('Listo para leerse: 1.1 s', 'Ready to read: 1.1 s')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 46, height: '100%' }}>
        {/* la luz que el navegador derrama sobre el fondo */}
        <Resplandor
          color={paleta.morado}
          tam={900}
          opacidad={0.3 + resp * 0.14}
          style={{ left: '50%', top: -200, translate: '-50% 0' }}
        />

        {/* el navegador, como objeto */}
        <Vidrio paleta={paleta} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '24px 30px',
              borderBottom: `1px solid ${conAlfa(paleta.tinta, 0.1)}`,
              opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ width: 15, height: 15, borderRadius: 999, background: conAlfa(paleta.tinta, 0.22) }}
              />
            ))}
            <span
              style={{
                marginLeft: 20,
                flex: 1,
                height: 38,
                borderRadius: 999,
                background: conAlfa(paleta.tinta, 0.07),
                boxShadow: `inset 0 1px 2px ${conAlfa(paleta.sombra, 0.5)}`,
                display: 'flex',
                alignItems: 'center',
                paddingInline: 22,
                fontSize: 23,
                color: paleta.mudo,
              }}
            >
              inedito.digital
            </span>
          </div>

          <div style={{ flex: 1, padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
            {bloques.map((b, i) => {
              const e = entra(frame, b.desde);
              return (
                <div
                  key={i}
                  style={{
                    height: b.alto,
                    width: b.ancho,
                    borderRadius: 16,
                    background: b.hero
                      ? `linear-gradient(120deg, ${conAlfa(paleta.morado, 0.6)}, ${conAlfa(paleta.acento, 0.32)})`
                      : `linear-gradient(160deg, ${conAlfa(paleta.tinta, 0.14)}, ${conAlfa(paleta.tinta, 0.05)})`,
                    boxShadow: b.hero ? `0 0 46px ${conAlfa(paleta.morado, 0.35 + resp * 0.16)}` : 'none',
                    opacity: e.opacity,
                    translate: `0 ${e.translate}px`,
                  }}
                />
              );
            })}
          </div>
        </Vidrio>

        {/* la medida: un número grande, no una etiqueta */}
        <div style={{ opacity: interpolate(frame, [66, 82], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
            <span style={{ fontSize: 34, color: paleta.suave }}>
              {d('Tiempo hasta que se puede leer', 'Time until it can be read')}
            </span>
            <Cifra color={paleta.verde} color2={paleta.verde2} tam={72}>
              {segundos.toFixed(1)}s
            </Cifra>
          </div>
          <BarraLuz
            paleta={paleta}
            valor={interpolate(frame, [74, 102], [0, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}
            color={paleta.verde}
            color2={paleta.verde2}
            alto={24}
          />
        </div>
      </div>
    </Escenario>
  );
};

/* ═══════════════════════════ 02 · Posicionamiento: la respuesta te nombra */

export const EscenaPosicionamiento: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  const revelado = interpolate(frame, [42, 94], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const marca = interpolate(frame, [88, 104], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  /* El destello cruza la respuesta justo cuando se enciende el nombre. */
  const brillo = interpolate(frame, [90, 124], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const preg = entra(frame, 6);

  return (
    <Escenario
      paleta={paleta}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Alguien le pregunta a una IA', 'Someone asks an AI')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [108, 126], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color="#fff" />
          {d('Tu marca, dentro de la respuesta', 'Your brand, inside the answer')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 36, height: '100%', justifyContent: 'center' }}>
        {/* la pregunta */}
        <Vidrio
          paleta={paleta}
          style={{
            alignSelf: 'flex-end',
            maxWidth: '74%',
            padding: '28px 36px',
            borderRadius: 34,
            borderBottomRightRadius: 10,
            opacity: preg.opacity,
            translate: `0 ${preg.translate}px`,
          }}
        >
          <span style={{ fontSize: 42, color: paleta.tinta, lineHeight: 1.35 }}>
            {d(
              '¿Qué agencia de marketing me recomiendas en Aguascalientes?',
              'Which marketing agency would you recommend in Aguascalientes?',
            )}
          </span>
        </Vidrio>

        {/* la respuesta, revelándose y encendiéndose */}
        <Vidrio
          paleta={paleta}
          activa={marca > 0.2}
          halo={marca}
          style={{
            maxWidth: '90%',
            padding: '32px 38px',
            borderRadius: 34,
            borderBottomLeftRadius: 10,
            overflow: 'hidden',
            opacity: interpolate(frame, [36, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          {brillo > 0 && brillo < 1 && <Destello avance={brillo} />}
          <div style={{ position: 'relative', display: 'flex', gap: 22, alignItems: 'flex-start' }}>
            <span
              style={{
                width: 58,
                height: 58,
                flexShrink: 0,
                borderRadius: 17,
                display: 'grid',
                placeItems: 'center',
                fontSize: 25,
                fontWeight: 700,
                color: '#fff',
                background: `linear-gradient(140deg, ${paleta.morado}, ${paleta.acento})`,
                boxShadow: `0 0 26px ${conAlfa(paleta.morado, 0.6)}`,
              }}
            >
              IA
            </span>
            <span
              style={{
                fontSize: 42,
                color: paleta.suave,
                lineHeight: 1.42,
                clipPath: `inset(0 ${100 - revelado}% 0 0)`,
              }}
            >
              {d('Para marketing medible en Aguascalientes te recomiendo ', 'For measurable marketing in Aguascalientes I would recommend ')}
              <span
                style={{
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 12,
                  padding: '4px 12px',
                  background:
                    marca > 0
                      ? `linear-gradient(120deg, ${paleta.morado}, ${paleta.morado2})`
                      : 'transparent',
                  boxShadow: marca > 0 ? `0 0 ${30 * marca}px ${conAlfa(paleta.morado, 0.7 * marca)}` : 'none',
                  opacity: 0.45 + marca * 0.55,
                }}
              >
                Inédito Digital
              </span>
              {d(', que mide cada canal hasta la venta.', ', which measures every channel through to the sale.')}
            </span>
          </div>
        </Vidrio>
      </div>
    </Escenario>
  );
};

/* ═════════════════════════════ 03 · Ficha de Google: el mapa decide primero */

export const EscenaLocal: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  const ALTO = 156;
  const HUECO = 26;
  const fichas = [
    { n: d('Competencia A', 'Competitor A'), e: '4.2', r: 41, de: 0, a: 1, tuyo: false },
    { n: d('Competencia B', 'Competitor B'), e: '3.8', r: 12, de: 1, a: 2, tuyo: false },
    { n: d('Tu negocio', 'Your business'), e: '4.9', r: 128, de: 2, a: 0, tuyo: true },
  ];

  const orden = interpolate(frame, [58, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const brillo = interpolate(frame, [86, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Búsqueda local · el bloque del mapa', 'Local search · the map block')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [102, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color="#fff" />
          {d('Los tres del mapa salen antes que todo', 'The map three show above everything')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', gap: 42, height: '100%', alignItems: 'stretch' }}>
        {/* el mapa */}
        <Vidrio paleta={paleta} style={{ width: '40%', position: 'relative', overflow: 'hidden' }}>
          {[0.26, 0.54, 0.8].map((p, i) => (
            <div
              key={`h${i}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${p * 100}%`,
                height: 5,
                background: conAlfa(paleta.tinta, 0.1),
                opacity: interpolate(frame, [i * 5, i * 5 + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            />
          ))}
          {[0.32, 0.68].map((p, i) => (
            <div
              key={`v${i}`}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${p * 100}%`,
                width: 5,
                background: conAlfa(paleta.tinta, 0.1),
                opacity: interpolate(frame, [8 + i * 5, 26 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            />
          ))}

          {/* ondas saliendo del alfiler: la ficha emitiendo, no un punto puesto */}
          {[0, 1, 2].map((i) => {
            const t = ((frame + i * 20) % 60) / 60;
            return (
              <span
                key={`onda${i}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '52%',
                  width: 60 + t * 230,
                  height: 60 + t * 230,
                  translate: '-50% -50%',
                  borderRadius: 999,
                  border: `2px solid ${conAlfa(paleta.morado, (1 - t) * 0.5)}`,
                  opacity: interpolate(frame, [36, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}
              />
            );
          })}

          {[
            { x: 32, y: 24, mio: false, desde: 24 },
            { x: 68, y: 80, mio: false, desde: 30 },
            { x: 50, y: 52, mio: true, desde: 36 },
          ].map((a, i) => {
            const e = interpolate(frame, [a.desde, a.desde + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: sal,
            });
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${a.x}%`,
                  top: `${a.y}%`,
                  width: a.mio ? 50 : 30,
                  height: a.mio ? 50 : 30,
                  marginLeft: a.mio ? -25 : -15,
                  marginTop: a.mio ? -25 : -15,
                  borderRadius: 999,
                  background: a.mio
                    ? `linear-gradient(140deg, ${paleta.morado}, ${paleta.morado2})`
                    : conAlfa(paleta.tinta, 0.28),
                  boxShadow: a.mio ? `0 0 ${28 + resp * 20}px ${conAlfa(paleta.morado, 0.85)}` : 'none',
                  opacity: e,
                  scale: String(e),
                }}
              />
            );
          })}
        </Vidrio>

        {/* los tres resultados */}
        <div style={{ flex: 1, position: 'relative' }}>
          {fichas.map((f, i) => {
            const puesto = interpolate(orden, [0, 1], [f.de, f.a]);
            const ent = entra(frame, 40 + i * 6);
            const suyo = f.tuyo && orden > 0.4;
            return (
              <Vidrio
                key={f.n}
                paleta={paleta}
                activa={suyo}
                halo={orden}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: ALTO,
                  padding: '0 34px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  overflow: 'hidden',
                  opacity: ent.opacity * (f.tuyo ? 1 : interpolate(orden, [0, 1], [1, 0.6])),
                  translate: `0 ${puesto * (ALTO + HUECO) + ent.translate}px`,
                }}
              >
                {suyo && brillo > 0 && brillo < 1 && <Destello avance={brillo} />}
                <span
                  style={{
                    position: 'relative',
                    width: 54,
                    height: 54,
                    flexShrink: 0,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 28,
                    fontWeight: 700,
                    color: suyo ? '#fff' : paleta.mudo,
                    background: suyo
                      ? `linear-gradient(140deg, ${paleta.morado}, ${paleta.morado2})`
                      : conAlfa(paleta.tinta, 0.09),
                    boxShadow: suyo ? `0 0 22px ${conAlfa(paleta.morado, 0.6)}` : 'none',
                  }}
                >
                  {Math.round(puesto) + 1}
                </span>
                <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 40, fontWeight: 600, color: paleta.tinta, marginBottom: 8 }}>{f.n}</div>
                  <div style={{ fontSize: 28, color: paleta.mudo }}>
                    ★ {f.e} · {f.r} {d('reseñas', 'reviews')}
                  </div>
                </div>
              </Vidrio>
            );
          })}
        </div>
      </div>
    </Escenario>
  );
};
