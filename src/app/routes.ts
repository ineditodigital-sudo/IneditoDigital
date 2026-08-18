import { createBrowserRouter } from 'react-router';
import { lazy } from 'react';

// Only HomePage and RootLayout are loaded synchronously (critical path)
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';

// All other pages are lazy-loaded to reduce initial bundle
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const TarjetasDigitalesPage = lazy(() => import('./pages/TarjetasDigitalesPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const PortfolioDetailPage = lazy(() => import('./pages/PortfolioDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Redirect pages
const PatronFlexRedirect = lazy(() => import('./pages/PatronFlexRedirect'));
const LaBarajaMenuRedirect = lazy(() => import('./pages/LaBarajaMenuRedirect'));

// AI Services pages - lazy loaded
const AIServicesPage = lazy(() => import('./pages/AIServicesPage'));
const AIWhatsAppPage = lazy(() => import('./pages/AIWhatsAppPage'));
const AISalesPage = lazy(() => import('./pages/AISalesPage'));
const AIMarketingPage = lazy(() => import('./pages/AIMarketingPage'));
const AIEcommercePage = lazy(() => import('./pages/AIEcommercePage'));

// Admin pages - completely lazy loaded (not needed on initial load)
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminSEOPage = lazy(() => import('./pages/admin/AdminSEOPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminPortfolioPage = lazy(() => import('./pages/admin/AdminPortfolioPage'));
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      // AI Services routes - MUST come before servicios/:slug to avoid conflicts
      { path: 'servicios-ia', Component: AIServicesPage },
      { path: 'servicios-ia/whatsapp', Component: AIWhatsAppPage },
      { path: 'servicios-ia/ventas', Component: AISalesPage },
      { path: 'servicios-ia/marketing', Component: AIMarketingPage },
      { path: 'servicios-ia/ecommerce', Component: AIEcommercePage },
      // Regular services routes
      { path: 'servicios', Component: ServicesPage },
      // Ruta estatica: DEBE ir antes de servicios/:slug. Pagina a medida,
      // muy visual/animada, en vez del render generico de ServiceDetailPage.
      { path: 'servicios/tarjetas-de-presentacion-digital', Component: TarjetasDigitalesPage },
      { path: 'servicios/:slug', Component: ServiceDetailPage },
      // Portfolio routes
      { path: 'portafolio', Component: PortfolioPage },
      { path: 'portafolio/:slug', Component: PortfolioDetailPage },
      // Blog routes
      { path: 'blog', Component: BlogPage },
      { path: 'blog/:slug', Component: BlogPostPage },
      // Other pages
      { path: 'nosotros', Component: AboutPage },
      { path: 'contacto', Component: ContactPage },
      { path: 'privacidad', Component: PrivacyPage },
      { path: 'terminos', Component: TermsPage },
      // Legacy WordPress redirects
      { path: 'wp-content/uploads/PDFS/PATRON-FLEX.pdf', Component: PatronFlexRedirect },
      { path: 'wp-content/uploads/PDFS/NUEVO-MENU-LA-BARAJA.pdf', Component: LaBarajaMenuRedirect },
      // 404 catch-all
      { path: '*', Component: NotFoundPage },
    ],
  },
  {
    path: '/admin',
    children: [
      { index: true, Component: AdminLoginPage },
      {
        path: 'dashboard',
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboardPage },
          { path: 'seo', Component: AdminSEOPage },
          { path: 'servicios', Component: AdminServicesPage },
          { path: 'blog', Component: AdminBlogPage },
          { path: 'portafolio', Component: AdminPortfolioPage },
          { path: 'leads', Component: AdminLeadsPage },
          { path: 'ajustes', Component: AdminSettingsPage },
        ],
      },
    ],
  },
]);