import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Languages,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Sun,
} from 'lucide-react';
import {
  UI,
  type Botones,
  type Contacto,
  type DatosPresentacion,
  type Enlace,
  type Idioma,
  type Lamina,
  type Tarjeta,
} from '../components/presentacion/contenido';
import { enEditor, esDelEditor, useDatosPresentacion } from '../components/presentacion/datos';
import { idiomaVigente } from '../idioma';
import { EscenaOnda } from '../components/presentacion/escenas';
import EscenaVideo from '../components/presentacion/EscenaVideo';
import Logotipo from '../components/presentacion/Logotipo';
import MenuServicios from '../components/presentacion/MenuServicios';
import { hayEscena } from '../../remotion/nombres';

/*
 * La carta de servicios: un deck que vive fuera del sitio.
 *
 * No está en el menú, no está en el sitemap y lleva noindex. Es un enlace que
 * se manda a un cliente cuando hace falta, no una página del sitio — por eso
 * tampoco usa el layout con encabezado y pie.
 *
 * Lo que dice se edita desde el panel (Contenido › Presentación): textos,
 * tarjetas, enlaces, orden y qué láminas se ven. Lo trae datos.ts; aquí solo
 * se dibuja. Mientras nadie publique, se ve el respaldo de contenido.ts.
 *
 * Decisiones que vale la pena dejar dichas:
 *
 * MANDA EL NOMBRE. Lo primero que se ve es SITIOS WEB, y debajo qué incluye.
 * Esto se enseña en una junta, no se lee en un sillón.
 *
 * EN TELÉFONO RESPIRA. Todo va centrado, las tarjetas enseñan solo su título y
 * se abren al tocarlas, y la escena ocupa el hueco que queda: en un teléfono
 * alto crece, en uno bajo cede. Así nada se amontona y nada se sale.
 *
 * EL TEXTO NO SE ANIMA. Entra completo; lo que se mueve es el bloque.
 *
 * Y LAS TRANSICIONES SON CORTAS: 240 ms con ease-out. Un deck se navega con
 * flechas decenas de veces en una junta.
 */

const SAL = [0.23, 1, 0.32, 1] as const;

const TEMAS = {
  oscuro: {
    '--p-fondo': '#07060B',
    '--p-caja': 'rgba(255,255,255,.035)',
    '--p-caja2': 'rgba(255,255,255,.05)',
    '--p-linea': 'rgba(255,255,255,.12)',
    '--p-tinta': '#F2F0F6',
    '--p-suave': 'rgba(242,240,246,.72)',
    '--p-mudo': 'rgba(242,240,246,.45)',
    '--p-morado': '#CC66FF',
    '--p-moradoSuave': 'rgba(119,0,206,.22)',
    '--p-onda': 'rgba(153,51,255,.55)',
    '--p-punto': 'rgba(153,51,255,.3)',
    '--p-pista': 'rgba(255,255,255,.09)',
    '--p-pistaFuerte': 'rgba(255,255,255,.28)',
    '--p-verde': '#00E585',
    '--p-ambar': '#ffcf7a',
  },
  claro: {
    '--p-fondo': '#F6F4FA',
    '--p-caja': '#FFFFFF',
    '--p-caja2': '#F0ECF7',
    '--p-linea': 'rgba(10,10,10,.11)',
    '--p-tinta': '#0A0A0A',
    '--p-suave': 'rgba(10,10,10,.68)',
    '--p-mudo': 'rgba(10,10,10,.45)',
    '--p-morado': '#7700CE',
    '--p-moradoSuave': 'rgba(119,0,206,.10)',
    '--p-onda': 'rgba(119,0,206,.38)',
    '--p-punto': 'rgba(119,0,206,.16)',
    '--p-pista': 'rgba(10,10,10,.08)',
    '--p-pistaFuerte': 'rgba(10,10,10,.24)',
    '--p-verde': '#00A860',
    '--p-ambar': '#d99b1f',
  },
} as const;

