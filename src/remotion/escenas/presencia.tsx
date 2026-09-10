import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { dice, SAL, type PropsEscena } from '../marca';
import { Barra, Caja, Escenario, MONO, Palomita, Remate, Rotulo } from '../piezas';

/*
 * Presencia: el sitio, el buscador y el mapa.
 *
 * Las tres cuentan lo mismo en tres puertas distintas: alguien te busca y algo
 * decide si te encuentra. Cada una tiene tres tiempos y se solapan a propósito
 * —una pieza empieza antes de que la anterior termine— porque una secuencia en
 * la que cada cosa espera su turno se siente lenta aunque dure lo mismo.
 */

const sal = Easing.bezier(...SAL);

/** Entrada estándar: sube 30 y aparece. Los retardos son cuadros, a 30 por segundo. */
const entra = (frame: number, desde: number, dur = 16) => ({
  opacity: interpolate(frame, [desde, desde + dur], [0, 1], {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: sal,
  }),
  translate: interpolate(frame, [desde, desde + dur], [30, 0], {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: sal,
  }),
});

/* ═══════════════════════════════ 01 · Sitios web: la página se arma y se mide */

export const EscenaWeb: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  /* Los bloques de la página. Cada uno entra 7 cuadros después del anterior:
     lo justo para que se lea como una secuencia y no como una lista. */
  const bloques = [
    { alto: 54, ancho: '34%', desde: 18 },
    { alto: 130, ancho: '100%', desde: 25 },
    { alto: 54, ancho: '62%', desde: 32 },
    { alto: 54, ancho: '48%', desde: 39 },
  ];

  const segundos = interpolate(frame, [72, 100], [0, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Tu sitio, armándose', 'Your site, assembling')}</Rotulo>}
      remate={
        <Remate paleta={paleta} color={paleta.verde} opacidad={interpolate(frame, [104, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.verde} />
          {d('Listo para leerse: 1.1 s', 'Ready to read: 1.1 s')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44, height: '100%' }}>
        {/* el navegador */}
        <Caja paleta={paleta} style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '22px 28px',
              borderBottom: `2px solid ${paleta.linea}`,
              opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            {[paleta.mudo, paleta.mudo, paleta.mudo].map((c, i) => (
              <span key={i} style={{ width: 16, height: 16, borderRadius: 999, background: c, opacity: 0.5 }} />
            ))}
            <span
              style={{
                marginLeft: 18,
                flex: 1,
                height: 34,
                borderRadius: 999,
                background: paleta.pista,
                display: 'flex',
                alignItems: 'center',
                paddingInline: 20,
                fontFamily: MONO,
                fontSize: 22,
                color: paleta.mudo,
              }}
            >
              inedito.digital
            </span>
          </div>

          <div style={{ flex: 1, padding: 34, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bloques.map((b, i) => {
              const e = entra(frame, b.desde);
              return (
                <div
                  key={i}
                  style={{
                    height: b.alto,
                    width: b.ancho,
                    borderRadius: 14,
                    background: i === 1 ? paleta.moradoSuave : paleta.caja2,
                    opacity: e.opacity,
                    translate: `0 ${e.translate}px`,
                  }}
                />
              );
            })}
          </div>
        </Caja>

        {/* la medida: no es una promesa, es un número */}
        <div style={{ opacity: interpolate(frame, [64, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <span style={{ fontSize: 34, color: paleta.suave }}>
              {d('Tiempo hasta que se puede leer', 'Time until it can be read')}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 46, color: paleta.verde }}>
              {segundos.toFixed(1)} s
            </span>
          </div>
          <Barra paleta={paleta} valor={interpolate(frame, [72, 100], [0, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })} color={paleta.verde} />
        </div>
      </div>
    </Escenario>
  );
};

/* ═══════════════════════════ 02 · Posicionamiento: la respuesta te nombra */

export const EscenaPosicionamiento: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  /* La respuesta se revela con clip-path, no con opacidad: se lee como algo
     que se está escribiendo, que es lo que hace un asistente de verdad. */
  const revelado = interpolate(frame, [40, 92], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const marca = interpolate(frame, [86, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const preg = entra(frame, 6);

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Alguien le pregunta a una IA', 'Someone asks an AI')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [104, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.morado} />
          {d('Tu marca, dentro de la respuesta', 'Your brand, inside the answer')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34, height: '100%', justifyContent: 'center' }}>
        {/* la pregunta */}
        <Caja
          paleta={paleta}
          fuerte
          style={{
            alignSelf: 'flex-end',
            maxWidth: '76%',
            padding: '26px 34px',
            borderRadius: 30,
            borderBottomRightRadius: 8,
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
        </Caja>

        {/* la respuesta, revelándose */}
        <Caja
          paleta={paleta}
          style={{
            maxWidth: '88%',
            padding: '30px 36px',
            borderRadius: 30,
            borderBottomLeftRadius: 8,
            opacity: interpolate(frame, [34, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 24,
                color: paleta.morado,
                border: `2px solid ${paleta.morado}`,
                borderRadius: 10,
                padding: '4px 10px',
                marginTop: 8,
                flexShrink: 0,
              }}
            >
              IA
            </span>
            <span
              style={{
                fontSize: 42,
                color: paleta.suave,
                lineHeight: 1.4,
                clipPath: `inset(0 ${100 - revelado}% 0 0)`,
              }}
            >
              {d('Para marketing medible en Aguascalientes te recomiendo ', 'For measurable marketing in Aguascalientes I would recommend ')}
              <span
                style={{
                  color: paleta.morado,
                  background: marca > 0 ? paleta.moradoSuave : 'transparent',
                  borderRadius: 8,
                  padding: '2px 8px',
                  opacity: 0.35 + marca * 0.65,
                }}
              >
                Inédito Digital
              </span>
              {d(', que mide cada canal hasta la venta.', ', which measures every channel through to the sale.')}
            </span>
          </div>
        </Caja>
      </div>
    </Escenario>
  );
};


/* ═════════════════════════════ 03 · Ficha de Google: el mapa decide primero */

export const EscenaLocal: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  /*
   * Tres fichas que se reordenan. Cada una sabe en qué puesto empieza y en cuál
   * acaba, y su sitio en pantalla sale de interpolar entre los dos: asi el
   * movimiento es una sola cuenta y no tres casos particulares.
   */
  const ALTO = 152;
  const HUECO = 26;
  const fichas = [
    { n: d('Competencia A', 'Competitor A'), e: '4.2', r: 41, de: 0, a: 1, tuyo: false },
    { n: d('Competencia B', 'Competitor B'), e: '3.8', r: 12, de: 1, a: 2, tuyo: false },
    { n: d('Tu negocio', 'Your business'), e: '4.9', r: 128, de: 2, a: 0, tuyo: true },
  ];

  const orden = interpolate(frame, [56, 84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Búsqueda local · el bloque del mapa', 'Local search · the map block')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [96, 114], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.morado} />
          {d('Los tres del mapa salen antes que todo', 'The map three show above everything')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', gap: 40, height: '100%', alignItems: 'stretch' }}>
        {/* el mapa */}
        <Caja paleta={paleta} style={{ width: '40%', position: 'relative', overflow: 'hidden' }}>
          {[0.24, 0.52, 0.78].map((p, i) => (
            <div
              key={`h${i}`}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${p * 100}%`,
                height: 6,
                background: paleta.linea,
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
                width: 6,
                background: paleta.linea,
                opacity: interpolate(frame, [8 + i * 5, 26 + i * 5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}
            />
          ))}

          {[
            { x: 32, y: 24, mio: false, desde: 24 },
            { x: 68, y: 78, mio: false, desde: 30 },
            { x: 50, y: 52, mio: true, desde: 36 },
          ].map((a, i) => {
            const e = interpolate(frame, [a.desde, a.desde + 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: sal,
            });
            /* El alfiler tuyo late justo cuando su ficha sube al primer puesto:
               los dos gestos cuentan lo mismo y tienen que ir juntos. */
            const late = a.mio
              ? interpolate(frame, [58, 70, 84], [1, 1.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })
              : 1;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${a.x}%`,
                  top: `${a.y}%`,
                  width: a.mio ? 46 : 32,
                  height: a.mio ? 46 : 32,
                  marginLeft: a.mio ? -23 : -16,
                  marginTop: a.mio ? -23 : -16,
                  borderRadius: 999,
                  background: a.mio ? paleta.morado : paleta.mudo,
                  border: a.mio ? `6px solid ${paleta.fondo}` : 'none',
                  opacity: e,
                  scale: String(e * late),
                }}
              />
            );
          })}
        </Caja>

        {/* los tres resultados, en su propia caja de posiciones */}
        <div style={{ flex: 1, position: 'relative' }}>
          {fichas.map((f, i) => {
            const puesto = interpolate(orden, [0, 1], [f.de, f.a]);
            const ent = entra(frame, 40 + i * 6);
            const suyo = f.tuyo && orden > 0.5;
            return (
              <Caja
                key={f.n}
                paleta={paleta}
                fuerte={f.tuyo}
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
                  borderColor: suyo ? paleta.morado : paleta.linea,
                  opacity: ent.opacity,
                  translate: `0 ${puesto * (ALTO + HUECO) + ent.translate}px`,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 34,
                    color: suyo ? paleta.morado : paleta.mudo,
                    width: 46,
                  }}
                >
                  {Math.round(puesto) + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 40, color: paleta.tinta, marginBottom: 10 }}>{f.n}</div>
                  <div style={{ fontSize: 29, color: paleta.mudo }}>
                    ★ {f.e} · {f.r} {d('reseñas', 'reviews')}
                  </div>
                </div>
              </Caja>
            );
          })}
        </div>
      </div>
    </Escenario>
  );
};
