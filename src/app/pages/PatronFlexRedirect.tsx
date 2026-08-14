import { useEffect } from 'react';

export default function PatronFlexRedirect() {
  useEffect(() => {
    // Redirección inmediata al nuevo subdominio
    window.location.replace('https://imagenes.inedito.digital/FLEX/PATRON-FLEX.pdf');
  }, []);

  // Mensaje de respaldo mientras redirige
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7700CE] mb-4"></div>
        <p className="text-white/80">Redirigiendo al documento...</p>
      </div>
    </div>
  );
}