/* En las láminas de servicio, el aire entre nombre, escena y tarjetas. Sale
   del alto de la ventana: holgado en un teléfono alto, justo en uno bajo, y
   nunca menos de 14 px. */
const AIRE = 'gap-[clamp(14px,2.6svh,28px)]';

/*
 * La lámina que pide la dirección: /service-presentation#espectaculares.
 *
 * Sirve para mandarle a un cliente el servicio que le interesa sin obligarlo a
 * pasar seis láminas, y de paso hace que cada una se pueda abrir en frío.
 */
function laminaDelHash(laminas: Lamina[]): number {
  const h = decodeURIComponent(location.hash.replace('#', '')).trim().toLowerCase();
  if (!h) return 0;
  const porId = laminas.findIndex((l) => l.id === h);
  if (porId >= 0) return porId;
  const n = Number(h);
  return Number.isInteger(n) && n >= 1 && n <= laminas.length ? n - 1 : 0;
}

/*
 * «Servicio 03» se numera solo, por su lugar entre los servicios que se ven:
 * reordenar u ocultar desde el panel no deja dos «Servicio 03» ni huecos.
 * Cualquier otro texto se respeta tal cual.
 */
function kickerDe(l: Lamina, laminas: Lamina[], idioma: Idioma): string {
  const k = l.kicker[idioma];
  const m = k.match(/^(servicio|service)\s+\d{1,2}$/i);
  if (!m || l.tipo !== 'servicio') return k;
  const n = laminas.filter((x) => x.tipo === 'servicio').indexOf(l) + 1;
  return `${m[1]} ${String(n).padStart(2, '0')}`;
}

export default function PresentacionServicios() {
  const datos = useDatosPresentacion();
  return datos ? <Deck datos={datos} /> : <Cargando />;
}

