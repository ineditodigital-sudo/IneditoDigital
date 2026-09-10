import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { dice, SAL, type PropsEscena } from '../marca';
import { Barra, Caja, Escenario, MONO, Palomita, Remate, Rotulo } from '../piezas';

/*
 * Negocio: la lista, el diagnóstico y el tablero.
 *
 * Las tres tratan de lo mismo: poner orden en algo que ya existe. Por eso las
 * tres tienen el mismo gesto central —cosas que se reordenan— y ninguna
 * inventa un número que el sitio no pueda enseñar.
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

/* ════════════════════ 07 · IA para ventas: la lista se ordena por cierre */

export const EscenaVentas: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  const ALTO = 116;
  const HUECO = 20;

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

  return (
    <Escenario
      paleta={paleta}
      rotulo={
        <Rotulo paleta={paleta}>
          {orden > 0.5 ? d('Por probabilidad de cierre', 'By likelihood of closing') : d('Por orden de llegada', 'In order of arrival')}
        </Rotulo>
      }
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [96, 114], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.morado} />
          {d('Tu equipo entra a cerrar, no a buscar', 'Your team closes instead of searching')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', height: '100%' }}>
        {filas.map((f, i) => {
          const puesto = interpolate(orden, [0, 1], [f.de, f.a]);
          const e = entra(frame, 6 + i * 7);
          const arriba = orden > 0.5 && f.a === 0;
          return (
            <Caja
              key={f.n}
              paleta={paleta}
              fuerte={arriba}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: ALTO,
                padding: '0 32px',
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                borderColor: arriba ? paleta.morado : paleta.linea,
                opacity: e.opacity,
                translate: `0 ${puesto * (ALTO + HUECO) + e.translate}px`,
              }}
            >
              <span style={{ flex: 1, fontSize: 40, color: paleta.tinta, minWidth: 0 }}>{f.n}</span>
              <div style={{ width: 300 }}>
                <Barra
                  paleta={paleta}
                  valor={interpolate(frame, [20 + i * 7, 52 + i * 7], [0, f.p], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}
                  color={f.p >= 70 ? paleta.verde : paleta.mudo}
                  alto={16}
                />
              </div>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 40,
                  color: f.p >= 70 ? paleta.verde : paleta.mudo,
                  width: 92,
                  textAlign: 'right',
                }}
              >
                {f.p}%
              </span>
            </Caja>
          );
        })}
      </div>
    </Escenario>
  );
};

/* ═══════════════════ 08 · Auditoría con IA: hallazgos con evidencia */

export const EscenaAuditoria: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  const hallazgos = [
    { t: d('Carga en 6.2 s en teléfono', 'Loads in 6.2 s on mobile'), alta: true },
    { t: d('14 páginas fuera del índice', '14 pages outside the index'), alta: true },
    { t: d('Ficha sin categoría principal', 'Listing with no primary category'), alta: false },
  ];

  /* La numeración llega al final, cuando ya están los tres: el orden por
     impacto solo significa algo cuando hay una lista que ordenar. */
  const prioriza = interpolate(frame, [86, 106], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Revisión de tu presencia', 'A review of your presence')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [110, 126], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.morado} />
          {d('Un plan ordenado por impacto', 'A plan ordered by impact')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26, justifyContent: 'center', height: '100%' }}>
        {hallazgos.map((h, i) => {
          const desde = 12 + i * 22;
          const e = entra(frame, desde);
          /* el punto de severidad late al aparecer su hallazgo, no antes */
          const late = interpolate(frame, [desde + 4, desde + 12, desde + 22], [1, 1.9, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: sal,
          });
          return (
            <Caja
              key={h.t}
              paleta={paleta}
              fuerte
              style={{
                height: 128,
                padding: '0 34px',
                display: 'flex',
                alignItems: 'center',
                gap: 26,
                opacity: e.opacity,
                translate: `${prioriza * 22}px ${e.translate}px`,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 999,
                  background: h.alta ? paleta.ambar : paleta.mudo,
                  scale: String(late),
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, fontSize: 40, color: paleta.tinta, minWidth: 0 }}>{h.t}</span>
              <span
                style={{
                  fontSize: 26,
                  textTransform: 'uppercase',
                  letterSpacing: 3,
                  color: h.alta ? paleta.ambar : paleta.mudo,
                  border: `2px solid ${h.alta ? paleta.ambar : paleta.linea}`,
                  borderRadius: 999,
                  padding: '8px 18px',
                }}
              >
                {h.alta ? d('alta', 'high') : d('media', 'medium')}
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 38,
                  color: paleta.morado,
                  width: 66,
                  textAlign: 'right',
                  opacity: prioriza,
                }}
              >
                #{i + 1}
              </span>
            </Caja>
          );
        })}
      </div>
    </Escenario>
  );
};

