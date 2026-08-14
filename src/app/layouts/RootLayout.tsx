import { Outlet, useLocation } from 'react-router';
import { useEffect, Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CriticalResourceHints from '../components/CriticalResourceHints';
import WhatsAppButton from '../components/WhatsAppButton';
import AIAssistant from '../components/AIAssistant';

export default function RootLayout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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