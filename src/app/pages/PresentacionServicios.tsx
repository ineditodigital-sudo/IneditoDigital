import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Languages,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Phone,
  Sun,
} from 'lucide-react';
import { LAMINAS, UI, CONTACTO, type Idioma, type Tarjeta } from '../components/presentacion/contenido';
import { idiomaVigente } from '../idioma';
import { EscenaOnda } from '../components/presentacion/escenas';
import EscenaVideo from '../components/presentacion/EscenaVideo';
import Logotipo from '../components/presentacion/Logotipo';
import MenuServicios from '../components/presentacion/MenuServicios';

/*
 * La carta de servicios: un deck que vive fuera del sitio.
 *
 * No está en el menú, no está en el sitemap y lleva noindex. Es un enlace que
 * se manda a un cliente cuando hace falta, no una página del sitio — por eso
 * tampoco usa el layout con encabezado y pie.
 *
 * Cuatro decisiones que vale la pena dejar dichas:
 *
 * MANDA EL NOMBRE. Antes cada lámina abría con un titular de autor y había que
 * leer un párrafo para saber de qué servicio se hablaba. Ahora lo primero que
 * se ve es SITIOS WEB, y debajo qué incluye. Esto se enseña en una junta, no se
 * lee en un sillón.
 *
 * CABE EN UN TELÉFONO. Nombre, descripción, escena y tres tarjetas están
 * dimensionados para entrar en una pantalla de teléfono sin scroll. La escena
 * es lo que cede: en móvil se recorta a media pantalla. Si aun así no cabe, la
 * lámina hace scroll interno en vez de cortar contenido, que es el mal menor.
 *
 * EL TEXTO NO SE ANIMA. Entra completo y lo que se mueve es el bloque y las
 * tarjetas. Un titular que aparece letra por letra se ve bonito una vez y
 * estorba las otras diez.
 *
 * Y LAS TRANSICIONES SON CORTAS: 240 ms con ease-out. Un deck se navega con
 * flechas decenas de veces en una junta; por encima de 300 ms empieza a
 * sentirse que la presentación va más lenta que quien la enseña.
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

/*
 * La lámina que pide la dirección: /service-presentation#espectaculares.
 *
 * Sirve para mandarle a un cliente el servicio que le interesa sin obligarlo a
 * pasar seis láminas, y de paso hace que cada una se pueda abrir en frío.
 */
function laminaDelHash(): number {
  const h = decodeURIComponent(location.hash.replace('#', '')).trim().toLowerCase();
  if (!h) return 0;
  const porId = LAMINAS.findIndex((l) => l.id === h);
  if (porId >= 0) return porId;
  const n = Number(h);
  return Number.isInteger(n) && n >= 1 && n <= LAMINAS.length ? n - 1 : 0;
}

