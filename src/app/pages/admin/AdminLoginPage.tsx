import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { GlassCard } from '../../components/GlassCard';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin, isAdminAuthenticated } = useApp();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (await loginAdmin(username, password)) {
        toast.success('¡Bienvenido!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch {
      toast.error('No se pudo conectar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isAdminAuthenticated()) {
    navigate('/admin/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#7700CE]/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#7700CE]" size={32} />
          </div>
          <h1 className="heading text-3xl mb-2">ADMIN</h1>
          <p className="text-white/60">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button type="submit" className="w-full bg-[#7700CE] hover:bg-[#9933FF] rounded-full py-6">
            <span className="heading tracking-[0.08em]">INICIAR SESIÓN</span>
          </Button>
        </form>

        <p className="text-white/40 text-xs text-center mt-6">
          Credenciales actualizadas - Panel seguro
        </p>
      </GlassCard>
    </div>
  );
}