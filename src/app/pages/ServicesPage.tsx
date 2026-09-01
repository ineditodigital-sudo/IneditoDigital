import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

/* Entrada estandar del sitio: aparecer subiendo, una sola vez. */
const entra = (retraso = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay: retraso },
});

export default function ServicesPage() {
  const t = contenido('servicios', 'encabezado');
  const tNiv = contenido('servicios', 'niveles');
  const tTar = contenido('servicios', 'tarjeta');
  const { services: todosLosServicios } = useApp();
  /* El catalogo muestra el que hacemos, no donde lo hacemos: las landings de
     ciudad viven aparte y se llega a ellas desde el bloque de cobertura. */
  const services = todosLosServicios.filter((s) => s.category !== 'Cobertura');

  /* Los tres niveles del documento de dirección. Antes de la lista de fichas,
     porque la pregunta que trae a la gente no es "qué servicios hay" sino
     "en qué punto estoy yo". */
  const niveles = [
    {
      verbo: tNiv('n1_verbo', 'CONSTRUIR'),
      lema: tNiv('n1_lema', 'Presencia desde cero'),
      texto: tNiv('n1_texto', 'Para empresas que no tienen nada de presencia digital. Web que pasa PageSpeed con SEO, AEO y GEO desde el día uno, ficha de Google, LinkedIn armado y tablero base.'),
      promesa: tNiv('n1_promesa', 'Cuando te busquen, existes y te ves formal.'),
      enlace: '',
    },
    {
      verbo: tNiv('n2_verbo', 'MEJORAR'),
      lema: tNiv('n2_lema', 'Presencia que compite'),
      texto: tNiv('n2_texto', 'Para empresas con web y redes mal trabajadas. Se entra por la auditoría con IA: del diagnóstico sale el plan de mejora.'),
      promesa: tNiv('n2_promesa', 'Te decimos exactamente qué está mal y lo arreglamos.'),
      enlace: tNiv('n2_enlace', '/servicios/auditoria-con-ia'),
    },
    {
      verbo: tNiv('n3_verbo', 'VENDER'),
      lema: tNiv('n3_lema', 'Presencia que convierte'),
      texto: tNiv('n3_texto', 'Para empresas que ya tienen todo y quieren resultados. Canales de venta, campañas con tablero unificado y, cuando hay ERP, cruce de prospectos contra ventas cerradas.'),
      promesa: tNiv('n3_promesa', 'Cada peso invertido se mide contra ventas reales.'),
      enlace: '',
    },
  ];

  return (
    <>
      <SEO
        title="Servicios · Agencia de marketing digital y publicidad en Aguascalientes"
        description="Marketing digital, publicidad, mercadotecnia y contenido para empresas de Aguascalientes. Tres niveles según en qué punto estés: construir, mejorar o vender."
        keywords={['agencia de publicidad aguascalientes', 'agencia de mercadotecnia', 'servicios marketing digital', 'agencia de contenido digital', 'seo aguascalientes']}
      />

      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <h1 className="heading mb-6 text-4xl md:text-6xl">
              {t('titulo_1', 'NUESTROS')}{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(100deg,#9933FF,#AA66FF)' }}
              >
                {t('titulo_2', 'SERVICIOS')}
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-white/80 md:text-xl">
              {t('bajada', 'Marketing digital, publicidad, mercadotecnia y contenido para empresas de Aguascalientes. Todo conectado a datos reales y medido hasta la venta.')}
            </p>
          </motion.div>

          {/* ------------------------------------------------ los tres niveles */}
          {tNiv.visible() && (
            <div className="mb-20">
              <motion.h2 {...entra()} className="heading mb-3 text-center text-2xl md:text-3xl">
                {tNiv('titulo', '¿EN QUÉ PUNTO ESTÁS?')}
              </motion.h2>
              <motion.p {...entra(0.06)} className="mx-auto mb-12 max-w-xl text-center text-white/65">
                {tNiv('bajada', 'El servicio se adapta al grado de posicionamiento de cada empresa. Elige por dónde entrar.')}
              </motion.p>

              <div className="grid gap-5 md:grid-cols-3">
                {niveles.map((n, i) => {
                  const cuerpo = (
                    <article
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 p-7
                                 transition-all duration-300 hover:-translate-y-1 hover:border-[#AA66FF]/40"
                      style={{ background: 'linear-gradient(165deg, rgba(119,0,206,.14), rgba(255,255,255,.02) 62%)' }}
                    >
                      <span
                        className="absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        style={{ background: 'linear-gradient(90deg,transparent,#9933FF,transparent)' }}
                      />
                      <span
                        className="heading absolute right-5 top-4 text-5xl leading-none text-transparent"
                        style={{ WebkitTextStroke: '1px rgba(170,102,255,.28)' }}
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <div className="heading text-2xl leading-tight">{n.verbo}</div>
                      <div className="mt-1 text-sm font-semibold text-[#AA66FF]">{n.lema}</div>
                      <p className="mt-4 text-[14.5px] leading-relaxed text-white/75">{n.texto}</p>
                      <div className="mt-auto border-t border-white/10 pt-4">
                        <p className="text-[13.5px] italic text-white/65">«{n.promesa}»</p>
                        {n.enlace && (
                          <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#AA66FF]">
                            Empezar por aquí
                            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        )}
                      </div>
                    </article>
                  );
                  return (
                    <motion.div key={i} {...entra(i * 0.1)} className="h-full">
                      {n.enlace ? (
                        <Link to={n.enlace} className="block h-full">
                          {cuerpo}
                        </Link>
                      ) : (
                        cuerpo
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------ las fichas */}
          <motion.h2 {...entra()} className="heading mb-10 text-center text-2xl md:text-3xl">
            TODO LO QUE HACEMOS
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div key={service.id} {...entra(Math.min(index * 0.04, 0.4))}>
                <Link to={`/servicios/${service.slug}`}>
                  <GlassCard hover className="group h-full">
                    <div className="mb-4">
                      <span className="mb-4 inline-block rounded-full bg-[#9933FF]/18 px-3 py-1 text-sm text-[#AA66FF]">
                        {service.category}
                      </span>
                      <h3 className="heading mb-3 text-2xl transition-colors group-hover:text-[#AA66FF]">
                        {service.title}
                      </h3>
                      <p className="mb-4 text-white/70">{service.shortDescription}</p>
                    </div>

                    <div className="mb-6 space-y-2">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-white/75">
                          <span className="mt-1 text-[#AA66FF]">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-sm text-[#AA66FF] transition-all group-hover:gap-2">
                      <span>{tTar('ver_mas', 'Ver detalles')}</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
