import { useState } from 'react';
import { toast } from 'sonner';
import { GlassCard } from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Trash2, RefreshCw, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Configuración guardada correctamente');
  };

  const handleClearCache = () => {
    if (confirm('¿Estás seguro? Esto limpiará todos los datos en caché del navegador y recargará la página.')) {
      // Clear all localStorage except session
      const session = localStorage.getItem('inedito_session');
      const admin = localStorage.getItem('inedito_admin');
      const leads = localStorage.getItem('inedito_leads');
      const settings = localStorage.getItem('inedito_settings');
      
      localStorage.clear();
      
      // Restore critical data
      if (session) localStorage.setItem('inedito_session', session);
      if (admin) localStorage.setItem('inedito_admin', admin);
      if (leads) localStorage.setItem('inedito_leads', leads);
      if (settings) localStorage.setItem('inedito_settings', settings);
      
      toast.success('Caché limpiado exitosamente. Recargando...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleHardReset = () => {
    if (confirm('⚠️ ADVERTENCIA: Esto eliminará TODOS los datos incluyendo leads y configuración. ¿Estás seguro?')) {
      const secondConfirm = confirm('Esta acción NO se puede deshacer. ¿Continuar?');
      if (secondConfirm) {
        localStorage.clear();
        toast.success('Reset completo realizado. Recargando...');
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="heading text-4xl mb-2">AJUSTES</h1>
        <p className="text-white/60">Configuración del sitio web</p>
      </div>

      {/* Cache Management Section */}
      <GlassCard>
        <h2 className="heading text-2xl mb-4 flex items-center gap-2">
          <Database className="size-6" />
          GESTIÓN DE CACHÉ
        </h2>
        <p className="text-white/60 mb-4 text-sm">
          Si experimentas problemas con páginas que no cargan o contenido desactualizado, 
          puedes limpiar el caché del navegador aquí.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={handleClearCache}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center gap-2"
          >
            <RefreshCw className="size-4" />
            <span className="heading tracking-[0.08em] text-sm">LIMPIAR CACHÉ</span>
          </Button>
          <Button
            type="button"
            onClick={handleHardReset}
            variant="destructive"
            className="px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            <span className="heading tracking-[0.08em] text-sm">RESET COMPLETO</span>
          </Button>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-yellow-200 text-xs">
            <strong>Limpiar Caché:</strong> Elimina contenido en caché (servicios, blog, portafolio) pero mantiene leads y configuración.<br/>
            <strong>Reset Completo:</strong> Elimina TODOS los datos incluyendo leads y configuración. Usar solo en emergencias.
          </p>
        </div>
      </GlassCard>

      <form onSubmit={handleSubmit} className="space-y-6">
        <GlassCard>
          <h2 className="heading text-2xl mb-4">WhatsApp</h2>
          <div>
            <label className="block text-white/80 mb-2">Número de WhatsApp</label>
            <Input
              type="text"
              value={formData.whatsappNumber}
              onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
              className="bg-white/5 border-white/10 text-white"
              placeholder="5214495839229"
            />
            <p className="text-white/40 text-xs mt-1">Formato: 5214495839229 (código de país + número sin espacios ni guiones)</p>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="heading text-2xl mb-4">Información del Negocio</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2">Nombre del Negocio</label>
              <Input
                type="text"
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Teléfono</label>
              <Input
                type="text"
                value={formData.businessPhone}
                onChange={e => setFormData({...formData, businessPhone: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Email</label>
              <Input
                type="email"
                value={formData.businessEmail}
                onChange={e => setFormData({...formData, businessEmail: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Horario</label>
              <Input
                type="text"
                value={formData.businessHours}
                onChange={e => setFormData({...formData, businessHours: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Dirección</label>
              <Input
                type="text"
                value={formData.businessAddress}
                onChange={e => setFormData({...formData, businessAddress: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Ciudad</label>
              <Input
                type="text"
                value={formData.businessCity}
                onChange={e => setFormData({...formData, businessCity: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </GlassCard>

        <Button type="submit" className="w-full md:w-auto px-8 py-6 bg-[#7700CE] hover:bg-[#9933FF] rounded-full">
          <span className="heading tracking-[0.08em]">GUARDAR CAMBIOS</span>
        </Button>
      </form>
    </div>
  );
}