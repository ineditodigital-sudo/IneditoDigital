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
 * Demanda: la pauta, la calle y quien contesta.
 *
 * Tres formas de que llegue gente. Cada escena enseña el mecanismo, no el
 * resultado: el presupuesto MOVIÉNDOSE, el anuncio ENCENDIÉNDOSE sobre la
 * avenida, el mensaje CONTESTÁNDOSE. Un número final sin el gesto que lo
 * produjo no explica nada.
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

const aliento = (frame: number, periodo = 90) => (Math.sin((frame / periodo) * Math.PI * 2) + 1) / 2;

/* ══════════════════════ 04 · Publicidad: el presupuesto se mueve a lo que rinde */

export const EscenaPublicidad: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  /* El traspaso: lo que no rinde baja y lo que rinde sube, con el MISMO
     interpolate. Es lo que lo hace un trasvase y no dos barras por su cuenta. */
  const mueve = interpolate(frame, [46, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const brillo = interpolate(frame, [88, 122], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const canales = [
    { n: d('Búsqueda · marca', 'Search · brand'), de: 34, a: 62, cpl: [312, 168], gana: true },
    { n: d('Display · genérico', 'Display · generic'), de: 41, a: 14, cpl: [980, 940], gana: false },
    { n: d('Video', 'Video'), de: 25, a: 24, cpl: [430, 415], gana: false },
  ];

  return (
    <Escenario
      paleta={paleta}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Reparto del presupuesto', 'How the budget is split')}</Rotulo>}
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [104, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color="#fff" />
          {d('Costo por contacto: −46 %', 'Cost per lead: −46%')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center', height: '100%' }}>
        <Resplandor
          color={paleta.verde}
          tam={760}
          opacidad={mueve * (0.22 + resp * 0.12)}
          style={{ left: -140, top: -60 }}
        />

        {canales.map((c, i) => {
          const e = entra(frame, 6 + i * 8);
          const pct = interpolate(mueve, [0, 1], [c.de, c.a]);
          const cpl = interpolate(mueve, [0, 1], [c.cpl[0], c.cpl[1]]);
          return (
            <Vidrio
              key={c.n}
              paleta={paleta}
              activa={c.gana && mueve > 0.35}
              halo={mueve}
              tono={paleta.verde}
              style={{
                padding: '26px 32px',
                overflow: 'hidden',
                opacity: e.opacity * (c.gana ? 1 : interpolate(mueve, [0, 1], [1, 0.66])),
                translate: `0 ${e.translate}px`,
              }}
            >
              {c.gana && brillo > 0 && brillo < 1 && <Destello avance={brillo} />}
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
                <span style={{ fontSize: 38, fontWeight: 600, color: paleta.tinta }}>{c.n}</span>
                <span style={{ display: 'flex', alignItems: 'flex-end', gap: 28 }}>
                  <span style={{ fontSize: 28, color: paleta.mudo, paddingBottom: 6 }}>
                    ${Math.round(cpl)} {d('/ contacto', '/ lead')}
                  </span>
                  <span
                    style={{
                      fontSize: 46,
                      fontWeight: 700,
                      color: c.gana ? paleta.verde2 : paleta.mudo,
                      width: 116,
                      textAlign: 'right',
                      display: 'inline-block',
                    }}
                  >
                    {Math.round(pct)}%
                  </span>
                </span>
              </div>
              <BarraLuz
                paleta={paleta}
                valor={pct}
                color={c.gana ? paleta.verde : conAlfa(paleta.tinta, 0.3)}
                color2={c.gana ? paleta.verde2 : conAlfa(paleta.tinta, 0.42)}
                alto={20}
              />
            </Vidrio>
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
  const resp = aliento(frame);

  /* Tres coches en bucle, desfasados. El módulo hace que la escena no tenga
     principio ni final visibles, que es justo lo que pasa en una avenida. */
  const coches = [0, 52, 104].map((desfase) => ((frame + desfase) % 150) / 150);

  const encendido = interpolate(frame, [18, 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const impactos = Math.round(
    interpolate(frame, [18, 128], [0, 48200], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal }),
  );

  return (
    <Escenario
      paleta={paleta}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Av. Aguascalientes · un punto', 'Av. Aguascalientes · one site')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color="#fff" />
          {d('Sin «omitir anuncio»', 'No “skip ad” button')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* la luz que la lona derrama: es lo que la hace estar encendida */}
        <Resplandor
          color={paleta.morado}
          tam={1000}
          opacidad={encendido * (0.4 + resp * 0.18)}
          style={{ left: '50%', top: -220, translate: '-50% 0' }}
        />

        {/* el anuncio */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Vidrio
            paleta={paleta}
            activa
            halo={encendido}
            style={{
              position: 'relative',
              width: '76%',
              height: 244,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              opacity: interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <span
              style={{
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: 3,
                color: '#fff',
                textShadow: `0 0 ${34 * encendido}px ${conAlfa(paleta.morado2, 0.95)}`,
                clipPath: `inset(0 ${100 - encendido * 100}% 0 0)`,
              }}
            >
              INÉDITO
            </span>
          </Vidrio>
          {/* el poste */}
          <div
            style={{
              width: 24,
              height: 92,
              borderRadius: 4,
              background: `linear-gradient(180deg, ${conAlfa(paleta.tinta, 0.22)}, ${conAlfa(paleta.tinta, 0.08)})`,
              scale: `1 ${interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}`,
              transformOrigin: 'top center',
            }}
          />
        </div>

        {/* el dato, en su propia franja: los coches no le pasan por encima */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            gap: 24,
            paddingBottom: 26,
            opacity: interpolate(frame, [30, 46], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <span style={{ fontSize: 30, color: paleta.mudo, paddingBottom: 10 }}>
            {d('Impactos estimados / mes', 'Estimated impressions / month')}
          </span>
          <Cifra color={paleta.morado} color2={paleta.morado2} tam={70}>
            {impactos.toLocaleString('es-MX')}
          </Cifra>
        </div>

        {/* la avenida */}
        <div style={{ position: 'relative', height: 110, flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${conAlfa(paleta.tinta, 0.28)}, transparent)`,
            }}
          />
          {coches.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 30,
                left: `${p * 118 - 12}%`,
                width: 128,
                height: 52,
                borderRadius: 16,
                background:
                  i === 1
                    ? `linear-gradient(120deg, ${paleta.morado}, ${paleta.acento})`
                    : `linear-gradient(160deg, ${conAlfa(paleta.tinta, 0.16)}, ${conAlfa(paleta.tinta, 0.06)})`,
                boxShadow:
                  i === 1
                    ? `0 0 30px ${conAlfa(paleta.morado, 0.55)}, 0 10px 24px ${conAlfa(paleta.sombra, 0.5)}`
                    : `0 10px 24px ${conAlfa(paleta.sombra, 0.45)}`,
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
  const resp = aliento(frame);

  const preg = entra(frame, 10);
  /* Los tres puntos viven solo entre el 42 y el 66: aparecen, hacen su trabajo
     y se van antes de que llegue la respuesta. Dejarlos puestos sería mentir
     sobre cuánto tardó. */
  const escribiendo = interpolate(frame, [42, 50, 60, 66], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const contesta = entra(frame, 66);
  const llega = interpolate(frame, [66, 84], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      respira={resp}
      rotulo={
        <Rotulo paleta={paleta} pulso={resp}>
          {d('23:47 · nadie del equipo despierto', '23:47 · nobody on the team awake')}
        </Rotulo>
      }
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [94, 112], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color="#fff" />
          {d('Contestado en 4 segundos', 'Answered in 4 seconds')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 30, justifyContent: 'center', height: '100%' }}>
        <Resplandor
          color={paleta.morado}
          tam={720}
          opacidad={llega * (0.28 + resp * 0.14)}
          style={{ right: -120, bottom: -80 }}
        />

        <Vidrio
          paleta={paleta}
          style={{
            alignSelf: 'flex-start',
            maxWidth: '70%',
            padding: '30px 38px',
            borderRadius: 36,
            borderBottomLeftRadius: 10,
            opacity: preg.opacity,
            translate: `0 ${preg.translate}px`,
          }}
        >
          <span style={{ fontSize: 44, color: paleta.tinta }}>
            {d('¿Todavía tienen disponible?', 'Do you still have it available?')}
          </span>
        </Vidrio>

        {/* escribiendo… */}
        <div
          style={{
            alignSelf: 'flex-end',
            display: 'flex',
            gap: 14,
            padding: '24px 32px',
            borderRadius: 36,
            background: `linear-gradient(150deg, ${conAlfa(paleta.morado, 0.28)}, ${conAlfa(paleta.morado, 0.1)})`,
            border: `1px solid ${conAlfa(paleta.morado, 0.3)}`,
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
                background: paleta.morado2,
                boxShadow: `0 0 14px ${conAlfa(paleta.morado2, 0.8)}`,
                translate: `0 ${interpolate((frame + i * 4) % 18, [0, 9, 18], [0, -11, 0], { easing: sal })}px`,
              }}
            />
          ))}
        </div>

        {/* la respuesta: encendida, no solo de otro color */}
        <div
          style={{
            position: 'relative',
            alignSelf: 'flex-end',
            maxWidth: '80%',
            padding: '30px 38px',
            borderRadius: 36,
            borderBottomRightRadius: 10,
            background: `linear-gradient(125deg, ${paleta.morado}, ${paleta.morado2})`,
            boxShadow: `0 0 ${52 * llega}px ${conAlfa(paleta.morado, 0.55 * llega)}, 0 20px 44px ${conAlfa(paleta.sombra, 0.5)}`,
            borderTop: `1px solid ${conAlfa('#ffffff', 0.4)}`,
            opacity: contesta.opacity,
            translate: `0 ${contesta.translate}px`,
          }}
        >
          <span style={{ fontSize: 44, color: '#fff', fontWeight: 500 }}>
            {d('Sí, quedan tres. ¿Te aparto uno para mañana?', 'Yes, three left. Shall I hold one for tomorrow?')}
          </span>
        </div>
      </div>
    </Escenario>
  );
};