/* ═════════════════════ 09 · Tablero: una pantalla, no cinco pestañas */

export const EscenaTablero: React.FC<PropsEscena> = ({ paleta, idioma }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);

  const kpis = [
    { r: d('Contactos', 'Leads'), v: 330, fmt: (n: number) => String(Math.round(n)) },
    { r: d('Costo por contacto', 'Cost per lead'), v: 143, fmt: (n: number) => `$${Math.round(n)}` },
    { r: d('Ventas', 'Sales'), v: 39, fmt: (n: number) => String(Math.round(n)) },
    { r: d('Retorno', 'Return'), v: 3.2, fmt: (n: number) => `${n.toFixed(1)}x` },
  ];

  /* El embudo: cada tramo es más corto que el anterior y entra después. */
  const embudo = [
    { e: d('Visitas', 'Visits'), p: 100 },
    { e: d('Contactos', 'Leads'), p: 46 },
    { e: d('Citas', 'Appointments'), p: 24 },
    { e: d('Ventas', 'Sales'), p: 11 },
  ];

  return (
    <Escenario
      paleta={paleta}
      rotulo={<Rotulo paleta={paleta}>{d('Tu tablero · septiembre', 'Your dashboard · September')}</Rotulo>}
      remate={
        <Remate paleta={paleta} opacidad={interpolate(frame, [104, 122], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}>
          <Palomita color={paleta.morado} />
          {d('Conectado a datos reales, no a capturas', 'Wired to real data, not to screenshots')}
        </Remate>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34, height: '100%' }}>
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
              <Caja
                key={k.r}
                paleta={paleta}
                fuerte
                style={{ padding: '26px 24px', opacity: e.opacity, translate: `0 ${e.translate}px` }}
              >
                <div style={{ fontSize: 26, color: paleta.mudo, marginBottom: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {k.r}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 60, color: paleta.tinta, lineHeight: 1 }}>
                  {k.fmt(v)}
                </div>
              </Caja>
            );
          })}
        </div>

        {/* el embudo, que es lo que casi nadie tiene */}
        <Caja paleta={paleta} style={{ flex: 1, padding: '30px 34px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
          {embudo.map((t, i) => {
            const desde = 40 + i * 10;
            return (
              <div
                key={t.e}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  opacity: interpolate(frame, [desde, desde + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}
              >
                <span style={{ width: 260, fontSize: 32, color: paleta.suave }}>{t.e}</span>
                <div style={{ flex: 1 }}>
                  <Barra
                    paleta={paleta}
                    valor={interpolate(frame, [desde + 4, desde + 34], [0, t.p], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: sal })}
                    color={i === 3 ? paleta.verde : paleta.morado}
                    alto={20}
                  />
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 32,
                    color: i === 3 ? paleta.verde : paleta.mudo,
                    width: 92,
                    textAlign: 'right',
                  }}
                >
                  {t.p}%
                </span>
              </div>
            );
          })}
        </Caja>
      </div>
    </Escenario>
  );
};
