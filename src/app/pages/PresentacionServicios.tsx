import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Languages, Moon, Sun, MessageCircle, Mail } from 'lucide-react';
import { LAMINAS, UI, CONTACTO, type Idioma } from '../components/presentacion/contenido';
import { idiomaVigente } from '../idioma';
import { Escena, EscenaOnda } from '../components/presentacion/escenas';

/*
 * La presentación de servicios: un deck que vive fuera del sitio.
 *
 * No está en el menú, no está en el sitemap y lleva noindex. Es un enlace que
 * se manda a un cliente cuando hace falta, no una página del sitio — por eso
 * tampoco usa el layout con encabezado y pie.
 *
 * Tres decisiones que vale la pena dejar dichas:
 *
 * El TEXTO no se anima al cambiar de lámina; entra completo y lo que se mueve
 * es el bloque. Un titular que aparece letra por letra se ve bonito una vez y
 * estorba las otras diez, y esto se pasa delante de un cliente.
 *
 * Las transiciones van en 260 ms con ease-out. Un deck se navega con flechas,
 * decenas de veces en una junta: por encima de 300 ms empieza a sentirse que
 * la presentación va más lenta que quien la enseña.
 *
 * Y el tema no se adivina: arranca en oscuro, que es la casa, pero se puede
 * cambiar. Una sala con proyector y luz encendida pide claro, y eso pasa.
 */

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

