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
 * Negocio: la lista, el diagnóstico y el tablero.
 *
 * Las tres tratan de lo mismo: poner orden en algo que ya existe. Por eso las
 * tres tienen el mismo gesto central —cosas que se reordenan o se priorizan— y
 * ninguna inventa un número que el sitio no pueda enseñar.
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

/* ════════════════════ 07 · IA para ventas: la lista se ordena por cierre */

export const EscenaVentas: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  const ALTO = 122;
  const HUECO = 22;

  /* Llegan por orden de llegada y acaban por probabilidad. `de` y `a` son los
     dos órdenes; el movimiento es interpolar entre ellos. */
  const filas = [
    { n: d('Contacto sin empresa', 'Lead with no company'), p: 21, de: 0, a: 3 },
    { n: d('Taller García', 'García Workshop'), p: 48, de: 1, a: 2 },
    { n: d('Clínica Santa Fe', 'Santa Fe Clinic'), p: 74, de: 2, a: 1 },
    { n: d('Constructora del Bajío', 'Bajío Construction'), p: 92, de: 3, a: 0 },
  ];

  const orden = interpolate(frame, [52, 88], [0, 1], {
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
      sangrado={sangrado}
      respira={resp}
      rotulo={
        <Rotulo paleta={paleta} pulso={resp}>
          {orden > 0.5
            ? d('Por probabilidad de cierre', 'By likelihood of closing')
            : d('Por orden de llegada', 'In order of arrival')}
        </Rotulo>
      }
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [100, 118], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color="#fff" />
          {d('Tu equipo entra a cerrar, no a buscar', 'Your team closes instead of searching')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <Resplandor
          color={paleta.morado}
          tam={720}
          opacidad={orden * (0.24 + resp * 0.12)}
          style={{ left: -120, top: -100 }}
        />

        {filas.map((f, i) => {
          const puesto = interpolate(orden, [0, 1], [f.de, f.a]);
          const ent = entra(frame, 6 + i * 7);
          const primera = orden > 0.45 && f.a === 0;
          /* Como en la referencia del marcador: la de arriba brilla, la última
             se apaga. La jerarquía se ve antes de leer un solo número. */
          const apagada = interpolate(orden, [0, 1], [1, f.a === 3 ? 0.34 : f.a === 2 ? 0.6 : 1]);
          return (
            <Vidrio
              key={f.n}
              paleta={paleta}
              activa={primera}
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
                gap: 28,
                overflow: 'hidden',
                zIndex: primera ? 2 : 1,
                opacity: ent.opacity * apagada,
                translate: `0 ${puesto * (ALTO + HUECO) + ent.translate}px`,
              }}
            >
              {primera && brillo > 0 && brillo < 1 && <Destello avance={brillo} />}
              <span
                style={{
                  position: 'relative',
                  width: 50,
                  height: 50,
                  flexShrink: 0,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 26,
                  fontWeight: 700,
                  color: primera ? '#fff' : paleta.mudo,
                  background: primera
                    ? `linear-gradient(140deg, ${paleta.morado}, ${paleta.morado2})`
                    : conAlfa(paleta.tinta, 0.09),
                  boxShadow: primera ? `0 0 22px ${conAlfa(paleta.morado, 0.6)}` : 'none',
                }}
              >
                {Math.round(puesto) + 1}
              </span>
              <span style={{ position: 'relative', flex: 1, fontSize: 40, fontWeight: 600, color: paleta.tinta, minWidth: 0 }}>
                {f.n}
              </span>
              <div style={{ position: 'relative', width: 280 }}>
                <BarraLuz
                  paleta={paleta}
                  valor={interpolate(frame, [20 + i * 7, 52 + i * 7], [0, f.p], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}
                  color={f.p >= 70 ? paleta.morado : conAlfa(paleta.tinta, 0.28)}
                  color2={f.p >= 70 ? paleta.morado2 : conAlfa(paleta.tinta, 0.4)}
                  alto={14}
                />
              </div>
              <span
                style={{
                  position: 'relative',
                  fontSize: 42,
                  fontWeight: 700,
                  color: f.p >= 70 ? paleta.morado2 : paleta.mudo,
                  width: 100,
                  textAlign: 'right',
                }}
              >
                {f.p}%
              </span>
            </Vidrio>
          );
        })}
      </div>
    </Escenario>
  );
};

