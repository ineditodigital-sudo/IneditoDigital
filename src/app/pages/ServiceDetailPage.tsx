import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, Gamepad2, Camera, Grid3x3 } from 'lucide-react';
import { CatalogoEspectaculares } from '../components/CatalogoEspectaculares';
import { GlassCard } from '../components/GlassCard';
import { FichaServicio } from '../components/FichaServicio';
import { useApp } from '../context/AppContext';
import DynamicSEO from '../components/DynamicSEO';
import { tituloServicio } from '../data/services';
import { contenido } from '../cms';

/*
 * La ficha de un servicio de la colección «Servicios» del panel.
 *
 * El diseño vive en components/FichaServicio, compartido con las páginas de
 * IA; aquí solo se traduce el servicio a esa ficha y se añaden los dos
 * bloques que tiene un solo servicio cada uno: el catálogo de espectaculares
 * y las demos de activaciones para expo.
 */

const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { duration: 0.6, delay: retraso },
});

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { services, openAssistant } = useApp();

  const service = services.find((s) => s.slug === slug);
  const tEnc = contenido('servicio-detalle', 'encabezados');
  const tDem = contenido('servicio-detalle', 'demos');
  const tCie = contenido('servicio-detalle', 'cierre');

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white">{tEnc('no_encontrado', 'Servicio no encontrado')}</p>
      </div>
    );
  }

  /* ---------- CATÁLOGO (solo espectaculares) ----------
     Va justo después de la portada y no al final: quien llega buscando
     «espectacular en tal avenida» viene a ver el mapa, no a leer qué incluye
     el servicio. El mismo catálogo va escrito en el HTML que sirve
     render.php, así que un buscador lo lee sin ejecutar nada de esto. */
  const catalogo =
    service.slug === 'anuncios-espectaculares' ? (
      <section className="px-4 pb-16 md:pb-24">
        {/* Mas ancho que el resto de la pagina: la lista va al lado del mapa y
            a 1024 px de caja las dos columnas quedan apretadas. */}
        <div className="container mx-auto max-w-6xl">
          <motion.h2 {...entra()} className="heading mb-2 text-3xl md:text-5xl">
            {tEnc('cat_1', 'EL')} <span className="text-[#CC66FF]">{tEnc('cat_2', 'CATÁLOGO')}</span>
          </motion.h2>
          <motion.div {...entra(0.06)}>
            <CatalogoEspectaculares />
          </motion.div>
        </div>
      </section>
    ) : null;

  /* ---------- DEMOS (solo activaciones para expo) ---------- */
  const demos =
    slug === 'activaciones-para-expo' && tDem.visible() ? (
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#7700CE]/20 blur-[120px]" />
        </div>
        <div className="container mx-auto max-w-6xl">
          <motion.div {...entra()} className="mb-12 text-center">
            <h2 className="heading mb-4 text-3xl md:text-5xl">
              {tDem('titulo_1', 'PRUEBA NUESTROS')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#CC66FF)' }}
              >
                {tDem('titulo_2', 'DEMOS')}
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-white/70">
              {tDem('bajada', 'Explora en vivo las activaciones interactivas que podemos implementar en tu stand')}
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { Icono: Gamepad2, t: tDem('d1_titulo', 'RULETA DE PREMIOS'), d: tDem('d1_texto', 'Ruleta interactiva totalmente personalizable. Perfecta para sorteos, rifas y dinámicas de gamificación en tu stand.'), u: tDem('d1_url', 'https://ruleta-expo.inedito.digital/demo') },
              { Icono: Camera, t: tDem('d2_titulo', 'PHOTO OPPORTUNITY'), d: tDem('d2_texto', 'Photobooth con marcos personalizados de tu marca. Captura fotos, compártelas y genera engagement viral en redes sociales.'), u: tDem('d2_url', 'https://photo-oportunity.inedito.digital/demo') },
              { Icono: Grid3x3, t: tDem('d3_titulo', 'TIC TAC TOE'), d: tDem('d3_texto', 'Gato interactivo con premios. Juega contra la IA y gana. Diversión garantizada para atraer visitantes a tu stand.'), u: tDem('d3_url', 'https://tic-tac-toe.inedito.digital/demo') },
            ].map(({ Icono, t, d, u }, i) => (
              // A 768 px caben tres tarjetas de 229 px y «OPPORTUNITY» en Hanson
              // mide diez veces su tamaño de letra: el título se ajusta a la tarjeta.
              <motion.div key={i} {...entra(i * 0.1)} style={{ containerType: 'inline-size' }}>
                <GlassCard hover className="group flex h-full flex-col">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#CC66FF]/30 bg-[#CC66FF]/12">
                    <Icono size={22} className="text-[#CC66FF]" />
                  </span>
                  <h3 className="heading mb-2 leading-tight" style={{ fontSize: 'min(20px, 8cqw)' }}>{t}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-white/70">{d}</p>
                  <span className="mb-4 inline-flex w-fit rounded-full bg-[#CC66FF]/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#CC66FF]">
                    {tDem('etiqueta', '✓ DISPONIBLE')}
                  </span>
                  <a
                    href={u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#CC66FF]/30 bg-[#CC66FF]/12 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#CC66FF]/20"
                  >
                    {tDem('boton', 'VER DEMO')}
                    <ExternalLink size={15} />
                  </a>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.div {...entra(0.3)} className="mt-12 text-center">
            <p className="mb-5 text-white/70">
              {tDem('cta_texto', '¿Necesitas una activación personalizada para tu evento?')}
            </p>
            <button
              onClick={() => openAssistant(service.title, 'activacion personalizada')}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7700CE] to-[#9933FF] px-7 py-3.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
            >
              {tDem('cta_boton', 'COTIZAR ACTIVACIÓN PERSONALIZADA')}
              <ArrowRight size={17} />
            </button>
          </motion.div>
        </div>
      </section>
    ) : null;

  const boton = tCie('boton', 'COTIZAR AHORA');

  return (
    <>
      <DynamicSEO
        title={service.seo?.metaTitle || tituloServicio(service.title)}
        description={service.seo?.metaDescription || service.shortDescription}
        keywords={
          service.seo?.keywords?.length
            ? service.seo.keywords
            : [service.title.toLowerCase(), 'marketing digital aguascalientes', service.category.toLowerCase()]
        }
      />

      <FichaServicio
        ficha={{
          slug: service.slug,
          titulo: service.title,
          categoria: service.category,
          bajada: service.shortDescription,
          definicion: service.definicion,
          volver: { a: '/servicios', texto: tEnc('volver', 'Volver a servicios') },
          incluye: service.features,
          beneficios: service.benefits,
          proceso: service.process,
          ideal: service.ideal,
          fondo: (service.fullDescription || '')
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean),
          faq: service.faq,
          nombre: service.title,
          contextoCotizar: `cotizar ${service.title}`,
          boton,
          cierre: {
            titulo: `${tCie('titulo_1', '¿LISTO PARA')} ${tCie('titulo_2', 'COMENZAR?')}`,
            texto: service.shortDescription,
          },
          trasPortada: catalogo,
          trasProceso: demos,
        }}
      />
    </>
  );
}
