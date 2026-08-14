import { useState } from 'react';
import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Download, Search } from 'lucide-react';

export default function AdminLeadsPage() {
  const { leads } = useApp();
  const [filter, setFilter] = useState('all');

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const exportCSV = () => {
    const csv = [
      ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Servicio', 'Mensaje', 'Fecha', 'Estado'],
      ...filteredLeads.map(l => [
        l.name, l.email, l.phone, l.company || '', l.service || '', l.message || '', l.date, l.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading text-4xl mb-2">LEADS</h1>
          <p className="text-white/60">{filteredLeads.length} leads registrados</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7700CE] hover:bg-[#9933FF] text-white transition-all"
        >
          <Download size={18} />
          <span>Exportar CSV</span>
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === status
                ? 'bg-[#7700CE] text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {status === 'all' ? 'Todos' : status}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map(lead => (
            <GlassCard key={lead.id}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="heading text-lg mb-1">{lead.name}</h3>
                  <p className="text-white/60 text-sm">{lead.email} · {lead.phone}</p>
                  {lead.company && <p className="text-white/40 text-sm">Empresa: {lead.company}</p>}
                  {lead.message && <p className="text-white/70 text-sm mt-2">{lead.message}</p>}
                  <p className="text-white/40 text-xs mt-2">
                    {new Date(lead.date).toLocaleString('es-MX')} · {lead.source}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    lead.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                    lead.status === 'converted' ? 'bg-green-500/20 text-green-400' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            </GlassCard>
          ))
        ) : (
          <GlassCard>
            <p className="text-white/40 text-center py-12">No hay leads con este filtro</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
