import { ArrowRight } from 'lucide-react';
import Floating3DElements from './Floating3DElements';
import TopographyCanvas from './TopographyCanvas';
import { memo } from 'react';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

/*
 * El hero "en diseño": la portada se ve como si alguien la estuviera
 * diseñando en este momento. El título vive dentro de un marco de selección
 * que se traza solo al entrar, con sus asas en las esquinas y hormigas
 * marchantes en bucle; tres cursores de colaboradores llegan volando, se
 * acomodan y derivan despacio.
 *
 * Dos reglas de la casa que este componente cuida:
 *  - El TEXTO nunca se anima. Se lee completo desde el primer cuadro; lo que
 *    vive es el marco alrededor. Y la línea que posiciona sigue dentro del
 *    h1, en mono (Hanson jamás en minúsculas).
 *  - Cero JS de animación: todo es CSS. El hero es la zona LCP y no paga
 *    un byte por el espectáculo.
 *
 * Un solo layout centrado para todos los tamaños: la estructura de columnas
 * y el bento de fotos se retiraron a propósito. La esfera vive ahora en la
 * banda de "Dirección comercial asistida por IA".
 */

/** Un cursor de colaborador con su etiqueta, como en una herramienta real. */
function Cursor({
  texto,
  color,
  textoOscuro = false,
  className = '',
  llegaDesde,
  retraso,
  derivaRetraso = '0s',
}: {
  texto: string;
  color: string;
  textoOscuro?: boolean;
  className?: string;
  llegaDesde: { x: string; y: string };
  retraso: string;
  derivaRetraso?: string;
}) {
  return (
    <div
      className={`chip-llega absolute z-30 ${className}`}
      style={{ '--desde-x': llegaDesde.x, '--desde-y': llegaDesde.y, animationDelay: retraso } as React.CSSProperties}
      aria-hidden
    >
      <div className="chip-deriva" style={{ animationDelay: derivaRetraso }}>
        <svg width="15" height="15" viewBox="0 0 15 15" className="mb-0.5 drop-shadow">
          <path d="M1.5,1.5 L13.5,6.5 L8,8 L6.5,13.5 Z" fill={color} stroke="rgba(0,0,0,.35)" strokeWidth="0.6" />
        </svg>
        <span
          className="ml-2.5 inline-block rounded-full px-3 py-1 text-[11px] font-semibold shadow-lg md:text-xs"
          style={{ background: color, color: textoOscuro ? '#14001e' : '#fff' }}
        >
          {texto}
        </span>
      </div>
    </div>
  );
}

