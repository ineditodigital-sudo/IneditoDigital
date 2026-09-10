import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { dice, SAL, type PropsEscena } from '../marca';
import {
  Cifra,
  conAlfa,
  Escenario,
  Palomita,
  Remate,
  Resplandor,
  Rotulo,
  Telefono,
  Vidrio,
} from '../piezas';
import { ChapaTexto, COLOR_MARCA } from '../logos';

/*
 * Tienda en línea: el carrito que se iba, y vuelve.
 *
 * Aquí el teléfono sí es parte del mensaje —una tienda se abandona desde el
 * teléfono, a media noche, con el pulgar— así que el aparato ocupa la escena
 * casi entera y su pantalla lleva letra grande. En las demás escenas un
 * teléfono dejaría el contenido a la mitad de tamaño y no compensa.
 *
 * Tres tiempos: el carrito con dos cosas dentro, la persona que se va, y el
 * mensaje que la trae de vuelta con la venta recuperada.
 */

const sal = Easing.bezier(...SAL);
const aliento = (frame: number, periodo = 90) => (Math.sin((frame / periodo) * Math.PI * 2) + 1) / 2;

export const EscenaTienda: React.FC<PropsEscena> = ({ paleta, idioma, sangrado }) => {
  const frame = useCurrentFrame();
  const d = dice(idioma);
  const resp = aliento(frame);

  /* La persona se va: la pantalla se apaga un poco entre el 34 y el 56. */
  const seVa = interpolate(frame, [34, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  /* Y vuelve: el mensaje entra y la venta se recupera. */
  const vuelve = interpolate(frame, [72, 96], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const recuperado = interpolate(frame, [96, 126], [0, 4280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: sal,
  });

  const productos = [
    { n: d('Botas de trabajo', 'Work boots'), p: '$2,490' },
    { n: d('Casco con visor', 'Helmet with visor'), p: '$1,790' },
  ];

  return (
    <Escenario
      paleta={paleta}
      sangrado={sangrado}
      respira={resp}
      rotulo={
        <Rotulo paleta={paleta} pulso={resp}>
          {d('Un carrito abandonado a las 23:10', 'A cart abandoned at 23:10')}
        </Rotulo>
      }
      remate={
        <Remate
          paleta={paleta}
          color={paleta.verde}
          opacidad={interpolate(frame, [110, 128], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          <Palomita color="#fff" />
          {d('Venta recuperada', 'Sale recovered')}
        </Remate>
      }
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 56, height: '100%' }}>
        <Resplandor
          color={paleta.verde}
          tam={820}
          opacidad={vuelve * (0.26 + resp * 0.12)}
          style={{ right: -120, top: -60 }}
        />

        {/* el teléfono, que aquí es el objeto principal */}
        <Telefono paleta={paleta} ancho={368} alto={600} style={{ flexShrink: 0 }}>
          {/* cabecera de la tienda */}
          <div
            style={{
              padding: '64px 26px 18px',
              borderBottom: `1px solid ${conAlfa(paleta.tinta, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: 26, fontWeight: 700, color: paleta.tinta }}>
              {d('Tu tienda', 'Your store')}
            </span>
            <span
              style={{
                position: 'relative',
                fontSize: 24,
                color: paleta.mudo,
              }}
            >
              🛒
              <span
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -12,
                  minWidth: 26,
                  height: 26,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  background: paleta.morado,
                  boxShadow: `0 0 14px ${conAlfa(paleta.morado, 0.8)}`,
                }}
              >
                2
              </span>
            </span>
          </div>

          {/* el carrito */}
          <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 16, opacity: 1 - seVa * 0.55 }}>
            {productos.map((p, i) => (
              <div
                key={p.n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 14,
                  borderRadius: 20,
                  background: conAlfa(paleta.tinta, 0.06),
                  opacity: interpolate(frame, [6 + i * 8, 22 + i * 8], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                <span
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: `linear-gradient(140deg, ${conAlfa(paleta.morado, 0.5)}, ${conAlfa(paleta.acento, 0.28)})`,
                  }}
                />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 21, color: paleta.tinta, marginBottom: 4 }}>{p.n}</span>
                  <span style={{ display: 'block', fontSize: 19, color: paleta.mudo }}>{p.p}</span>
                </span>
              </div>
            ))}

            {/* el botón de pagar, que nadie pulsó */}
            <div
              style={{
                marginTop: 6,
                height: 60,
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                fontSize: 22,
                fontWeight: 700,
                color: '#fff',
                background: `linear-gradient(120deg, ${paleta.morado}, ${paleta.morado2})`,
                opacity: interpolate(frame, [24, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                boxShadow: `0 0 26px ${conAlfa(paleta.morado, 0.45 * (1 - seVa))}`,
              }}
            >
              {d('Pagar', 'Checkout')}
            </div>
          </div>

          {/* el mensaje que la trae de vuelta, deslizando desde abajo */}
          <div
            style={{
              position: 'absolute',
              left: 18,
              right: 18,
              bottom: 22,
              padding: '20px 22px',
              borderRadius: 26,
              background: `linear-gradient(135deg, ${paleta.verde}, ${paleta.verde2})`,
              boxShadow: `0 0 ${40 * vuelve}px ${conAlfa(paleta.verde, 0.6 * vuelve)}, 0 16px 34px ${conAlfa(paleta.sombra, 0.6)}`,
              borderTop: `1px solid ${conAlfa('#ffffff', 0.45)}`,
              opacity: vuelve,
              translate: `0 ${interpolate(vuelve, [0, 1], [70, 0])}px`,
            }}
          >
            <span style={{ display: 'block', fontSize: 17, fontWeight: 700, color: 'rgba(0,40,20,.7)', marginBottom: 6 }}>
              {d('WhatsApp · ahora', 'WhatsApp · now')}
            </span>
            <span style={{ fontSize: 21, color: '#04231A', lineHeight: 1.3, fontWeight: 500 }}>
              {d(
                'Te guardamos tu carrito. ¿Te lo envío hoy mismo?',
                'We saved your cart. Shall I ship it today?',
              )}
            </span>
          </div>
        </Telefono>

        {/* la cuenta, al lado */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <Vidrio
            paleta={paleta}
            style={{
              padding: '30px 34px',
              opacity: interpolate(frame, [46, 62], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ fontSize: 30, color: paleta.mudo, marginBottom: 10 }}>
              {d('Carritos que se abandonan', 'Carts that get abandoned')}
            </div>
            <Cifra color={paleta.ambar} color2={paleta.ambar} tam={76}>
              7 {d('de cada', 'in')} 10
            </Cifra>
          </Vidrio>

          <Vidrio
            paleta={paleta}
            activa={vuelve > 0.4}
            halo={vuelve}
            tono={paleta.verde}
            style={{
              padding: '30px 34px',
              opacity: interpolate(frame, [84, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <div style={{ fontSize: 30, color: paleta.mudo, marginBottom: 10 }}>
              {d('Recuperado este mes', 'Recovered this month')}
            </div>
            <Cifra color={paleta.verde} color2={paleta.verde2} tam={76}>
              ${Math.round(recuperado).toLocaleString('es-MX')}
            </Cifra>
          </Vidrio>

          {/* sobre qué plataformas */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              opacity: interpolate(frame, [104, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            <ChapaTexto paleta={paleta} nombre="Shopify" color={COLOR_MARCA.shopify} tam={26} />
            <ChapaTexto paleta={paleta} nombre="WooCommerce" color={COLOR_MARCA.woocommerce} tam={26} />
          </div>
        </div>
      </div>
    </Escenario>
  );
};
