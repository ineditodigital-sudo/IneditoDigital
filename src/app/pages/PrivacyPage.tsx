import SEO from '../components/SEO';
import { GlassCard } from '../components/GlassCard';

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Política de Privacidad"
        description="Política de privacidad de INÉDITO DIGITAL. Conoce cómo protegemos tu información."
      />

      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="heading text-4xl md:text-6xl mb-8 text-center">
            POLÍTICA DE <span className="text-[#7700CE]">PRIVACIDAD</span>
          </h1>

          <GlassCard className="prose prose-invert max-w-none">
            <p className="text-white/70">Última actualización: Diciembre 16, 2024</p>

            <h2 className="heading text-2xl mt-8 mb-4">1. Información que Recopilamos</h2>
            <p className="text-white/70">
              Recopilamos información que nos proporcionas directamente al usar nuestros servicios:
              nombre, correo electrónico, teléfono, empresa, y cualquier otra información que decidas compartir.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">2. Uso de la Información</h2>
            <p className="text-white/70">
              Utilizamos la información recopilada para:
            </p>
            <ul className="text-white/70 list-disc pl-6 space-y-2">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Comunicarnos contigo sobre nuestros servicios</li>
              <li>Enviar información relevante de marketing (con tu consentimiento)</li>
              <li>Analizar el uso de nuestro sitio web</li>
            </ul>

            <h2 className="heading text-2xl mt-8 mb-4">3. Protección de Datos</h2>
            <p className="text-white/70">
              Implementamos medidas de seguridad diseñadas para proteger tu información personal
              contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">4. Cookies</h2>
            <p className="text-white/70">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio,
              analizar el tráfico y personalizar contenido.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">5. Tus Derechos</h2>
            <p className="text-white/70">
              Tienes derecho a acceder, corregir o eliminar tu información personal. Para ejercer estos
              derechos, contáctanos en contacto@inedito.digital
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">6. Contacto</h2>
            <p className="text-white/70">
              Si tienes preguntas sobre esta política de privacidad, contáctanos:
              <br />Email: contacto@inedito.digital
              <br />Teléfono: +52 1 449 583 9229
            </p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}