/* ═══════════════════ 08 · Auditoría con IA: hallazgos con evidencia */

export const EscenaAuditoria: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  const hallazgos = [
    { t: d('Carga en 6.2 s en teléfono', 'Loads in 6.2 s on mobile'), alta: true },
    { t: d('14 páginas fuera del índice', '14 pages outside the index'), alta: true },
    { t: d('Ficha sin categoría principal', 'Listing with no primary category'), alta: false },
  ];

  /* La numeración llega al final, cuando ya están los tres: el orden por
     impacto solo significa algo cuando hay una lista que ordenar. */
  const prioriza = interpolate(frame, [86, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      sangrado={sangrado}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Revisión de tu presencia', 'A review of your presence')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [112, 128], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color="#fff" />
          {d('Un plan ordenado por impacto', 'A plan ordered by impact')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center', height: '100%' }}>
        <Resplandor
          color={paleta.ambar}
          tam={700}
          opacidad={0.16 + resp * 0.1}
          style={{ right: -120, top: -60 }}
        />

        {hallazgos.map((h, i) => {
          const desde = 12 + i * 22;
          const e = entra(frame, desde);
          const tono = h.alta ? paleta.ambar : paleta.mudo;
          /* el punto de severidad late al aparecer su hallazgo, no antes */
          const late = interpolate(frame, [desde + 4, desde + 14, desde + 26], [1, 1.8, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: sal,
          });
          return (
            <Vidrio
              key={h.t}
              paleta={paleta}
              style={{
                height: 134,
                padding: '0 36px',
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                opacity: e.opacity,
                translate: `${prioriza * 26}px ${e.translate}px`,
              }}
            >
              <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: 26, height: 26, flexShrink: 0 }}>
                <span
                  style={{
                    position: 'absolute',
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: tono,
                    boxShadow: `0 0 ${16 * late}px ${conAlfa(tono, 0.85)}`,
                    scale: String(late),
                  }}
                />
              </span>
              <span style={{ flex: 1, fontSize: 40, fontWeight: 500, color: paleta.tinta, minWidth: 0 }}>{h.t}</span>
              <span
                style={{
                  fontSize: 25,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: h.alta ? '#fff' : paleta.mudo,
                  background: h.alta
                    ? `linear-gradient(120deg, ${paleta.ambar}, ${conAlfa(paleta.ambar, 0.7)})`
                    : conAlfa(paleta.tinta, 0.08),
                  boxShadow: h.alta ? `0 0 20px ${conAlfa(paleta.ambar, 0.45)}` : 'none',
                  borderRadius: 999,
                  padding: '9px 20px',
                }}
              >
                {h.alta ? d('Alta', 'High') : d('Media', 'Medium')}
              </span>
              <span
                style={{
                  width: 78,
                  textAlign: 'right',
                  fontSize: 38,
                  fontWeight: 700,
                  color: paleta.morado2,
                  opacity: prioriza,
                  textShadow: `0 0 ${18 * prioriza}px ${conAlfa(paleta.morado, 0.7)}`,
                }}
              >
                #{i + 1}
              </span>
            </Vidrio>
          );
        })}
      </div>
    </Escenario>
  );
};

/* ═════════════════════ 09 · Tablero: una pantalla, no cinco pestañas */

