import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { Target, Users, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="Nosotros - Agencia de Marketing Digital en Aguascalientes"
        description="Conoce a INÉDITO DIGITAL. Agencia de marketing digital en Aguascalientes especializada en IA, automatización y resultados medibles."
      />

      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="heading text-4xl md:text-6xl mb-6">
              SOBRE <span className="text-[#7700CE]">NOSOTROS</span>
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Somos una agencia de marketing digital en Aguascalientes que combina creatividad, tecnología y estrategia para impulsar el crecimiento de negocios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <GlassCard>
              <Target className="text-[#7700CE] mb-4" size={32} />
              <h2 className="heading text-2xl mb-3">NUESTRA MISIÓN</h2>
              <p className="text-white/70">
                Democratizar el acceso a marketing digital de clase mundial para empresas de todos los tamaños en Aguascalientes y México, utilizando IA y automatización para generar resultados medibles y escalables.
              </p>
            </GlassCard>

            <GlassCard>
              <Zap className="text-[#7700CE] mb-4" size={32} />
              <h2 className="heading text-2xl mb-3">NUESTRA VISIÓN</h2>
              <p className="text-white/70">
                Ser la agencia líder en transformación digital en el Bajío, reconocida por nuestra innovación en IA, automatización y resultados consistentes que superan las expectativas de nuestros clientes.
              </p>
            </GlassCard>
          </div>

          <div className="mb-16">
            <h2 className="heading text-3xl mb-8 text-center">NUESTROS VALORES</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard className="text-center">
                <Users className="text-[#7700CE] mx-auto mb-4" size={32} />
                <h3 className="heading text-xl mb-2">TRANSPARENCIA</h3>
                <p className="text-white/60 text-sm">Reportes claros, sin letra pequeña. Sabes exactamente dónde va tu inversión.</p>
              </GlassCard>
              <GlassCard className="text-center">
                <Zap className="text-[#7700CE] mx-auto mb-4" size={32} />
                <h3 className="heading text-xl mb-2">RESULTADOS</h3>
                <p className="text-white/60 text-sm">Nos medimos por ROI real, no por vanity metrics.</p>
              </GlassCard>
              <GlassCard className="text-center">
                <Heart className="text-[#7700CE] mx-auto mb-4" size={32} />
                <h3 className="heading text-xl mb-2">PARTNERSHIP</h3>
                <p className="text-white/60 text-sm">Tu éxito es nuestro éxito. Somos tu equipo de crecimiento.</p>
              </GlassCard>
            </div>
          </div>

          <GlassCard glow className="text-center p-8">
            <h2 className="heading text-3xl mb-4">¿POR QUÉ ELEGIRNOS?</h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-6">
              No somos una agencia más. Combinamos años de experiencia en marketing tradicional con las últimas tecnologías de IA para crear estrategias que realmente funcionan.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="heading text-2xl text-[#7700CE] mb-2">100+</div>
                <div className="text-white/60">Proyectos exitosos</div>
              </div>
              <div>
                <div className="heading text-2xl text-[#7700CE] mb-2">5X</div>
                <div className="text-white/60">ROI promedio</div>
              </div>
              <div>
                <div className="heading text-2xl text-[#7700CE] mb-2">98%</div>
                <div className="text-white/60">Satisfacción del cliente</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
