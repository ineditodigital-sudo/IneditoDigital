import { useParams, Link } from 'react-router';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

export default function PortfolioDetailPage() {
  const tFil = contenido('portafolio', 'filtros');
  const { slug } = useParams();
  const { portfolioItems } = useApp();
  const item = portfolioItems.find(p => p.slug === slug);

  if (!item) return <div className="min-h-screen flex items-center justify-center"><p className="text-white">Proyecto no encontrado</p></div>;

  return (
    <>
      <SEO title={`${item.title} - Caso de Éxito`} description={item.description} />
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <Link to="/portafolio" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>{tFil('volver', 'Volver al portafolio')}</span>
          </Link>
          
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {item.logo && (
                <img 
                  src={item.logo} 
                  alt={`${item.client} logo`} 
                  className="h-12 w-auto object-contain"
                />
              )}
              <span className="inline-block px-3 py-1 rounded-full bg-[#7700CE]/20 text-[#7700CE] text-sm">{item.category}</span>
            </div>
            <h1 className="heading text-4xl md:text-6xl mb-4">{item.title}</h1>
            <p className="text-xl text-white/70">{item.client} · {item.year}</p>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden mb-12 bg-white/5">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <GlassCard>
              <h2 className="heading text-2xl mb-4">EL DESAFÍO</h2>
              <p className="text-white/80">{item.challenge}</p>
            </GlassCard>
            <GlassCard>
              <h2 className="heading text-2xl mb-4">LA SOLUCIÓN</h2>
              <p className="text-white/80">{item.solution}</p>
            </GlassCard>
          </div>

          <div className="mb-12">
            <h2 className="heading text-3xl mb-6 text-center">RESULTADOS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {item.results.map((result, i) => (
                <GlassCard key={i} className="text-center">
                  <div className="heading text-3xl text-[#7700CE] mb-2">{result.value}</div>
                  <div className="text-white/60 text-sm">{result.metric}</div>
                </GlassCard>
              ))}
            </div>
          </div>

          <GlassCard>
            <h2 className="heading text-2xl mb-4">SERVICIOS UTILIZADOS</h2>
            <div className="flex flex-wrap gap-2">
              {item.services.map((service, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-[#7700CE]/20 text-[#7700CE] text-sm">{service}</span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}