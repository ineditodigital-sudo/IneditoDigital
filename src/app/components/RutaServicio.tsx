import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';
import { tr } from '../idioma';
import { pasosDelMetodo, diagnosticoDelMetodo } from '../data/metodo';
import { recomendacionesPara, claveDeRuta, type Etapa, type TipoRecomendacion } from '../data/recomendaciones';
import { IconoServicio } from './IconoServicio';

/*
 * «Arma tu ruta», en la ficha de cada servicio.
 *
 * Orienta en vez de vender en combo: según si el negocio empieza de cero o
 * ya funciona, muestra hasta tres servicios con su papel (primero, va con
 * este, más alcance, después, otra ruta) y el porqué en una línea. Qué
 * recomienda a qué vive en data/recomendaciones.ts.
 *
 * La etapa elegida se recuerda (localStorage): quien dijo «empiezo de cero»
 * lo sigue viendo así al saltar de un servicio a otro.
 */

const LLAVE = 'inedito_etapa';

const leerEtapa = (): Etapa => {
  try {
    return localStorage.getItem(LLAVE) === 'cero' ? 'cero' : 'negocio';
  } catch {
    return 'negocio';
  }
};

const entra = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.6 },
};

export function RutaServicio({ className = '' }: { className?: string }) {
  const { pathname } = useLocation();
  const { services } = useApp();
  const t = contenido('servicio-detalle', 'ruta');
  const [etapa, setEtapa] = useState<Etapa>(leerEtapa);

  const lista = recomendacionesPara(claveDeRuta(pathname), etapa);
  if (!lista.length) return null;

  const elegir = (e: Etapa) => {
    setEtapa(e);
    try {
      localStorage.setItem(LLAVE, e);
    } catch {
      /* sin almacenamiento, la elección dura lo que dure la página */
    }
  };

  /* El nombre de cada destino, como lo dice el menú: los pasos y el
     diagnóstico con sus textos del panel; los complementos, con su título. */
  const nombres = new Map<string, string>();
  for (const p of pasosDelMetodo()) for (const it of p.items) nombres.set(it.ruta, it.titulo);
  const diag = diagnosticoDelMetodo();
  nombres.set(diag.ruta, diag.titulo);
  for (const s of services) {
    const ruta = `/servicios/${s.slug}`;
    if (!nombres.has(ruta)) nombres.set(ruta, s.title);
  }

  const tipos: Record<TipoRecomendacion, string> = {
    base: t('tipo_base', 'Primero'),
    complemento: t('tipo_complemento', 'Va con este'),
    alcance: t('tipo_alcance', 'Más alcance'),
    siguiente: t('tipo_siguiente', 'Después'),
    ruta: t('tipo_ruta', 'Otra ruta'),
  };
  const etapas: { clave: Etapa; texto: string }[] = [
    { clave: 'cero', texto: t('etapa_cero', 'Empiezo de cero') },
    { clave: 'negocio', texto: t('etapa_negocio', 'Ya tengo un negocio') },
  ];

  return (
    <section className={`px-4 ${className}`} aria-labelledby="ruta-titulo">
      <div className="container mx-auto max-w-5xl">
        <motion.div {...entra} className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[.18em] text-[#CC66FF]">
              {t('kicker', 'Según tu punto de partida')}
            </div>
            <h2 id="ruta-titulo" className="heading text-3xl md:text-5xl">
              {t('titulo_1', 'ARMA')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
              >
                {t('titulo_2', 'TU RUTA')}
              </span>
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-white/65">
              {t('bajada', 'Lo que conviene antes, junto o en lugar de este servicio, según cómo está tu negocio hoy.')}
            </p>
          </div>

          <div className="shrink-0">
            <div id="ruta-pregunta" className="mb-2 text-xs text-white/50">
              {t('pregunta', '¿Cómo está tu negocio hoy?')}
            </div>
            <div
              role="group"
              aria-labelledby="ruta-pregunta"
              className="inline-flex rounded-full border border-white/12 bg-white/[.04] p-1"
            >
              {etapas.map((e) => (
                <button
                  key={e.clave}
                  type="button"
                  aria-pressed={etapa === e.clave}
                  onClick={() => elegir(e.clave)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                    etapa === e.clave ? 'bg-[#7700CE] text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {e.texto}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Con la etapa como llave: al cambiarla, las tarjetas entran de nuevo
            (ruta-entra) y sus íconos se vuelven a dibujar. */}
        <div key={etapa} className="grid gap-4 md:grid-cols-3">
          {lista.map((r, i) => {
            const nombre = nombres.get(r.a);
            if (!nombre) return null;
            return (
              <Link
                key={`${r.a}-${r.tipo}`}
                to={r.a}
                className="ruta-entra group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[.03] p-5 transition-colors duration-200 hover:border-[#AA66FF]/45 hover:bg-white/[.06]"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <IconoServicio ruta={r.a} retraso={150 + i * 70} />
                  <span className="font-mono text-[10px] uppercase tracking-[.18em] text-[#CC66FF]">
                    {tipos[r.tipo]}
                  </span>
                </div>
                <div className="text-[17px] font-semibold leading-snug text-white">{nombre}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{tr(r.razon)}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-[#AA66FF]">
                  {t('ver', 'Ver el servicio')}
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
