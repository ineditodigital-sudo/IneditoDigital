import { Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
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
  Telefono,
  Vidrio,
} from '../piezas';
import { Chapa, ChapaTexto, COLOR_MARCA, LogoGoogle, LogoWhatsApp } from '../logos';

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

export const EscenaPublicidad: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
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
      sangrado={sangrado}
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
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'center', height: '100%' }}>
        <Resplandor
          color={paleta.verde}
          tam={760}
          opacidad={mueve * (0.22 + resp * 0.12)}
          style={{ left: -140, top: -60 }}
        />

        {/* dónde se pauta, con las marcas que el cliente reconoce */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            marginBottom: 6,
            opacity: interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <Chapa paleta={paleta} style={{ padding: '11px 20px' }}>
            <LogoGoogle tam={26} />
            <span style={{ fontSize: 25, fontWeight: 600, color: '#fff' }}>Google Ads</span>
          </Chapa>
          <ChapaTexto paleta={paleta} nombre="Meta Ads" color={COLOR_MARCA.meta} tam={25} />
          <ChapaTexto paleta={paleta} nombre="ChatGPT Ads" color="#10A37F" tam={25} />
        </div>

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

export const EscenaEspectaculares: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
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
      sangrado={sangrado}
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
            {/* El logo oficial y no la palabra escrita: en la lona va la marca
                como se imprime. Letras blancas sobre el vidrio oscuro, negras
                sobre el claro; se enciende de izquierda a derecha. Sin
                drop-shadow: sobre este SVG el filtro recortado por el clip
                dejaba rectángulos de luz alrededor del isotipo. La luz ya la
                pone el halo de la lona. */}
            <Img
              src={staticFile(
                parseInt(paleta.fondo.slice(1, 3), 16) > 128 ? 'marca/inedito-negro.svg' : 'marca/inedito-blanco.svg',
              )}
              style={{
                height: 132,
                width: 'auto',
                clipPath: `inset(0 ${100 - encendido * 100}% 0 0)`,
              }}
            />
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

export const EscenaAgentes: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  /*
   * Un agente de WhatsApp vive en un teléfono, así que la escena es un teléfono.
   *
   * Antes esto eran dos globos flotando en el vacío: se leía la conversación
   * pero no se veía DÓNDE ocurre, y el centro del lienzo quedaba muerto. Con el
   * aparato a la derecha y, a la izquierda, las horas a las que de verdad te
   * escriben, la escena cuenta las dos mitades del problema: llegan de
   * madrugada, y aun así se contestan.
   *
   * El reloj de 24 horas no es un dato inventado sobre nadie: es el hecho
   * evidente de que un negocio abre nueve horas y el teléfono no se apaga las
   * otras quince.
   */
  const ALTO_TEL = 560;
  const ANCHO_TEL = 300;

  const preg = entra(frame, 24);
  /* Los tres puntos viven solo entre el 44 y el 68: aparecen, hacen su trabajo
     y se van antes de que llegue la respuesta. Dejarlos puestos sería mentir
     sobre cuánto tardó. */
  const escribiendo = interpolate(frame, [44, 52, 62, 68], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const contesta = entra(frame, 68);
  const llega = interpolate(frame, [68, 86], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  /* La jornada, de 0 a 24. La franja clara es el horario de oficina; los puntos
     de fuera son los que hoy se quedan sin contestar. */
  const OFICINA = [9, 18];
  const horas = [2.3, 7.1, 10.4, 13.2, 16.6, 21.3, 23.8];
  const enOficina = (h: number) => h >= OFICINA[0] && h <= OFICINA[1];

  /* Todos se encienden en verde cuando el agente entra a trabajar. */
  const atendidos = interpolate(frame, [86, 116], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const capacidades = [
    d('Contesta', 'Replies'),
    d('Cotiza', 'Quotes'),
    d('Te pasa el contacto', 'Hands you the lead'),
  ];

  return (
    <Escenario
      paleta={paleta}
      sangrado={sangrado}
      respira={resp}
      rotulo={
        <>
          <Chapa paleta={paleta} style={{ padding: '11px 20px' }}>
            <LogoWhatsApp tam={26} />
            <span style={{ fontSize: 25, fontWeight: 600, color: '#fff' }}>WhatsApp</span>
          </Chapa>
          <Rotulo paleta={paleta} pulso={resp}>
            {d('23:47 · nadie del equipo despierto', '23:47 · nobody on the team awake')}
          </Rotulo>
        </>
      }
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [104, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color="#fff" />
          {d('Contestado en 4 segundos', 'Answered in 4 seconds')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 56, height: '100%' }}>
        <Resplandor
          color={paleta.morado}
          tam={760}
          opacidad={llega * (0.28 + resp * 0.14)}
          style={{ right: -140, top: -40 }}
        />

        {/* la jornada: a qué horas te escriben de verdad */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            height: ALTO_TEL,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 30,
          }}
        >
          <Vidrio
            paleta={paleta}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 38px 44px',
              opacity: interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ fontSize: 30, color: paleta.mudo, marginBottom: 34 }}>
              {d('A qué horas te escriben', 'When people message you')}
            </div>

            {/* la barra de 24 horas */}
            <div style={{ position: 'relative', height: 26, borderRadius: 999, background: conAlfa(paleta.tinta, 0.08) }}>
              {/* el horario de oficina */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${(OFICINA[0] / 24) * 100}%`,
                  width: `${((OFICINA[1] - OFICINA[0]) / 24) * 100}%`,
                  borderRadius: 999,
                  background: conAlfa(paleta.tinta, 0.3),
                  boxShadow: `inset 0 0 0 1px ${conAlfa(paleta.tinta, 0.26)}`,
                }}
              />

              {horas.map((h, i) => {
                const dentro = enOficina(h);
                /* Cada punto aparece a su hora, de madrugada a noche. */
                const nace = interpolate(frame, [10 + i * 7, 24 + i * 7], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: sal,
                });
                /* Los de dentro ya estaban atendidos; los de fuera, solo cuando
                   entra el agente. */
                const verde = dentro ? 1 : atendidos;
                const color = dentro
                  ? paleta.verde
                  : verde > 0.5
                    ? paleta.verde
                    : paleta.ambar;
                /* El de las 23:47 es el de la conversación: late. */
                const suyo = i === horas.length - 1;
                const tam = suyo ? 34 : 26;
                return (
                  <span
                    key={h}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${(h / 24) * 100}%`,
                      width: tam,
                      height: tam,
                      marginTop: -tam / 2,
                      marginLeft: -tam / 2,
                      borderRadius: 999,
                      background: color,
                      boxShadow: `0 0 ${suyo ? 26 + resp * 14 : 16}px ${conAlfa(color, 0.8)}`,
                      opacity: nace,
                      scale: `${0.4 + nace * 0.6}`,
                    }}
                  />
                );
              })}
            </div>

            {/* las horas, para que la franja se entienda */}
            <div style={{ position: 'relative', height: 34, marginTop: 12 }}>
              {[0, 6, 12, 18, 24].map((h) => (
                <span
                  key={h}
                  style={{
                    position: 'absolute',
                    left: `${(h / 24) * 100}%`,
                    translate: h === 0 ? '0 0' : h === 24 ? '-100% 0' : '-50% 0',
                    fontSize: 22,
                    color: paleta.mudo,
                  }}
                >
                  {String(h).padStart(2, '0')}:00
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
              <span
                style={{
                  width: 30,
                  height: 16,
                  borderRadius: 999,
                  background: conAlfa(paleta.tinta, 0.3),
                  boxShadow: `inset 0 0 0 1px ${conAlfa(paleta.tinta, 0.26)}`,
                }}
              />
              <span style={{ fontSize: 22, color: paleta.mudo }}>
                {d('Tu horario de oficina', 'Your office hours')}
              </span>
            </div>
          </Vidrio>

          {/* qué hace el agente mientras nadie está */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              opacity: interpolate(frame, [96, 114], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            {capacidades.map((c) => (
              <span
                key={c}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 24px',
                  borderRadius: 999,
                  fontSize: 26,
                  color: paleta.suave,
                  background: conAlfa(paleta.tinta, 0.07),
                  border: `1px solid ${conAlfa(paleta.tinta, 0.12)}`,
                }}
              >
                <Palomita color={paleta.verde} />
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* el teléfono, con la conversación */}
        <Telefono paleta={paleta} ancho={ANCHO_TEL} alto={ALTO_TEL} style={{ flexShrink: 0 }}>
          {/* la cabecera del chat */}
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '58px 20px 16px',
              borderBottom: `1px solid ${conAlfa(paleta.tinta, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                borderRadius: 999,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                background: `linear-gradient(140deg, ${paleta.morado}, ${paleta.acento})`,
                fontSize: 17,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              TN
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 19, color: paleta.tinta, fontWeight: 600 }}>
                {d('Tu negocio', 'Your business')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 15, color: paleta.verde }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    background: paleta.verde,
                    boxShadow: `0 0 ${6 + resp * 6}px ${paleta.verde}`,
                  }}
                />
                {d('en línea', 'online')}
              </span>
            </span>
          </div>

          {/* los globos, apilados desde abajo como en el telefono de verdad */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: 14,
            }}
          >
            <div
              style={{
                alignSelf: 'flex-start',
                maxWidth: '86%',
                padding: '16px 20px',
                borderRadius: 22,
                borderBottomLeftRadius: 6,
                background: conAlfa(paleta.tinta, 0.09),
                border: `1px solid ${conAlfa(paleta.tinta, 0.1)}`,
                opacity: preg.opacity,
                translate: `0 ${preg.translate * 0.4}px`,
              }}
            >
              <span style={{ fontSize: 20, color: paleta.tinta, lineHeight: 1.35 }}>
                {d('¿Todavía tienen disponible?', 'Do you still have it available?')}
              </span>
              <span style={{ display: 'block', marginTop: 8, fontSize: 14, color: paleta.mudo }}>23:47</span>
            </div>

            {/* escribiendo… */}
            <div
              style={{
                alignSelf: 'flex-end',
                display: 'flex',
                gap: 8,
                padding: '16px 20px',
                borderRadius: 22,
                background: `linear-gradient(150deg, ${conAlfa(paleta.morado, 0.3)}, ${conAlfa(paleta.morado, 0.12)})`,
                border: `1px solid ${conAlfa(paleta.morado, 0.3)}`,
                opacity: escribiendo,
                /* Se lleva su alto consigo: si se quedara ocupando sitio con el
                   globo ya puesto, dejaría un hueco muerto en la conversación. */
                height: escribiendo > 0 ? undefined : 0,
                paddingBlock: escribiendo > 0 ? 16 : 0,
                overflow: 'hidden',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 999,
                    background: paleta.morado2,
                    boxShadow: `0 0 10px ${conAlfa(paleta.morado2, 0.8)}`,
                    translate: `0 ${interpolate((frame + i * 4) % 18, [0, 9, 18], [0, -7, 0], { easing: sal })}px`,
                  }}
                />
              ))}
            </div>

            {/* la respuesta: encendida, no solo de otro color */}
            <div
              style={{
                alignSelf: 'flex-end',
                maxWidth: '90%',
                padding: '16px 20px',
                borderRadius: 22,
                borderBottomRightRadius: 6,
                background: `linear-gradient(125deg, ${paleta.morado}, ${paleta.morado2})`,
                boxShadow: `0 0 ${34 * llega}px ${conAlfa(paleta.morado, 0.55 * llega)}, 0 14px 30px ${conAlfa(paleta.sombra, 0.5)}`,
                borderTop: `1px solid ${conAlfa('#ffffff', 0.4)}`,
                opacity: contesta.opacity,
                translate: `0 ${contesta.translate * 0.4}px`,
              }}
            >
              <span style={{ fontSize: 20, color: '#fff', fontWeight: 500, lineHeight: 1.35 }}>
                {d('Sí, quedan tres. ¿Te aparto uno para mañana?', 'Yes, three left. Shall I hold one for tomorrow?')}
              </span>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 8,
                  fontSize: 14,
                  color: 'rgba(255,255,255,.72)',
                }}
              >
                23:47 <Palomita color="rgba(255,255,255,.9)" />
              </span>
            </div>
          </div>
          </div>
        </Telefono>
      </div>
    </Escenario>
  );
};
