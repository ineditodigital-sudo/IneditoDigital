import { Outlet, useNavigate, Link, useLocation } from 'react-router';
import { useEffect, Suspense } from 'react';
import { LayoutDashboard, FileText, Briefcase, BookOpen, Users, Settings, LogOut, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'SEO', href: '/admin/dashboard/seo', icon: Search },
  { name: 'Servicios', href: '/admin/dashboard/servicios', icon: Briefcase },
  { name: 'Blog', href: '/admin/dashboard/blog', icon: BookOpen },
  { name: 'Portafolio', href: '/admin/dashboard/portafolio', icon: FileText },
  { name: 'Leads', href: '/admin/dashboard/leads', icon: Users },
  { name: 'Ajustes', href: '/admin/dashboard/ajustes', icon: Settings },
];

export default function AdminLayout() {
  const { isAdminAuthenticated, logoutAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  if (!isAdminAuthenticated()) return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl p-6 hidden lg:block">
        <div className="mb-8">
          <h1 className="heading text-2xl text-[#7700CE]">ADMIN</h1>
          <p className="text-white/40 text-sm">Panel de control</p>
        </div>

        <nav className="space-y-2">
          {navigation.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#7700CE]/20 text-[#7700CE]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all w-full mt-8"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}