function Deck({ datos }: { datos: DatosPresentacion }) {
  /* Las ocultas no existen para quien mira: ni flechas, ni índice, ni número. */
  const laminas = useMemo(() => {
    const v = datos.laminas.filter((l) => l.visible);
    return v.length ? v : datos.laminas.slice(0, 1);
  }, [datos]);

  const [iPedido, setI] = useState(() => laminaDelHash(laminas));
  /* Arranca en el idioma que el visitante ya eligió en el sitio, pero de ahí
     en adelante el deck lleva el suyo. */
  const [idioma, setIdioma] = useState<Idioma>(() => idiomaVigente() as Idioma);
  const [tema, setTema] = useState<'oscuro' | 'claro'>('oscuro');
  const [menu, setMenu] = useState(false);
  const [rumbo, setRumbo] = useState(1);
  const tocaX = useRef(0);
  const quieto = useReducedMotion();

  const total = laminas.length;
  /* Si desde el panel quitan la lámina que se estaba viendo, la vista no se
     queda apuntando a la nada. */
  const i = Math.min(iPedido, total - 1);
  const lamina = laminas[i];
  const t = (k: keyof typeof UI) => UI[k][idioma];

  const ir = useCallback(
    (n: number) => {
      const d = Math.max(0, Math.min(total - 1, n));
      setRumbo(d > i ? 1 : -1);
      setI(d);
    },
    [i, total],
  );

  /* Esto se navega con el teclado en una junta. Con el índice abierto las
     flechas son suyas: navegar por detrás de un panel abierto desorienta. */
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || menu) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        ir(i + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        ir(i - 1);
      } else if (e.key === 'Home') ir(0);
      else if (e.key === 'End') ir(total - 1);
    };
    addEventListener('keydown', alPulsar);
    return () => removeEventListener('keydown', alPulsar);
  }, [i, ir, total, menu]);

  /* Si la dirección cambia con el deck abierto, el deck la sigue.
     replaceState no dispara hashchange: esto no hace eco con lo de abajo. */
  useEffect(() => {
    const alCambiar = () => {
      const n = laminaDelHash(laminas);
      if (n !== i) ir(n);
    };
    addEventListener('hashchange', alCambiar);
    return () => removeEventListener('hashchange', alCambiar);
  }, [i, ir, laminas]);

  /* La dirección sigue a la lámina. replaceState y no push: el botón de atrás
     del navegador debe sacarte del deck, no recorrerte las láminas. */
  useEffect(() => {
    const h = `#${lamina.id}`;
    if (location.hash !== h) history.replaceState(null, '', h);
  }, [lamina.id]);

  /* Dentro del editor del panel: tocar una lámina allá la enseña aquí, y el
     idioma que se está editando es el que se ve. */
  useEffect(() => {
    if (!enEditor) return;
    const alMensaje = (ev: MessageEvent) => {
      if (!esDelEditor(ev)) return;
      const m = ev.data;
      if (m.tipo === 'presentacion-ir') {
        const n = laminas.findIndex((l) => l.id === m.id);
        if (n >= 0 && n !== i) ir(n);
      } else if (m.tipo === 'presentacion-idioma' && (m.idioma === 'es' || m.idioma === 'en')) {
        setIdioma(m.idioma);
      }
    };
    addEventListener('message', alMensaje);
    return () => removeEventListener('message', alMensaje);
  }, [i, ir, laminas]);

  /* Fuera del sitio también quiere decir fuera del índice. */
  useEffect(() => {
    document.title =
      idioma === 'es'
        ? 'Carta de servicios · Inédito Digital'
        : 'Service catalog · Inédito Digital';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) {
      m = document.createElement('meta');
      m.setAttribute('name', 'robots');
      document.head.appendChild(m);
    }
    const antes = m.getAttribute('content');
    m.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (antes) m!.setAttribute('content', antes);
      else m!.remove();
    };
  }, [idioma]);

  const vars = TEMAS[tema] as unknown as React.CSSProperties;
  const portada = lamina.tipo === 'portada';
  const cierre = lamina.tipo === 'cierre';
  const suelta = portada || cierre; // láminas sin escena ni tarjetas

  /* Con prefers-reduced-motion se apaga el desplazamiento y queda el fundido. */
  const entra = quieto ? { opacity: 0 } : { opacity: 0, y: rumbo * 16 };
  const sale = quieto ? { opacity: 0 } : { opacity: 0, y: rumbo * -12 };

  return (
    <div
      style={{ ...vars, background: 'var(--p-fondo)', color: 'var(--p-tinta)' }}
      className="relative flex h-[100svh] flex-col overflow-hidden transition-colors duration-300"
      onTouchStart={(e) => (tocaX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (menu) return;
        const d = e.changedTouches[0].clientX - tocaX.current;
        if (Math.abs(d) > 55) ir(i + (d < 0 ? 1 : -1));
      }}
    >
      {/* la onda de la casa, siempre detrás */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden="true">
        <EscenaOnda activo />
      </div>

      {/* avance */}
      <div className="relative h-[3px] w-full shrink-0" style={{ background: 'var(--p-pista)' }}>
        <motion.div
          className="h-full"
          style={{ background: 'var(--p-morado)' }}
          animate={{ width: `${((i + 1) / total) * 100}%` }}
          transition={{ duration: 0.3, ease: SAL }}
        />
      </div>

      {/* barra de arriba: la marca y los mandos que no cambian de lámina */}
      <header className="relative z-30 flex shrink-0 items-center justify-between px-4 py-2.5 md:px-9 md:py-5 [@media(max-height:500px)]:py-1.5">
        <button
          onClick={() => ir(0)}
          title={idioma === 'es' ? 'Volver al inicio' : 'Back to the start'}
          className="flex transition-transform duration-150 active:scale-[0.96]"
        >
          <Logotipo alto={26} altoMd={34} tema={tema} />
        </button>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Boton onClick={() => setIdioma((v) => (v === 'es' ? 'en' : 'es'))} titulo={t('idioma')}>
            <Languages size={15} />
            <span className="text-[12px] font-semibold">{idioma === 'es' ? 'EN' : 'ES'}</span>
          </Boton>
          <Boton
            onClick={() => setTema((v) => (v === 'oscuro' ? 'claro' : 'oscuro'))}
            titulo={t('tema')}
          >
            {tema === 'oscuro' ? <Sun size={15} /> : <Moon size={15} />}
          </Boton>
          <Boton onClick={() => setMenu(true)} titulo={t('menu')} resaltado>
            <Menu size={16} />
            <span className="hidden text-[12px] font-semibold sm:inline">{t('indice')}</span>
          </Boton>
        </div>
      </header>

      <MenuServicios
        laminas={laminas}
        abierto={menu}
        cerrar={() => setMenu(false)}
        ir={ir}
        actual={i}
        idioma={idioma}
      />

      {/* la lámina */}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pb-3 md:px-9">
        {/*
          flex-1 y no h-full: la caja ocupa todo el alto de la lámina y, si el
          contenido no cabe (una tarjeta abierta en un teléfono muy bajo),
          crece y la lámina hace scroll en vez de encimar nada.
        */}
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center py-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              /* La llave es la posición y no el id: editar el id de la lámina
                 desde el panel no debe hacerla entrar de nuevo a cada tecla. */
              key={i}
              initial={entra}
              animate={{ opacity: 1, y: 0 }}
              exit={{ ...sale, transition: { duration: 0.14, ease: SAL } }}
              transition={{ duration: 0.24, ease: SAL }}
              className={suelta ? 'flex flex-col items-center text-center' : 'flex flex-1 flex-col lg:flex-none'}
            >
              {suelta ? (
                /*
                  Portada y cierre: una sola columna, centrada. w-full y
                  containerType van juntos: una caja que se mide a sí misma no
                  puede encogerse al contenido, o colapsa a cero.
                */
                <div className="flex w-full max-w-3xl flex-col items-center" style={{ containerType: 'inline-size' }}>
                  {portada && (
                    <div className="mb-7 md:mb-9 apaisado:mb-3 apaisado:[&_img]:h-[40px]">
                      <Logotipo alto={54} altoMd={84} tema={tema} />
                    </div>
                  )}

                  {!portada && lamina.kicker[idioma] && (
                    <p
                      className="mb-2.5 font-mono text-[10px] uppercase tracking-[.24em] md:mb-3.5 md:text-[11.5px]"
                      style={{ color: 'var(--p-morado)' }}
                    >
                      {lamina.kicker[idioma]}
                    </p>
                  )}

                  {/*
                    Aquí las líneas vienen partidas a mano («LET US START» /
                    «BY MEASURING») y deben quedarse así: manda la línea más
                    ancha, 10.15 px por px de cuerpo. A 9cqw ocupa el 91 % de la
                    columna. La portada lleva su propio factor porque su línea
                    más ancha («SERVICIOS», 7.24) deja crecer más el nombre.
                  */}
                  <h1
                    className="heading whitespace-pre-line leading-[0.94]"
                    style={{
                      color: 'var(--p-tinta)',
                      fontSize: portada ? 'clamp(28px, min(10.5cqw, 9svh), 76px)' : 'clamp(22px, min(9cqw, 8svh), 76px)',
                    }}
                  >
                    {lamina.nombre[idioma]}
                  </h1>

                  {lamina.descripcion[idioma] && (
                    <p
                      className={`mt-3 max-w-[58ch] text-[13.5px] leading-[1.55] md:mt-5 md:text-[16px] md:leading-[1.6] [@media(max-height:520px)]:line-clamp-3 ${cierre ? 'apaisado:hidden!' : 'apaisado:mt-2 apaisado:line-clamp-2'}`}
                      style={{ color: 'var(--p-suave)' }}
                    >
                      {lamina.descripcion[idioma]}
                    </p>
                  )}

                  <EnlaceLamina enlace={lamina.enlace} idioma={idioma} />

                  {portada && i < total - 1 && (
                    <button
                      onClick={() => ir(i + 1)}
                      className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.97] apaisado:mt-4 apaisado:py-2.5"
                      style={{ background: 'linear-gradient(120deg,#7700CE,#9933FF)' }}
                    >
                      {datos.botones.empezar[idioma]}
                      <ArrowRight size={17} />
                    </button>
                  )}

                  {cierre && (
                    <Cierre contacto={datos.contacto} botones={datos.botones} idioma={idioma} tema={tema} />
                  )}
                </div>
              ) : (
                <LaminaServicio
                  key={lamina.id}
                  lamina={lamina}
                  kicker={kickerDe(lamina, laminas, idioma)}
                  idioma={idioma}
                  tema={tema}
                  quieto={!!quieto}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* mandos: dónde estoy, qué estoy viendo y cómo sigo */}
      <footer
        className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-t px-4 py-2.5 md:px-9 md:py-4 [@media(max-height:500px)]:py-1.5"
        style={{ borderColor: 'var(--p-linea)' }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="shrink-0 font-mono text-[12px] tabular-nums md:text-[13px]"
            style={{ color: 'var(--p-tinta)' }}
          >
            {String(i + 1).padStart(2, '0')}
            <span style={{ color: 'var(--p-mudo)' }}> / {String(total).padStart(2, '0')}</span>
          </span>
          <span
            aria-hidden="true"
            className="hidden h-4 w-px shrink-0 sm:block"
            style={{ background: 'var(--p-linea)' }}
          />
          <span
            className="heading hidden truncate text-[12.5px] tracking-wide sm:block"
            style={{ color: 'var(--p-mudo)' }}
          >
            {lamina.nombre[idioma].replace(/\n/g, ' ')}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Boton onClick={() => ir(i - 1)} titulo={t('anterior')} apagado={i === 0}>
            <ArrowLeft size={16} />
          </Boton>
          <Boton onClick={() => ir(i + 1)} titulo={t('siguiente')} apagado={i === total - 1} resaltado>
            <span className="hidden text-[12.5px] font-semibold sm:inline">{t('siguiente')}</span>
            <ArrowRight size={16} />
          </Boton>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */

/*
 * Una lámina de servicio.
 *
 * Teléfono y tableta: una columna centrada. Nombre y descripción arriba, la
 * escena en el hueco que sobre —es un size container: crece si hay sitio y
 * cede si no— y las tarjetas abajo. Así una pantalla alta no deja aire muerto
 * y una baja no amontona nada.
 *
 * Escritorio: nombre a la izquierda, escena a la derecha pegada al borde de
 * su columna (el mismo borde donde terminan las tarjetas) y las tarjetas a lo
 * ancho debajo.
 */
function LaminaServicio({
  lamina,
  kicker,
  idioma,
  tema,
  quieto,
}: {
  lamina: Lamina;
  kicker: string;
  idioma: Idioma;
  tema: 'oscuro' | 'claro';
  quieto: boolean;
}) {
  /* En teléfono se abre una tarjeta a la vez: con dos abiertas vuelve el
     amontonamiento que esto quiere evitar. */
  const [abierta, setAbierta] = useState<number | null>(null);
  const tarjetas = lamina.tarjetas[idioma];
  const conEscena = hayEscena(lamina.escena);
  const columnas = tarjetas.length === 3 ? 'lg:grid-cols-3' : tarjetas.length === 2 ? 'lg:grid-cols-2' : '';

  return (
    <div
      className={[
        `flex flex-1 flex-col ${AIRE} lg:flex-none lg:gap-6`,
        /* Ventana ancha y baja: texto y tarjetas a la izquierda, la escena a
           la derecha ocupando todo el alto. El envoltorio de en medio se
           vuelve `contents` para que los tres compartan esta rejilla. */
        'apaisado:grid apaisado:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] apaisado:grid-rows-[auto_minmax(0,1fr)] apaisado:gap-x-7 apaisado:gap-y-2',
      ].join(' ')}
    >
      <div
        className={[
          `flex flex-1 flex-col ${AIRE}`,
          'lg:grid lg:flex-none lg:items-center lg:gap-10',
          'apaisado:contents',
          conEscena ? 'lg:grid-cols-2' : '',
        ].join(' ')}
      >
        {/*
          containerType hace que el nombre se mida contra SU columna y no
          contra la ventana. 7.6cqw sale de medir la palabra más ancha del
          guion («ESPECTACULARES», 12.55 px por px de cuerpo en Hanson): así
          ocupa como mucho el 95 % del ancho y nunca se corta. El 6.2svh es el
          tope por alto: en una ventana baja el nombre no se come la lámina.
        */}
        <div
          className="min-w-0 text-center lg:text-left apaisado:col-start-1 apaisado:row-start-1 apaisado:self-end apaisado:text-left"
          style={{ containerType: 'inline-size' }}
        >
          {kicker && (
            <p
              className="mb-2 font-mono text-[10px] uppercase tracking-[.24em] md:mb-3 md:text-[11.5px]"
              style={{ color: 'var(--p-morado)' }}
            >
              {kicker}
            </p>
          )}

          <h1
            className="heading whitespace-pre-line leading-[0.94]"
            style={{ color: 'var(--p-tinta)', fontSize: 'clamp(18px, min(7.6cqw, 6.2svh), 60px)' }}
          >
            {lamina.nombre[idioma]}
          </h1>

          {lamina.descripcion[idioma] && (
            <p
              className="mx-auto mt-2.5 max-w-[52ch] text-[13.5px] leading-[1.55] md:mt-4 md:text-[15.5px] md:leading-[1.6] lg:mx-0 [@media(max-height:520px)]:line-clamp-2 apaisado:hidden!"
              style={{ color: 'var(--p-suave)' }}
            >
              {lamina.descripcion[idioma]}
            </p>
          )}

          <EnlaceLamina enlace={lamina.enlace} idioma={idioma} />
        </div>

        {conEscena && (
          <div className="flex min-h-[96px] flex-1 items-center justify-center max-lg:[container-type:size] lg:min-h-0 lg:flex-none lg:justify-end apaisado:col-start-2 apaisado:row-span-2 apaisado:row-start-1 apaisado:h-full apaisado:min-h-0">
            <EscenaVideo nombre={lamina.escena} idioma={idioma} tema={tema} quieto={quieto} />
          </div>
        )}
      </div>

      {tarjetas.length > 0 && (
        <ul
          className={`grid gap-2.5 md:gap-4 ${columnas} apaisado:col-start-1 apaisado:row-start-2 apaisado:grid-cols-1 apaisado:gap-1.5 apaisado:self-start`}
        >
          {tarjetas.map((c, n) => (
            <TarjetaIncluye
              key={n}
              tarjeta={c}
              n={n}
              abierta={abierta === n}
              alternar={() => setAbierta((a) => (a === n ? null : n))}
              quieto={quieto}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/*
 * Una tarjeta de «qué incluye».
 *
 * En teléfono enseña solo el título, centrado, y se abre al tocarla: tres
 * explicaciones completas no caben junto al nombre y la escena sin
 * amontonarse. Desde tableta hay sitio y la explicación va siempre a la vista.
 *
 * Entran escalonadas a 55 ms: tres cajas que aparecen de golpe se leen como
 * un bloque; escalonadas, como una lista que se arma.
 */
function TarjetaIncluye({
  tarjeta,
  n,
  abierta,
  alternar,
  quieto,
}: {
  tarjeta: Tarjeta;
  n: number;
  abierta: boolean;
  alternar: () => void;
  quieto: boolean;
}) {
  return (
    <motion.li
      initial={quieto ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 + n * 0.055, ease: SAL }}
      className="rounded-2xl border"
      style={{
        borderColor: 'var(--p-linea)',
        background: 'linear-gradient(158deg, rgba(255,255,255,.055), rgba(255,255,255,.015))',
        boxShadow: '0 10px 26px rgba(0,0,0,.28)',
      }}
    >
      <button
        type="button"
        onClick={alternar}
        aria-expanded={abierta}
        className={[
          'relative flex w-full flex-col items-center px-11 py-3.5 text-center',
          'transition-transform duration-150 active:scale-[0.99]',
          'md:pointer-events-none md:flex-row md:items-start md:gap-4 md:px-5 md:text-left',
          'lg:flex-col lg:gap-0 lg:py-4',
          /* Ventana ancha y baja: tres tarjetas caben en la columna izquierda
             solo si son compactas. */
          'apaisado:items-start apaisado:gap-3! apaisado:py-1.5! apaisado:pl-4! apaisado:pr-9! apaisado:text-left md:apaisado:pr-4!',
        ].join(' ')}
      >
        <span
          className={[
            'hidden shrink-0 font-mono text-[12px] tabular-nums md:mt-[3px] md:block',
            'lg:mb-2 lg:mt-0 lg:grid lg:h-8 lg:w-8 lg:place-items-center lg:rounded-full',
          ].join(' ')}
          style={{ color: 'var(--p-morado)', background: 'var(--p-moradoSuave)' }}
        >
          {String(n + 1).padStart(2, '0')}
        </span>

        <span className="min-w-0">
          <span
            className="heading block text-[14px] leading-tight md:text-[16px] lg:text-[16.5px] apaisado:text-[12px]!"
            style={{ color: 'var(--p-tinta)' }}
          >
            {tarjeta.t}
          </span>
          {tarjeta.d && (
            <span
              className={[
                abierta ? 'block' : 'hidden',
                'mt-2 text-[12.5px] leading-[1.5] md:mt-1 md:block md:text-[13.5px]',
                'lg:mt-1.5 lg:text-[12.5px] lg:leading-[1.5]',
                '[@media(min-width:768px)_and_(max-height:620px)]:hidden',
              ].join(' ')}
              style={{ color: 'var(--p-suave)' }}
            >
              {tarjeta.d}
            </span>
          )}
        </span>

        {tarjeta.d && (
          <ChevronDown
            size={17}
            aria-hidden="true"
            className="absolute right-4 top-[15px] transition-transform duration-200 md:hidden"
            style={{ color: 'var(--p-mudo)', transform: abierta ? 'rotate(180deg)' : undefined }}
          />
        )}
      </button>
    </motion.li>
  );
}

/* El enlace opcional de una lámina: «Ver el servicio en el sitio». Si el panel
   no lo llena, no se pinta nada. Lo que va fuera del sitio abre pestaña. */
function EnlaceLamina({ enlace, idioma }: { enlace?: Enlace; idioma: Idioma }) {
  const texto = enlace ? enlace.texto[idioma] || enlace.texto[idioma === 'es' ? 'en' : 'es'] : '';
  if (!enlace || !texto) return null;
  const fuera = /^https?:\/\//i.test(enlace.url);
  return (
    <a
      href={enlace.url}
      target={fuera ? '_blank' : undefined}
      rel={fuera ? 'noreferrer' : undefined}
      className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold underline-offset-4 transition-opacity duration-150 hover:underline active:opacity-70 md:mt-4 md:text-[14px]"
      style={{ color: 'var(--p-morado)' }}
    >
      {texto}
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

/* El cierre: la marca en grande y las formas de contestar. Lo que el panel
   deje vacío no se pinta: un botón a ningún lado es peor que no tenerlo. */
function Cierre({
  contacto,
  botones,
  idioma,
  tema,
}: {
  contacto: Contacto;
  botones: Botones;
  idioma: Idioma;
  tema: 'oscuro' | 'claro';
}) {
  const mensaje = contacto.mensaje[idioma];
  const wa = contacto.whatsapp
    ? `https://wa.me/${contacto.whatsapp}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`
    : '';
  const tel = contacto.telefono.replace(/\D/g, '');

  return (
    <div className="mt-8 flex flex-col items-center gap-7 apaisado:mt-2 apaisado:gap-2.5">
      <span className="flex apaisado:[&_img]:h-[32px]">
        <Logotipo alto={46} altoMd={58} tema={tema} />
      </span>

      {(wa || contacto.correo) && (
        <div className="flex flex-wrap justify-center gap-2.5">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
              style={{ background: 'linear-gradient(120deg,#7700CE,#9933FF)' }}
            >
              <MessageCircle size={17} />
              {botones.escribir[idioma]}
            </a>
          )}
          {contacto.correo && (
            <a
              href={`mailto:${contacto.correo}`}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[14px] font-bold transition-transform duration-150 active:scale-[0.97]"
              style={{ borderColor: 'var(--p-linea)', color: 'var(--p-tinta)' }}
            >
              <Mail size={17} />
              {botones.correo[idioma]}
            </a>
          )}
        </div>
      )}

      {/* El número escrito, no solo enlazado: media junta se anota en papel. */}
      {(contacto.telefono || contacto.sitio) && (
        <div
          className="flex flex-col items-center gap-1.5 font-mono text-[12.5px] md:flex-row md:gap-5"
          style={{ color: 'var(--p-mudo)' }}
        >
          {contacto.telefono && (
            <a
              href={tel ? `tel:+${tel}` : undefined}
              className="inline-flex items-center gap-1.5 transition-colors"
              style={{ color: 'var(--p-suave)' }}
            >
              <Phone size={13} />
              {contacto.telefono}
            </a>
          )}
          {contacto.telefono && contacto.sitio && (
            <span aria-hidden="true" className="hidden md:inline">
              ·
            </span>
          )}
          {contacto.sitio && <span>{contacto.sitio}</span>}
        </div>
      )}
    </div>
  );
}

/* Un botón que responde al toque: sin el hundido no hay forma de saber que el
   gesto se registró, y eso en una presentación se nota. */
function Boton({
  children,
  onClick,
  titulo,
  apagado,
  resaltado,
}: {
  children: React.ReactNode;
  onClick: () => void;
  titulo: string;
  apagado?: boolean;
  /** El que se usa más. Lleva el fondo para que se encuentre sin buscarlo. */
  resaltado?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={apagado}
      title={titulo}
      aria-label={titulo}
      className="flex h-10 items-center gap-1.5 rounded-full border px-3.5 transition-[transform,opacity,background-color] duration-150 active:scale-[0.94] disabled:opacity-25"
      style={{
        borderColor: resaltado ? 'transparent' : 'var(--p-linea)',
        background: resaltado ? 'var(--p-moradoSuave)' : 'transparent',
        color: resaltado ? 'var(--p-morado)' : 'var(--p-tinta)',
      }}
    >
      {children}
    </button>
  );
}

/*
 * Mientras llega lo publicado. Casi siempre tarda menos de lo que se nota, así
 * que el logo aparece con un cuarto de segundo de retraso: si los datos ya
 * llegaron, nadie ve el parpadeo de una pantalla de carga.
 */
function Cargando() {
  return (
    <div className="flex h-[100svh] items-center justify-center" style={{ background: TEMAS.oscuro['--p-fondo'] }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.3 }}>
        <Logotipo alto={40} tema="oscuro" />
      </motion.div>
    </div>
  );
}