export default function PresentacionServicios() {
  const [i, setI] = useState(laminaDelHash);
  /* Arranca en el idioma que el visitante ya eligió en el sitio, pero de ahí
     en adelante el deck lleva el suyo: cambiarlo desde aquí no debe rehacer
     el árbol y mandarte de vuelta a la lámina uno a media presentación. */
  const [idioma, setIdioma] = useState<Idioma>(() => idiomaVigente() as Idioma);
  const [tema, setTema] = useState<'oscuro' | 'claro'>('oscuro');
  const [menu, setMenu] = useState(false);
  const [rumbo, setRumbo] = useState(1);
  const tocaX = useRef(0);
  const quieto = useReducedMotion();

  const total = LAMINAS.length;
  const lamina = LAMINAS[i];
  const t = (k: keyof typeof UI) => UI[k][idioma];

  const ir = useCallback(
    (n: number) => {
      const d = Math.max(0, Math.min(total - 1, n));
      setRumbo(d > i ? 1 : -1);
      setI(d);
    },
    [i, total],
  );

  /* Esto se navega con el teclado en una junta. Sin animación de más y sin
     capturar teclas que el navegador necesita. Con el índice abierto las
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

  /* Y al revés: si la dirección cambia con el deck abierto —alguien pega
     #agentes en la barra o sigue un enlace a otra lámina— el deck la sigue.
     Antes el hash solo se leía al montar, y cambiarlo movía la URL pero no la
     lámina. replaceState no dispara hashchange, así que esto no hace eco con
     la sincronización de abajo. */
  useEffect(() => {
    const alCambiar = () => {
      const n = laminaDelHash();
      if (n !== i) ir(n);
    };
    addEventListener('hashchange', alCambiar);
    return () => removeEventListener('hashchange', alCambiar);
  }, [i, ir]);

  /* La dirección sigue a la lámina. replaceState y no push: el botón de atrás
     del navegador debe sacarte del deck, no recorrerte las once láminas. */
  useEffect(() => {
    const h = `#${LAMINAS[i].id}`;
    if (location.hash !== h) history.replaceState(null, '', h);
  }, [i]);

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
  const portada = lamina.id === 'portada';
  const cierre = lamina.id === 'cierre';
  const suelta = portada || cierre;          // láminas sin escena ni tarjetas
  const tarjetas = lamina.tarjetas[idioma];

  /* Con prefers-reduced-motion se apaga el desplazamiento y queda el fundido.
     Menos movimiento no es cero animación: el fundido sigue explicando que la
     lámina cambió. */
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
      <header className="relative z-30 flex shrink-0 items-center justify-between px-4 py-2.5 md:px-9 md:py-5">
        <button
          onClick={() => ir(0)}
          title={idioma === 'es' ? 'Volver al inicio' : 'Back to the start'}
          className="transition-transform duration-150 active:scale-[0.96]"
        >
          <span className="flex md:hidden">
            <Logotipo escala={0.85} bajada={false} className="flex" />
          </span>
          <span className="hidden md:flex">
            <Logotipo escala={1} className="flex" />
          </span>
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
        abierto={menu}
        cerrar={() => setMenu(false)}
        ir={ir}
        actual={i}
        idioma={idioma}
      />

      {/* la lámina */}
      <main className="relative z-10 flex min-h-0 flex-1 items-center overflow-y-auto overscroll-contain px-4 pb-2 md:px-9">
        <div className="mx-auto w-full max-w-6xl py-1 md:py-2">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={lamina.id}
              initial={entra}
              animate={{ opacity: 1, y: 0 }}
              exit={{ ...sale, transition: { duration: 0.14, ease: SAL } }}
              transition={{ duration: 0.24, ease: SAL }}
              className={suelta ? 'flex flex-col items-center gap-7 text-center' : ''}
            >
              {suelta ? (
                /* ── portada y cierre: una sola columna, centrada ── */
                /*
                  w-full y containerType van juntos: una caja que se mide a sí
                  misma (container-type) no puede encogerse al contenido, o
                  colapsa a cero. Con w-full mide lo que le da la lámina, hasta
                  768, y el título se escala contra eso.
                */
                <div className="flex w-full max-w-3xl flex-col items-center" style={{ containerType: 'inline-size' }}>
                  {portada && (
                    <div className="mb-7 md:mb-9">
                      <Logotipo escala={2} className="flex md:hidden" />
                      <Logotipo escala={2.8} className="hidden md:flex" />
                    </div>
                  )}

                  {!portada && (
                    <p
                      className="mb-2.5 font-mono text-[10px] uppercase tracking-[.24em] md:mb-3.5 md:text-[11.5px]"
                      style={{ color: 'var(--p-morado)' }}
                    >
                      {lamina.kicker[idioma]}
                    </p>
                  )}

                  {/*
                    Aquí las líneas vienen partidas a mano («LET US START» /
                    «BY MEASURING») y deben quedarse así, así que manda la línea
                    más ancha y no la palabra. La más ancha de las dos láminas,
                    en los dos idiomas, es «BY MEASURING»: 10.15 px por px de
                    cuerpo. A 9cqw ocupa el 91 % de la columna. Con 8.2vw y un
                    mínimo de 34 px partía cada línea en dos y el cierre en
                    inglés se pasaba 43 px de la lámina.

                    La portada lleva su propio factor porque su línea más ancha
                    («SERVICIOS», 7.24) deja crecer más el nombre sin romperlo.
                  */}
                  <h1
                    className="heading whitespace-pre-line leading-[0.94]"
                    style={{
                      color: 'var(--p-tinta)',
                      fontSize: portada ? 'clamp(28px, 10.5cqw, 76px)' : 'clamp(22px, 9cqw, 76px)',
                    }}
                  >
                    {lamina.nombre[idioma]}
                  </h1>

                  <p
                    className="mt-3 max-w-[58ch] text-[13.5px] leading-[1.55] md:mt-5 md:text-[16px] md:leading-[1.6]"
                    style={{ color: 'var(--p-suave)' }}
                  >
                    {lamina.descripcion[idioma]}
                  </p>

                  {portada && (
                    <button
                      onClick={() => ir(1)}
                      className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
                      style={{ background: 'linear-gradient(120deg,#7700CE,#9933FF)' }}
                    >
                      {t('empezar')}
                      <ArrowRight size={17} />
                    </button>
                  )}

                  {cierre && <Cierre idioma={idioma} t={t} />}
                </div>
              ) : (
                /*
                 * ── una lámina de servicio ──
                 *
                 * Arriba, el nombre a la izquierda y la escena a la derecha. La
                 * escena YA NO vive en un recuadro: en escritorio se sale del
                 * contenedor con un margen negativo hasta el borde de la
                 * ventana, sin marco y con el fondo transparente, para que sus
                 * resplandores se mezclen con los de la lámina. Es parte de la
                 * diapositiva, no una ilustración pegada al lado.
                 *
                 * Abajo, las tres tarjetas a lo ancho. En rejilla y no en lista:
                 * tres tiras horizontales se leen como un menú; tres tarjetas se
                 * leen como tres argumentos.
                 */
                <div className="flex flex-col">
                  <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
                    {/*
                      containerType hace que el nombre se mida contra SU columna
                      y no contra la ventana. Sin esto, «ESPECTACULARES» a 62 px
                      se salía de la columna y se metía debajo de la escena.
                    */}
                    <div className="min-w-0 lg:order-first" style={{ containerType: 'inline-size' }}>
                      <p
                        className="mb-2 font-mono text-[10px] uppercase tracking-[.24em] md:mb-3 md:text-[11.5px]"
                        style={{ color: 'var(--p-morado)' }}
                      >
                        {lamina.kicker[idioma]}
                      </p>

                      {/*
                        7.6cqw no es un numero de gusto: es una medida.
                        «ESPECTACULARES», que es la palabra mas ancha de todo el
                        guion, ocupa 12.55 px de ancho por cada px de cuerpo en
                        Hanson. A 7.6 % de la columna la palabra se come el 95 %
                        del ancho y nunca lo pasa, ni en un telefono de 320 ni en
                        una pantalla de 1920. Con 9cqw se salia 83 px por la
                        derecha y se cortaba la ultima letra.

                        El minimo baja a 18 px por lo mismo: un minimo alto
                        vuelve a desbordar en cuanto la columna es muy angosta.
                      */}
                      <h1
                        className="heading whitespace-pre-line leading-[0.94]"
                        style={{ color: 'var(--p-tinta)', fontSize: 'clamp(18px, 7.6cqw, 60px)' }}
                      >
                        {lamina.nombre[idioma]}
                      </h1>

                      <p
                        className="mt-2 max-w-[52ch] text-[13px] leading-[1.5] md:mt-4 md:text-[15.5px] md:leading-[1.6]"
                        style={{ color: 'var(--p-suave)' }}
                      >
                        {lamina.descripcion[idioma]}
                      </p>
                    </div>

                    {/*
                      La escena, sangrando hasta el borde de la ventana.

                      El margen negativo vale exactamente el hueco que queda
                      entre el contenedor y el borde: la mitad de lo que sobra
                      del max-w-6xl, o el relleno lateral si la ventana es más
                      angosta que eso. Con un porcentaje no funcionaba —en un
                      margen se mide contra la columna de la rejilla, no contra
                      el contenedor— y la escena se salía trescientos píxeles.
                    */}
                    <div className="order-first mb-4 min-w-0 lg:order-none lg:mb-0 lg:-mr-[calc(max(2.25rem,(100vw-72rem)/2))]">
                      <EscenaVideo
                        nombre={lamina.escena}
                        idioma={idioma}
                        tema={tema}
                        quieto={!!quieto}
                      />
                    </div>
                  </div>

                  {tarjetas.length > 0 && (
                    <ul className="mt-3 grid gap-2 md:mt-5 md:gap-4 lg:grid-cols-3">
                      {tarjetas.map((c, n) => (
                        <TarjetaIncluye key={c.t} tarjeta={c} n={n} quieto={!!quieto} />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* mandos: dónde estoy, qué estoy viendo y cómo sigo */}
      <footer
        className="relative z-20 flex shrink-0 items-center justify-between gap-3 border-t px-4 py-2.5 md:px-9 md:py-4"
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
 * Una tarjeta de «qué incluye».
 *
 * El número va en mono y morado, el titular en la display y la línea de abajo
 * en cuerpo: tres pesos distintos dentro de una caja chica, que es lo que
 * permite leerla de un vistazo desde el otro lado de una mesa.
 *
 * Entran escalonadas a 45 ms. Es la diferencia entre tres cajas que aparecen
 * de golpe y una lista que se arma: cuesta 135 ms en total y no bloquea nada.
 */
function TarjetaIncluye({ tarjeta, n, quieto }: { tarjeta: Tarjeta; n: number; quieto: boolean }) {
  return (
    <motion.li
      initial={quieto ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 + n * 0.055, ease: SAL }}
      /*
       * Tira en teléfono, tarjeta en escritorio.
       *
       * Apiladas y a lo alto en una pantalla chica ocupan casi cien píxeles más
       * cada una y ya no cabe la lámina. En escritorio hay ancho de sobra y tres
       * tarjetas se leen como tres argumentos; tres tiras se leen como un menú.
       */
      className={[
        'flex items-start gap-3 rounded-2xl border px-3.5 py-2 md:gap-4 md:px-5 md:py-3.5',
        'lg:flex-col lg:gap-0 lg:px-5 lg:py-4',
      ].join(' ')}
      style={{
        borderColor: 'var(--p-linea)',
        background: 'linear-gradient(158deg, rgba(255,255,255,.055), rgba(255,255,255,.015))',
        boxShadow: '0 10px 26px rgba(0,0,0,.28)',
      }}
    >
      <span
        className={[
          'mt-[3px] shrink-0 font-mono text-[11px] tabular-nums md:text-[12px]',
          'lg:mb-2 lg:mt-0 lg:grid lg:h-8 lg:w-8 lg:place-items-center lg:rounded-full lg:text-[12px]',
        ].join(' ')}
        style={{ color: 'var(--p-morado)', background: 'var(--p-moradoSuave)' }}
      >
        {String(n + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <p
          className="heading text-[13.5px] leading-tight md:text-[16px] lg:text-[16.5px]"
          style={{ color: 'var(--p-tinta)' }}
        >
          {tarjeta.t}
        </p>
        <p
          className="mt-0.5 text-[11.5px] leading-[1.45] [@media(max-height:780px)_and_(max-width:1023px)]:hidden [@media(max-height:620px)]:hidden md:mt-1 md:text-[13.5px] lg:mt-1.5 lg:text-[12.5px] lg:leading-[1.5]"
          style={{ color: 'var(--p-suave)' }}
        >
          {tarjeta.d}
        </p>
      </div>
    </motion.li>
  );
}

/* El cierre: la marca en grande y las tres formas de contestar. */
function Cierre({ idioma, t }: { idioma: Idioma; t: (k: keyof typeof UI) => string }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-7">
      <Logotipo escala={1.9} className="flex" />

      <div className="flex flex-wrap justify-center gap-2.5">
        <a
          href={`https://wa.me/${CONTACTO.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-white transition-transform duration-150 active:scale-[0.97]"
          style={{ background: 'linear-gradient(120deg,#7700CE,#9933FF)' }}
        >
          <MessageCircle size={17} />
          {t('escribir')}
        </a>
        <a
          href={`mailto:${CONTACTO.correo}`}
          className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[14px] font-bold transition-transform duration-150 active:scale-[0.97]"
          style={{ borderColor: 'var(--p-linea)', color: 'var(--p-tinta)' }}
        >
          <Mail size={17} />
          {t('correo')}
        </a>
      </div>

      {/* El número escrito, no solo enlazado: media junta se anota en papel. */}
      <div
        className="flex flex-col items-center gap-1.5 font-mono text-[12.5px] md:flex-row md:gap-5"
        style={{ color: 'var(--p-mudo)' }}
      >
        <a
          href={`tel:${CONTACTO.whatsapp}`}
          className="inline-flex items-center gap-1.5 transition-colors"
          style={{ color: 'var(--p-suave)' }}
        >
          <Phone size={13} />
          {CONTACTO.telefono}
        </a>
        <span aria-hidden="true" className="hidden md:inline">·</span>
        <span>{CONTACTO.sitio}</span>
      </div>
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
