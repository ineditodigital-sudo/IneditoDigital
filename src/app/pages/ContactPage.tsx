import { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export default function ContactPage() {
  const { settings, addLead, openAssistant } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // anti-spam: debe quedar vacío

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Historial local (opcional, no sustituye la entrega real)
    addLead({ ...formData, source: 'Formulario de contacto web' });

    try {
      const res = await fetch('/api/lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          website: honeypot, // honeypot
          source: 'Formulario de contacto web'
        })
      });
      const data = await res.json().catch(() => ({ ok: res.ok }));

      if (res.ok && data.ok) {
        toast.success('¡Mensaje enviado! Te contactaremos muy pronto.');
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        toast.error(data.error || 'No se pudo enviar. Escríbenos por WhatsApp, por favor.');
      }
    } catch {
      toast.error('Error de conexión. Intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hola, me gustaría recibir más información')}`;

  return (
    <>
      <SEO
        title="Contacto - Agencia de Marketing Digital"
        description="Contáctanos para una consulta gratuita. Estamos en Aguascalientes listos para impulsar tu negocio."
      />

      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="heading text-4xl md:text-6xl mb-6">
              <span className="text-[#7700CE]">CONTACTO</span>
            </h1>
            <p className="text-xl text-white/70">
              Agenda una consulta gratuita y descubre cómo podemos ayudarte
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <GlassCard>
              <h2 className="heading text-2xl mb-6">ENVÍANOS UN MENSAJE</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-spam: invisible para humanos, los bots lo rellenan */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: 0, height: 0, opacity: 0 }}
                />
                <div>
                  <Input
                    type="text"
                    placeholder="Nombre completo *"
                    aria-label="Nombre completo"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Teléfono *"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Empresa"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="¿En qué podemos ayudarte? *"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#7700CE] hover:bg-[#9933FF] text-white rounded-full py-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="heading tracking-[0.08em]">{submitting ? 'ENVIANDO…' : 'ENVIAR MENSAJE'}</span>
                </Button>
              </form>
            </GlassCard>

            <div className="space-y-6">
              <GlassCard>
                <h2 className="heading text-2xl mb-6">INFORMACIÓN DE CONTACTO</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-[#7700CE] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="font-medium text-white mb-1">Dirección</div>
                      <div className="text-white/60">
                        {settings.businessAddress}<br />
                        {settings.businessCity}, {settings.businessState} {settings.businessZip}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-[#7700CE] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="font-medium text-white mb-1">Teléfono</div>
                      <a href={`tel:${settings.businessPhone}`} className="text-white/60 hover:text-white transition-colors">
                        {settings.businessPhone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="text-[#7700CE] flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="font-medium text-white mb-1">Email</div>
                      <a href={`mailto:${settings.businessEmail}`} className="text-white/60 hover:text-white transition-colors">
                        {settings.businessEmail}
                      </a>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard glow className="text-center p-6">
                <MessageCircle className="text-[#25D366] mx-auto mb-4" size={48} />
                <h3 className="heading text-xl mb-2">¿PREFIERES WHATSAPP?</h3>
                <p className="text-white/60 mb-4 text-sm">
                  Respuesta inmediata por WhatsApp
                </p>
                <button
                  onClick={() => openAssistant(undefined, 'contactar por WhatsApp')}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white transition-all cursor-pointer"
                >
                  <span className="heading text-sm tracking-[0.08em]">CHATEAR AHORA</span>
                </button>
              </GlassCard>

              <GlassCard>
                <h3 className="heading text-lg mb-2">HORARIO</h3>
                <p className="text-white/60">{settings.businessHours}</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}