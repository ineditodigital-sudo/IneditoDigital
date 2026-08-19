import { Outlet, useLocation } from 'react-router';
import { useEffect, Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CriticalResourceHints from '../components/CriticalResourceHints';
import WhatsAppButton from '../components/WhatsAppButton';
import AIAssistant from '../components/AIAssistant';
import { esMiembro } from '../cms';

export default function RootLayout() {
  const location = useLocation();

  /* La página de contacto de alguien del equipo va sola: es SU tarjeta, no un
     recorrido por la agencia, y quien la abrió llegó acercando el celular a
     una tarjeta NFC. El encabezado, el pie y los botones flotantes del sitio
     sobrarían y le taparían los datos. */
  const soloTarjeta = esMiembro(location.pathname.replace(/^\/|\/$/g, ''));

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (soloTarjeta) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#0D0010]" />}>
        <Outlet />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CriticalResourceHints />
      <Header />
      
      <main className="flex-1 pt-16 md:pt-20">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#7700CE] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
      
      {/* AIAssistant */}
      <AIAssistant />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}