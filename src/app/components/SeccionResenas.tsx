import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { contenido } from '../cms';
import { tr, useIdioma, type Idioma } from '../idioma';

/*
 * Las opiniones de Google de cinco estrellas, en carrusel.
 *
 * Vienen de la ficha de Google: el panel las sincroniza una vez al día
 * (panel/inc/resenas.php) y render.php las deja en localStorage como
 * «inedito_resenas», ya filtradas —solo cinco estrellas y con texto— y con el
 * nombre recortado a nombre e inicial. Si todavía no hay ninguna, la sección
 * no se pinta: no hay respaldo en el código, porque una opinión inventada es
 * justo lo que esto no puede tener.
 *
 * Sin schema de Review a propósito: Google no acepta las reseñas de un
 * negocio sobre sí mismo y marcarlas se lee como spam.
 */

type ApiEmbla = NonNullable<UseEmblaCarouselType[1]>;
type Resena = { nombre: string; texto: string; texto_en?: string; fecha: string; aprox?: boolean };
type Resenas = { promedio: number; total: number; url: string; lista: Resena[] };

function leerResenas(): Resenas | null {
  try {
    const crudo = localStorage.getItem('inedito_resenas');
    if (!crudo) return null;
    const r = JSON.parse(crudo);
    if (!r || !Array.isArray(r.lista)) return null;
    const lista = r.lista.filter((x: Resena) => x && typeof x.texto === 'string' && x.texto.trim() !== '');
    return lista.length ? { ...r, lista } : null;
  } catch {
    return null;
  }
}

/** «hace 3 semanas», «hace 7 meses»: como lo dice la ficha de Google. */
function hace(fecha: string, idioma: Idioma): string {
  const t = Date.parse(`${fecha}T12:00:00`);
  if (Number.isNaN(t)) return '';
  const dias = Math.max(0, Math.round((Date.now() - t) / 86_400_000));
  const rtf = new Intl.RelativeTimeFormat(idioma === 'en' ? 'en' : 'es-MX', { numeric: 'always' });
  if (dias < 1) return idioma === 'en' ? 'today' : 'hoy';
  if (dias < 7) return rtf.format(-dias, 'day');
  if (dias < 30) return rtf.format(-Math.floor(dias / 7), 'week');
  const meses = Math.round(dias / 30.44);
  if (meses < 12) return rtf.format(-Math.max(1, meses), 'month');
  return rtf.format(-Math.max(1, Math.round(dias / 365.25)), 'year');
}

/** La «G» de Google: dice de dónde vienen sin tener que leerlo. */
function LogoGoogle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function Estrellas({ tam = 15 }: { tam?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[#FBBC04]" role="img" aria-label={tr('Cinco estrellas')}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={tam} fill="currentColor" strokeWidth={0} aria-hidden />
      ))}
    </span>
  );
}