function HeroBento() {
  const { openAssistant } = useApp();
  /* Textos editables desde el panel. El segundo argumento es lo que hay hoy:
     si el campo queda vacío se usa eso, así la portada nunca se ve rota. */
  const t = contenido('home', 'portada');
  const b = contenido('home', 'bento');

  return (
    <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 py-20 md:py-24">
      {/* Fondo topográfico animado */}
      <TopographyCanvas />
      {/* El resplandor superior: un gradiente, cero JS */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-[70%]"
        style={{ background: 'radial-gradient(60% 58% at 50% -14%, rgba(153,51,255,.30), rgba(119,0,206,.10) 55%, transparent 78%)' }}
      />

      {/* Elementos 3D flotantes */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <Floating3DElements variant="mixed" count={6} />
      </div>

      <div className="container relative z-20 mx-auto max-w-4xl text-center">
        {/* ---- el lienzo: el marco de selección con el título dentro ---- */}
        <div className="relative mx-auto inline-block px-6 py-7 sm:px-10 md:px-16 md:py-10">
          {/* el trazo que se dibuja una vez y las hormigas en bucle */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <rect
              x="0.001" y="0.001" width="99.998" height="99.998"
              pathLength={1}
              className="marco-traza"
              fill="none"
              stroke="rgba(153,51,255,.6)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x="0.001" y="0.001" width="99.998" height="99.998"
              pathLength={1}
              className="marco-hormigas"
              fill="none"
              stroke="rgba(204,102,255,.85)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ strokeDasharray: '0.02 0.025' }}
            />
          </svg>

          {/* las asas de las esquinas */}
          {['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`marco-asa absolute ${pos} h-2 w-2 border border-[#CC66FF] bg-[#14001e]`}
            />
          ))}

          {/* el nombre del marco, como en una herramienta de diseño */}
          <span
            aria-hidden
            className="marco-asa absolute -top-6 left-0 flex items-center gap-1.5 font-mono text-[10px] tracking-[.14em] text-[#AA66FF]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-[2px] bg-[#AA66FF]/70" />
            {t('etiqueta', 'Aguascalientes · Medimos hasta la venta')}
          </span>

          {/* EL TÍTULO. Estático y legible; la frase que posiciona va dentro. */}
          <h1 className="heading">
            <span className="mb-3 block font-mono text-[10.5px] font-semibold tracking-[.22em] text-[#AA66FF] md:text-[11.5px]">
              {t('titulo_0', 'Agencia de marketing digital en Aguascalientes')}
            </span>
            <span className="block text-3xl leading-tight text-white sm:text-4xl md:text-6xl">
              {t('titulo_1', 'DIRECCIÓN COMERCIAL')}
            </span>
            <span className="block bg-gradient-to-r from-[#7700CE] via-[#9933FF] to-[#CC66FF] bg-clip-text text-3xl leading-tight text-transparent [text-wrap:balance] sm:text-4xl md:text-6xl">
              {t('titulo_2', 'ASISTIDA POR IA')}
            </span>
          </h1>

          {/* los colaboradores trabajando en la página */}
          <Cursor
            texto={b('chip_1', 'IA auditando')}
            color="#9933FF"
            className="hidden left-0 top-[30%] -translate-x-1/2 sm:-left-6 md:block"
            llegaDesde={{ x: '-70px', y: '50px' }}
            retraso="1.1s"
          />
          <Cursor
            texto={b('chip_2', 'Medido hasta la venta')}
            color="#F2F0F6"
            textoOscuro
            className="hidden right-0 top-[6%] translate-x-1/3 sm:-right-8 md:block"
            llegaDesde={{ x: '80px', y: '-40px' }}
            retraso="1.45s"
            derivaRetraso="1.6s"
          />
          <Cursor
            texto={b('chip_3', 'Visible ante la IA')}
            color="#00E585"
            textoOscuro
            className="-bottom-7 right-[14%]"
            llegaDesde={{ x: '60px', y: '60px' }}
            retraso="1.8s"
            derivaRetraso="0.8s"
          />
        </div>

        {/* Descripción */}
        <p
          className="animate-fadeIn-lcp mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base"
          style={{ animationDelay: '0.25s' }}
        >
          {t('descripcion', 'No vendemos campañas sueltas: conectamos los objetivos de tu dirección con todo lo que tu negocio hace en digital, en un solo tablero, y cada mes una IA audita que la estrategia esté funcionando.')}
        </p>

        {/* CTAs */}
        <div
          className="animate-fadeIn-lcp mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '0.35s' }}
        >
          <button
            onClick={() => openAssistant(undefined, 'cotizar servicios de marketing digital')}
            className="group inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-8 py-4 text-white shadow-[0_0_30px_rgba(119,0,206,0.5)] transition-all duration-300 hover:from-[#9933FF] hover:to-[#7700CE] hover:shadow-[0_0_50px_rgba(119,0,206,0.8)] active:scale-95 sm:w-auto"
          >
            <span className="text-sm font-bold tracking-wider md:text-base">{t('boton_1', 'QUIERO UNA AUDITORÍA')}</span>
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={19} />
          </button>
          <a
            href="#servicios"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 active:scale-95 sm:w-auto"
          >
            <span className="text-sm font-bold tracking-wider md:text-base">{t('boton_2', 'VER SERVICIOS')}</span>
          </a>
        </div>
      </div>

      {/* el horizonte morado del pie, respirando */}
      <div
        aria-hidden
        className="animate-horizonte pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-44"
        style={{ background: 'linear-gradient(to top, rgba(119,0,206,.30), rgba(119,0,206,.08) 55%, transparent)' }}
      />
      <div
        aria-hidden
        className="animate-horizonte pointer-events-none absolute -bottom-24 left-1/2 z-[5] h-48 w-[130%] -translate-x-1/2 rounded-[100%] blur-3xl"
        style={{ background: 'radial-gradient(50% 100% at 50% 100%, rgba(153,51,255,.5), transparent 70%)' }}
      />
    </section>
  );
}

export default memo(HeroBento);
