import { useEffect } from 'react';
import { contenido } from '../cms';

export default function LaBarajaMenuRedirect() {
  useEffect(() => {
    // Redirigir al nuevo destino del PDF
    window.location.href = 'https://imagenes.inedito.digital/LA-BARAJA/NUEVO-MENU-LA-BARAJA.pdf';
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7700CE]"></div>
        <p className="mt-4 text-white/80">{contenido('sistema', 'avisos')('redir_menu', 'Redirigiendo al menú...')}</p>
      </div>
    </div>
  );
}