export default function PresentacionServicios() {
  const [i, setI] = useState(0);
  /* Arranca en el idioma que el visitante ya eligió en el sitio, pero de ahí
     en adelante el deck lleva el suyo: cambiarlo desde aquí no debe rehacer
     el árbol y mandarte de vuelta a la lámina uno a media presentación. */
  const [idioma, setIdioma] = useState<Idioma>(() => idiomaVigente() as Idioma);
  const [tema, setTema] = useState<'oscuro' | 'claro'>('oscuro');
  const [rumbo, setRumbo] = useState(1);
  const tocaX = useRef(0);

  const total = LAMINAS.length;
  const lamina = LAMINAS[i];
  const t = (k: keyof typeof UI) => UI[k][idioma];

  const ir = useCallback(
    (n: number) => {
      setRumbo(n > i ? 1 : -1);
      setI(Math.max(0, Math.min(total - 1, n)));
    },
    [i, total],
  );

  /* Esto se navega con el teclado en una junta. Sin animación de más y sin
     capturar teclas que el navegador necesita. */
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
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
  }, [i, ir, total]);

  /* Fuera del sitio también quiere decir fuera del índice. */
  useEffect(() => {
    document.title =
      idioma === 'es'
        ? 'Presentación de servicios · Inédito Digital'
        : 'Services presentation · Inédito Digital';
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

  return (
    <div
      style={{ ...vars, background: 'var(--p-fondo)', color: 'var(--p-tinta)' }}
      className="relative flex min-h-[100svh] flex-col overflow-hidden transition-colors duration-300"
      onTouchStart={(e) => (tocaX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
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
          transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
        />
      </div>

      {/* barra de arriba */}
      <header className="relative z-10 flex shrink-0 items-center justify-between px-5 py-4 md:px-10 md:py-6">
        <span
          className="heading text-[13px] tracking-[.2em] md:text-[15px]"
          style={{ color: 'var(--p-tinta)' }}
        >
          INÉDITO
        </span>
        <div className="flex items-center gap-2">
          <Boton
            onClick={() => setIdioma((v) => (v === 'es' ? 'en' : 'es'))}
            titulo={t('idioma')}
          >
            <Languages size={15} />
            <span className="text-[12px] font-semibold">{idioma === 'es' ? 'EN' : 'ES'}</span>
          </Boton>
          <Boton onClick={() => setTema((v) => (v === 'oscuro' ? 'claro' : 'oscuro'))} titulo={t('tema')}>
            {tema === 'oscuro' ? <Sun size={15} /> : <Moon size={15} />}
          </Boton>
        </div>
      </header>

      {/* la lámina */}
      <main className="relative z-10 flex flex-1 items-center px-5 pb-4 md:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={lamina.id}
              initial={{ opacity: 0, y: rumbo * 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: rumbo * -14 }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
              className={
                portada || cierre
                  ? 'flex flex-col items-center gap-8 text-center'
                  : 'grid items-center gap-8 lg:grid-cols-2 lg:gap-14'
              }
            >
              <div className={portada || cierre ? 'max-w-3xl' : ''}>
                <p
                  className="mb-4 font-mono text-[10.5px] uppercase tracking-[.22em] md:text-[11.5px]"
                  style={{ color: 'var(--p-morado)' }}
                >
                  {lamina.kicker[idioma]}
                </p>
                <h1
                  className={`heading whitespace-pre-line leading-[0.98] ${
                    portada
                      ? 'text-[38px] sm:text-[52px] lg:text-[68px]'
                      : 'text-[30px] sm:text-[40px] lg:text-[50px]'
                  }`}
                  style={{ color: 'var(--p-tinta)' }}
                >
                  {lamina.titulo[idioma]}
                </h1>
                <p
                  className="mt-5 max-w-[62ch] text-[15px] leading-[1.65] md:text-[16.5px]"
                  style={{ color: 'var(--p-suave)' }}
                >
                  {lamina.bajada[idioma]}
                </p>

                {lamina.puntos[idioma].length > 0 && (
                  <ul className="mt-7 space-y-3">
                    {lamina.puntos[idioma].map((p, n) => (
                      <motion.li
                        key={p}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.34, delay: 0.1 + n * 0.06, ease: [0.23, 1, 0.32, 1] }}
                        className="flex items-start gap-3 text-[14px] md:text-[15px]"
                        style={{ color: 'var(--p-suave)' }}
                      >
                        <span
                          className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full"
                          style={{ background: 'var(--p-morado)' }}
                        />
                        {p}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {cierre && (
                  <div className="mt-9 flex flex-wrap justify-center gap-3">
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
                )}
              </div>

              {!portada && !cierre && (
                <div className="w-full">
                  <Escena nombre={lamina.escena} activo />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* mandos */}
      <footer className="relative z-10 flex shrink-0 items-center justify-between gap-4 px-5 py-5 md:px-10 md:py-7">
        <span className="font-mono text-[11px]" style={{ color: 'var(--p-mudo)' }}>
          {String(i + 1).padStart(2, '0')} <span className="opacity-45">/ {String(total).padStart(2, '0')}</span>
        </span>

        <div className="hidden items-center gap-1.5 sm:flex">
          {LAMINAS.map((l, n) => (
            <button
              key={l.id}
              onClick={() => ir(n)}
              aria-label={`${UI.lamina[idioma]} ${n + 1}`}
              aria-current={n === i}
              className="h-6 px-[3px] transition-transform duration-150 active:scale-90"
            >
              <span
                className="block h-[3px] rounded-full transition-all duration-300"
                style={{
                  width: n === i ? 22 : 9,
                  background: n === i ? 'var(--p-morado)' : 'var(--p-pistaFuerte)',
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Boton onClick={() => ir(i - 1)} titulo={t('anterior')} apagado={i === 0}>
            <ArrowLeft size={16} />
          </Boton>
          <Boton onClick={() => ir(i + 1)} titulo={t('siguiente')} apagado={i === total - 1}>
            <ArrowRight size={16} />
          </Boton>
        </div>
      </footer>

      <p
        className="pointer-events-none absolute bottom-[86px] left-0 right-0 z-0 text-center font-mono text-[10px] tracking-wider opacity-40 md:bottom-[104px]"
        style={{ color: 'var(--p-mudo)' }}
      >
        {i === 0 ? t('navega') : ''}
      </p>
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
}: {
  children: React.ReactNode;
  onClick: () => void;
  titulo: string;
  apagado?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={apagado}
      title={titulo}
      aria-label={titulo}
      className="flex h-10 items-center gap-1.5 rounded-full border px-3.5 transition-[transform,opacity,border-color] duration-150 active:scale-[0.94] disabled:opacity-25"
      style={{ borderColor: 'var(--p-linea)', color: 'var(--p-tinta)' }}
    >
      {children}
    </button>
  );
}
