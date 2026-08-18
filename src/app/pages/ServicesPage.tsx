import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

export default function ServicesPage() {
  const t = contenido('servicios', 'encabezado');
  const { services } = useApp();

  return (
    <>
      <SEO
        title="Servicios de Marketing Digital en Aguascalientes"
        description="Descubre nuestros servicios de marketing digital: SEO, Google Ads, Desarrollo Web, Chatbots IA, Funnels de venta y más. Resultados reales."
        keywords={['servicios marketing digital', 'seo aguascalientes', 'google ads', 'desarrollo web', 'chatbots ia']}
      />

      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="heading text-4xl md:text-6xl mb-6">
                {t('titulo_1', 'NUESTROS')} <span className="text-[#7700CE]">{t('titulo_2', 'SERVICIOS')}</span>
              </h1>
              <p className="text-xl text-white/70">
                {t('bajada', 'Soluciones digitales integrales que impulsan tu crecimiento con estrategias basadas en resultados')}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/servicios/${service.slug}`}>
                  <GlassCard hover className="h-full group">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#7700CE]/20 text-[#7700CE] text-sm mb-4">
                        {service.category}
                      </span>
                      <h2 className="heading text-2xl mb-3 group-hover:text-[#7700CE] transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-white/60 mb-4">{service.shortDescription}</p>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="text-[#7700CE] mt-1">•</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center text-[#7700CE] text-sm group-hover:gap-2 transition-all">
                      <span>Ver detalles</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
