import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { dice, SAL, type PropsEscena } from '../marca';
import { Barra, Caja, Escenario, MONO, Palomita, Remate, Rotulo } from '../piezas';

/*
 * Demanda: la pauta, la calle y quien contesta.
 *
 * Tres formas de que llegue gente. Cada escena enseña el mecanismo, no el
 * resultado: el presupuesto MOVIÉNDOSE, el coche PASANDO, el mensaje
 * CONTESTÁNDOSE. Un número final sin el gesto que lo produjo no explica nada.
 */

const sal = Easing.bezier(...SAL);

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

/* ══════════════════════ 04 · Publicidad: el presupuesto se mueve a lo que rinde */

export const EscenaPublicidad: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  /* El traspaso: lo que no rinde baja y lo que rinde sube, a la vez. Que sea
     el mismo interpolate es lo que hace que se lea como un trasvase y no como
     dos barras cambiando por su cuenta. */
  const mueve = interpolate(frame, [48, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const canales = [
    { n: d('Búsqueda · marca', 'Search · brand'), de: 34, a: 62, cpl: [312, 168] },
    { n: d('Display · genérico', 'Display · generic'), de: 41, a: 14, cpl: [980, 940] },
    { n: d('Video', 'Video'), de: 25, a: 24, cpl: [430, 415] },
  ];

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Reparto del presupuesto', 'How the budget is split')}</Rotulo>}
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color={paleta.verde} />
          {d('Costo por contacto: −46 %', 'Cost per lead: −46%')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 46, justifyContent: 'center', height: '100%' }}>
        {canales.map((c, i) => {
          const e = entra(frame, 6 + i * 8);
          const pct = interpolate(mueve, [0, 1], [c.de, c.a]);
          const cpl = interpolate(mueve, [0, 1], [c.cpl[0], c.cpl[1]]);
          const gana = c.a > c.de;
          return (
            <div key={c.n} style={{ opacity: e.opacity, translate: `0 ${e.translate}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <span style={{ fontSize: 38, color: paleta.tinta }}>{c.n}</span>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
                  <span style={{ fontFamily: MONO, fontSize: 30, color: paleta.mudo }}>
                    ${Math.round(cpl)} {d('/ contacto', '/ lead')}
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 40,
                      color: gana ? paleta.verde : paleta.mudo,
                      width: 110,
                      textAlign: 'right',
                      display: 'inline-block',
                    }}
                  >
                    {Math.round(pct)}%
                  </span>
                </span>
              </div>
              <Barra paleta={paleta} valor={pct} color={gana ? paleta.verde : paleta.mudo} alto={22} />
            </div>
          );
        })}
      </div>
    </Escenario>
  );
};

/* ═══════════════════════ 05 · Espectaculares: el medio que no se salta */

export const EscenaEspectaculares: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  /* Tres coches en bucle, desfasados. El módulo hace que la escena no tenga
     principio ni final visibles, que es justo lo que pasa en una avenida. */
  const coches = [0, 52, 104].map((desfase) => ((frame + desfase) % 150) / 150);

  const impactos = Math.round(
    interpolate(frame, [16, 130], [0, 48200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal }),
  );

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Av. Aguascalientes · un punto', 'Av. Aguascalientes · one site')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [96, 114], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.morado} />
          {d('Sin «omitir anuncio»', 'No “skip ad” button')}
        </Remate>
      }
    >
      {/*
        Tres franjas apiladas y no posiciones absolutas sueltas: el anuncio
        arriba, el dato en medio y la avenida abajo. Antes el contador iba
        pegado al fondo y le pasaban los coches por encima.
      */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* el anuncio */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <Caja
            paleta={paleta}
            fuerte
            style={{
              width: '78%',
              height: 250,
              borderColor: paleta.morado,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* la lona se revela de izquierda a derecha, como se instala */}
            <span
              style={{
                fontSize: 92,
                letterSpacing: 4,
                color: paleta.morado,
                clipPath: `inset(0 ${100 - interpolate(frame, [18, 54], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}% 0 0)`,
              }}
            >
              INÉDITO
            </span>
          </Caja>
          {/* el poste */}
          <div
            style={{
              width: 26,
              height: 96,
              background: paleta.linea,
              scale: `1 ${interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}`,
              transformOrigin: 'top center',
            }}
          />
        </div>

        {/* el dato, en su propia franja y sin coches que le pasen encima */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
            gap: 22,
            paddingBottom: 22,
            opacity: interpolate(frame, [30, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <span style={{ fontSize: 30, color: paleta.mudo }}>
            {d('Impactos estimados / mes', 'Estimated impressions / month')}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 62, color: paleta.tinta }}>
            {impactos.toLocaleString('es-MX')}
          </span>
        </div>

        {/* la avenida */}
        <div style={{ position: 'relative', height: 112, flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 5, background: paleta.linea }} />
          {coches.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 32,
                left: `${p * 118 - 12}%`,
                width: 132,
                height: 54,
                borderRadius: 14,
                background: i === 1 ? paleta.morado : paleta.caja2,
                border: `2px solid ${paleta.linea}`,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
      </div>
    </Escenario>
  );
};

/* ═══════════════════════════ 06 · Agentes: contestado a las 23:47 */

export const EscenaAgentes: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  const preg = entra(frame, 10);
  /* Los tres puntos de «escribiendo» viven solo entre el 40 y el 62: aparecen,
     hacen su trabajo y se van antes de que llegue la respuesta. Dejarlos
     puestos sería mentir sobre cuánto tardó. */
  const escribiendo = interpolate(frame, [40, 48, 58, 64], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const resp = entra(frame, 64);

  return (
    <Escenario
      paleta={paleta}
      rotulo={
        <>
          <span style={{ fontFamily: MONO, fontSize: 34, color: paleta.ambar }}>23:47</span>
          <Rotulo paleta={paleta}>{d('Nadie del equipo despierto', 'Nobody on the team awake')}</Rotulo>
        </>
      }
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [92, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color={paleta.verde} />
          {d('Contestado en 4 segundos', 'Answered in 4 seconds')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, justifyContent: 'center', height: '100%' }}>
        <Caja
          paleta={paleta}
          fuerte
          style={{
            alignSelf: 'flex-start',
            maxWidth: '72%',
            padding: '28px 36px',
            borderRadius: 32,
            borderBottomLeftRadius: 8,
            opacity: preg.opacity,
            translate: `0 ${preg.translate}px`,
          }}
        >
          <span style={{ fontSize: 44, color: paleta.tinta }}>
            {d('¿Todavía tienen disponible?', 'Do you still have it available?')}
          </span>
        </Caja>

        {/* escribiendo… */}
        <div
          style={{
            alignSelf: 'flex-end',
            display: 'flex',
            gap: 12,
            padding: '22px 30px',
            borderRadius: 32,
            background: paleta.moradoSuave,
            opacity: escribiendo,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: paleta.morado,
                /* cada punto sube con 4 cuadros de desfase */
                translate: `0 ${interpolate((frame + i * 4) % 18, [0, 9, 18], [0, -10, 0], { easing: sal })}px`,
              }}
            />
          ))}
        </div>

        <Caja
          paleta={paleta}
          style={{
            alignSelf: 'flex-end',
            maxWidth: '78%',
            padding: '28px 36px',
            borderRadius: 32,
            borderBottomRightRadius: 8,
            background: paleta.morado,
            borderColor: paleta.morado,
            opacity: resp.opacity,
            translate: `0 ${resp.translate}px`,
          }}
        >
          <span style={{ fontSize: 44, color: '#fff' }}>
            {d('Sí, quedan tres. ¿Te aparto uno para mañana?', 'Yes, three left. Shall I hold one for tomorrow?')}
          </span>
        </Caja>
      </div>
    </Escenario>
  );
};
