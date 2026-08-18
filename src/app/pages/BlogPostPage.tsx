import { useParams, Link } from 'react-router';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { contenido } from '../cms';

export default function BlogPostPage() {
  const tNav = contenido('blog', 'navegacion');
  const { slug } = useParams();
  const { blogPosts } = useApp();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return <div className="min-h-screen flex items-center justify-center"><p className="text-white">{contenido('blog', 'navegacion')('no_encontrado', 'Post no encontrado')}</p></div>;

  const formattedDate = new Date(post.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <SEO
        title={post.seo.metaTitle}
        description={post.seo.metaDescription}
        keywords={post.seo.keywords}
        type="article"
        author={post.author}
        publishedTime={post.date}
        image={post.image}
      />

      <article className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span>{tNav('volver', 'Volver al blog')}</span>
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#7700CE]/20 text-[#7700CE] text-sm mb-4">{post.category}</span>
            <h1 className="heading text-4xl md:text-5xl mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-white/60 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime} lectura</span>
              </div>
            </div>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden mb-12 bg-white/5">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <GlassCard className="prose prose-invert prose-lg max-w-none mb-12">
            <div className="text-white/80 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </GlassCard>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
