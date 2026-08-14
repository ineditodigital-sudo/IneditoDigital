import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Users, FileText, BookOpen, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const { leads, blogPosts, portfolioItems, services } = useApp();

  const stats = [
    { name: 'Leads Totales', value: leads.length, icon: Users, color: 'text-[#7700CE]' },
    { name: 'Posts de Blog', value: blogPosts.length, icon: BookOpen, color: 'text-blue-400' },
    { name: 'Casos Portfolio', value: portfolioItems.length, icon: FileText, color: 'text-green-400' },
    { name: 'Servicios', value: services.length, icon: TrendingUp, color: 'text-purple-400' },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading text-4xl mb-2">DASHBOARD</h1>
        <p className="text-white/60">Resumen general del sitio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.name}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">{stat.name}</p>
                  <p className={`heading text-3xl ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={stat.color} size={32} />
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard>
        <h2 className="heading text-2xl mb-4">Leads Recientes</h2>
        {recentLeads.length > 0 ? (
          <div className="space-y-3">
            {recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-white font-medium">{lead.name}</div>
                  <div className="text-white/60 text-sm">{lead.email}</div>
                </div>
                <div className="text-white/40 text-sm">
                  {new Date(lead.date).toLocaleDateString('es-MX')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-center py-8">No hay leads registrados aún</p>
        )}
      </GlassCard>
    </div>
  );
}