export const EscenaTablero: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  const kpis = [
    { r: d('Contactos', 'Leads'), v: 330, fmt: (n: number) => String(Math.round(n)) },
    { r: d('Costo por contacto', 'Cost per lead'), v: 143, fmt: (n: number) => `$${Math.round(n)}` },
    { r: d('Ventas', 'Sales'), v: 39, fmt: (n: number) => String(Math.round(n)) },
    { r: d('Retorno', 'Return'), v: 3.2, fmt: (n: number) => `${n.toFixed(1)}x` },
  ];

  /*
   * La curva del mes. Va en SVG con su propio halo y un punto encendido en la
   * cabeza, como la gráfica de la referencia: una línea con luz cuenta un
   * crecimiento mucho mejor que cuatro barras apiladas.
   */
  const puntos = [8, 18, 15, 30, 26, 44, 40, 58, 72, 68, 88, 100];
  const An = 1200;
  const Al = 250;
  const px = (i: number) => (i / (puntos.length - 1)) * An;
  const py = (v: number) => Al - (v / 100) * (Al - 24) - 12;
  const linea = puntos.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
  const area = `${linea} L ${An} ${Al} L 0 ${Al} Z`;

  const dibuja = interpolate(frame, [44, 108], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  /* Donde va el punto: se camina la polilinea hasta el avance actual y se
     interpola entre los dos vertices que lo rodean. */
  const paso = dibuja * (puntos.length - 1);
  const i0 = Math.floor(paso);
  const i1 = Math.min(puntos.length - 1, i0 + 1);
  const cabezaX = px(paso);
  const cabezaY = py(puntos[i0] + (puntos[i1] - puntos[i0]) * (paso - i0));

  return (
    <Escenario
      paleta={paleta}
      sangrado={sangrado}
      respira={resp}
      rotulo={<Rotulo paleta={paleta} pulso={resp}>{d('Tu tablero · septiembre', 'Your dashboard · September')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [108, 126], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color="#fff" />
          {d('Conectado a datos reales, no a capturas', 'Wired to real data, not to screenshots')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 30, height: '100%' }}>
        <Resplandor
          color={paleta.morado}
          tam={860}
          opacidad={dibuja * (0.24 + resp * 0.12)}
          style={{ right: -160, bottom: -160 }}
        />

        {/* los cuatro números */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {kpis.map((k, i) => {
            const e = entra(frame, 6 + i * 6);
            const v = interpolate(frame, [12 + i * 6, 52 + i * 6], [0, k.v], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: sal,
            });
            return (
              <Vidrio
                key={k.r}
                paleta={paleta}
                style={{ padding: '24px 24px 28px', opacity: e.opacity, translate: `0 ${e.translate}px` }}
              >
                <div
                  style={{
                    fontSize: 26,
                    color: paleta.mudo,
                    marginBottom: 14,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {k.r}
                </div>
                <Cifra color={paleta.tinta} color2={paleta.morado2} tam={58}>
                  {k.fmt(v)}
                </Cifra>
              </Vidrio>
            );
          })}
        </div>

        {/* la curva */}
        <Vidrio paleta={paleta} style={{ flex: 1, padding: '28px 32px 22px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <span style={{ fontSize: 28, color: paleta.mudo }}>
              {d('Contactos por mes', 'Leads per month')}
            </span>
            <span style={{ fontSize: 30, fontWeight: 600, color: paleta.verde2 }}>
              ▲ {Math.round(dibuja * 62)}% {d('en el año', 'this year')}
            </span>
          </div>

          {/*
            El punto de la cabeza va en una capa encima del SVG y no dentro:
            con preserveAspectRatio="none" el lienzo se estira y un circulo
            dibujado dentro saldria ovalado. Aqui se calcula donde cae en el
            sistema del viewBox y se traduce a porcentaje de la caja.
          */}
          <div style={{ position: 'relative', flex: 1 }}>
            <svg
              viewBox={`0 0 ${An} ${Al}`}
              preserveAspectRatio="none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
            >
              <defs>
                <linearGradient id="tab-linea" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={paleta.morado} />
                  <stop offset="100%" stopColor={paleta.morado2} />
                </linearGradient>
                <linearGradient id="tab-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={conAlfa(paleta.morado, 0.42)} />
                  <stop offset="100%" stopColor={conAlfa(paleta.morado, 0)} />
                </linearGradient>
                <filter id="tab-halo" x="-20%" y="-60%" width="140%" height="240%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
                <clipPath id="tab-recorte">
                  <rect x="0" y="-40" width={An * dibuja} height={Al + 80} />
                </clipPath>
              </defs>

              <g clipPath="url(#tab-recorte)">
                <path d={area} fill="url(#tab-area)" />
                {/* la copia desenfocada da el halo; la nitida, la linea */}
                <path d={linea} fill="none" stroke="url(#tab-linea)" strokeWidth={9} filter="url(#tab-halo)" opacity={0.95} />
                <path d={linea} fill="none" stroke="url(#tab-linea)" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>

            <span
              style={{
                position: 'absolute',
                left: `${(cabezaX / An) * 100}%`,
                top: `${(cabezaY / Al) * 100}%`,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
                borderRadius: 999,
                background: '#fff',
                boxShadow: `0 0 ${18 + resp * 14}px ${conAlfa(paleta.morado2, 0.95)}`,
                opacity: dibuja > 0.03 ? 1 : 0,
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 24, color: paleta.mudo }}>
            {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S'].map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        </Vidrio>
      </div>
    </Escenario>
  );
};
