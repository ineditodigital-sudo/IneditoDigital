import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';

export default function BlogPage() {
  const { blogPosts } = useApp();

  return (
    <>
      <SEO
        title="Blog de Marketing Digital - Tips y Estrategias"
        description="Aprende estrategias de marketing digital, SEO, publicidad, IA y más. Contenido práctico para hacer crecer tu negocio."
      />

      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <h1 className="heading text-4xl md:text-6xl mb-6">
              NUESTRO <span className="text-[#7700CE]">BLOG</span>
            </h1>
            <p className="text-xl text-white/70">
              Estrategias, tips y tendencias de marketing digital que funcionan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <GlassCard hover className="h-full group">
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-white/5">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                      <span className="text-[#7700CE]">{post.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {post.readTime}
                      </span>
                    </div>
                    <h2 className="heading text-xl mb-3 group-hover:text-[#7700CE] transition-colors">{post.title}</h2>
                    <p className="text-white/60 text-sm mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-[#7700CE] text-sm group-hover:gap-2 transition-all">
                      <span>Leer más</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
