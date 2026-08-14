import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import DynamicSEO from '../components/DynamicSEO';

export default function NotFoundPage() {
  return (
    <>
      <DynamicSEO
        title="Página no encontrada - 404 | INÉDITO DIGITAL"
        description="La página que buscas no existe o ha sido movida."
        noindex={true}
      />
      
      {/* Video Background Container - Ancho completo con header */}
      <div className="relative w-full min-h-[15vh] md:min-h-screen overflow-hidden bg-black">
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain md:object-cover"
          poster="https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp"
        >
          <source 
            src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/Video-Pagina-404-Inedito-Web.mp4" 
            type="video/mp4" 
          />
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Contenido centrado */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-[rgba(0,0,0,0.15)]">
          <div className="text-center max-w-3xl">
            {/* Contenido eliminado */}
          </div>
        </div>

        {/* Gradiente inferior para mejor transición */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </>
  );
}