function Tarjeta({ r, idioma }: { r: Resena; idioma: Idioma }) {
  const traducida = idioma === 'en' && !!r.texto_en;
  const texto = traducida ? (r.texto_en as string) : r.texto;
  const nota = idioma === 'en' ? (traducida ? tr('Traducida del español') : tr('Reseña en español')) : '';
  const [abierta, setAbierta] = useState(false);
  const [larga, setLarga] = useState(false);
  const parrafo = useRef<HTMLParagraphElement>(null);

  /* «Leer completa» solo cuando el recorte de verdad corta algo. Se vuelve
     a medir si la tarjeta cambia de ancho (girar el teléfono, otro corte). */
  useLayoutEffect(() => {
    const p = parrafo.current;
    if (!p || abierta) return;
    const medir = () => setLarga(p.scrollHeight > p.clientHeight + 2);
    medir();
    const ojo = new ResizeObserver(medir);
    ojo.observe(p);
    return () => ojo.disconnect();
  }, [texto, abierta]);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[.035] p-6 transition-colors duration-300 hover:border-[#AA66FF]/35 md:p-7">
      <div className="mb-4 flex items-center justify-between">
        <Estrellas />
        <LogoGoogle className="h-[18px] w-[18px] opacity-90" />
      </div>
      <blockquote className="flex-1">
        <p
          ref={parrafo}
          className={`whitespace-pre-line text-[15px] leading-relaxed text-white/85 ${abierta ? '' : 'line-clamp-6'}`}
        >
          {texto}
        </p>
        {(larga || abierta) && (
          <button
            type="button"
            onClick={() => setAbierta((a) => !a)}
            className="mt-2 text-[13px] font-medium text-[#CC99FF] transition-colors hover:text-white"
          >
            {abierta ? tr('Ver menos') : tr('Leer completa')}
          </button>
        )}
      </blockquote>
      <footer className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#7700CE,#AA66FF)' }}
        >
          {r.nombre.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{r.nombre}</div>
          <div className="text-xs text-white/50">
            {hace(r.fecha, idioma)}
            {nota && ` · ${nota}`}
          </div>
        </div>
      </footer>
    </article>
  );
}

function Carrusel({ datos, enlace, etiqueta }: { datos: Resenas; enlace: string; etiqueta: string }) {
  const { idioma } = useIdioma();
  const [viewport, api] = useEmblaCarousel({ loop: true, align: 'start' });
  const [actual, setActual] = useState(0);
  /* Quien toca el carrusel toma el control: desde ahí ya no avanza solo. */
  const tomado = useRef(false);

  useEffect(() => {
    if (!api) return;
    const alElegir = (a: ApiEmbla) => setActual(a.selectedScrollSnap());
    const tomar = () => { tomado.current = true; };
    alElegir(api);
    api.on('select', alElegir).on('reInit', alElegir).on('pointerDown', tomar);
    return () => { api.off('select', alElegir).off('reInit', alElegir).off('pointerDown', tomar); };
  }, [api]);

  /* Avanza solo cada 6.5 s, pero solo si se está viendo, nadie lo tiene
     bajo el cursor o el foco, y quien lee no pidió menos movimiento. */
  useEffect(() => {
    if (!api || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const raiz = api.rootNode();
    let enVista = false;
    let encima = false;
    const ojo = new IntersectionObserver(([e]) => { enVista = e.isIntersecting; }, { threshold: 0.35 });
    ojo.observe(raiz);
    const entra = () => { encima = true; };
    const sale = () => { encima = false; };
    raiz.addEventListener('mouseenter', entra);
    raiz.addEventListener('mouseleave', sale);
    raiz.addEventListener('focusin', entra);
    raiz.addEventListener('focusout', sale);
    const reloj = window.setInterval(() => {
      if (enVista && !encima && !tomado.current && document.visibilityState === 'visible') api.scrollNext();
    }, 6500);
    return () => {
      window.clearInterval(reloj);
      ojo.disconnect();
      raiz.removeEventListener('mouseenter', entra);
      raiz.removeEventListener('mouseleave', sale);
      raiz.removeEventListener('focusin', entra);
      raiz.removeEventListener('focusout', sale);
    };
  }, [api]);

  const ir = useCallback((hacia: 'prev' | 'next') => {
    tomado.current = true;
    if (hacia === 'prev') api?.scrollPrev();
    else api?.scrollNext();
  }, [api]);

  const n = datos.lista.length;
  const dos = (x: number) => String(x).padStart(2, '0');

  return (
    <div role="region" aria-roledescription={tr('carrusel')} aria-label={etiqueta}>
      <div ref={viewport} className="overflow-hidden">
        <div className="-ml-4 flex touch-pan-y [backface-visibility:hidden]">
          {datos.lista.map((r, i) => (
            <div
              key={`${r.nombre}-${r.fecha}-${i}`}
              role="group"
              aria-roledescription={tr('opinión')}
              aria-label={`${i + 1} / ${n}`}
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <Tarjeta r={r} idioma={idioma} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <a
          href={datos.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[#CC99FF] transition-colors hover:text-white"
        >
          {enlace}
          <ArrowUpRight size={15} aria-hidden />
        </a>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[.2em] text-white/45" aria-hidden>
            {dos(actual + 1)} / {dos(n)}
          </span>
          {(['prev', 'next'] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => ir(h)}
              aria-label={h === 'prev' ? tr('Opinión anterior') : tr('Siguiente opinión')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[.04] text-white/80 transition-[transform,border-color,color] duration-150 ease-out hover:border-[#AA66FF]/50 hover:text-white active:scale-[0.96]"
            >
              {h === 'prev' ? <ChevronLeft size={18} aria-hidden /> : <ChevronRight size={18} aria-hidden />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * La sección completa. `pagina` dice de qué página del panel salen sus
 * textos (home o nosotros); `banda` la pinta sobre el fondo oscuro que usan
 * las secciones alternas.
 */
export default function SeccionResenas({ pagina, banda = false }: { pagina: string; banda?: boolean }) {
  const t = contenido(pagina, 'resenas');
  const [datos] = useState(leerResenas);
  if (!t.visible() || !datos) return null;

  const titulo = t('titulo', 'LO QUE DICEN NUESTROS CLIENTES');

  return (
    <section
      aria-labelledby={`resenas-${pagina}`}
      className={`relative overflow-hidden px-4 py-14 md:px-6 md:py-20 lg:px-8 ${
        banda ? 'border-y border-[#AA66FF]/12 bg-[#0D0010]' : ''
      }`}
    >
      <div className="container relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-9 text-center md:mb-11"
        >
          <span className="mb-4 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[.2em] text-[#AA66FF]">
            <span aria-hidden className="h-px w-8 bg-[#AA66FF]/60" />
            {t('etiqueta', 'OPINIONES EN GOOGLE')}
            <span aria-hidden className="h-px w-8 bg-[#AA66FF]/60" />
          </span>
          <h2 id={`resenas-${pagina}`} className="heading mb-5 text-2xl [text-wrap:balance] md:text-4xl">
            {titulo}
          </h2>
          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-full border border-white/10 bg-white/[.04] px-5 py-2.5">
            <LogoGoogle className="h-5 w-5" />
            <span className="heading text-lg leading-none">{datos.promedio.toFixed(1)}</span>
            <Estrellas tam={16} />
            <span className="text-sm text-white/65">
              {datos.total} {tr('opiniones en Google')}
            </span>
          </div>
        </motion.div>

        <Carrusel datos={datos} enlace={t('enlace', 'Ver todas en Google')} etiqueta={titulo} />
      </div>
    </section>
  );
}
