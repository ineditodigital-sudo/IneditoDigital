import SEO from '../components/SEO';
import { contenido } from '../cms';
import { GlassCard } from '../components/GlassCard';
import ApartadosLegales, { Apartado } from '../components/ApartadosLegales';

const APARTADOS: Apartado[] = [
  { titulo: '1. Información que Recopilamos', texto: 'Recopilamos información que nos proporcionas directamente al usar nuestros servicios: nombre, correo electrónico, teléfono, empresa, y cualquier otra información que decidas compartir.', lista: '' },
  { titulo: '2. Uso de la Información', texto: 'Utilizamos la información recopilada para:', lista: 'Proporcionar y mejorar nuestros servicios\nComunicarnos contigo sobre nuestros servicios\nEnviar información relevante de marketing (con tu consentimiento)\nAnalizar el uso de nuestro sitio web' },
  { titulo: '3. Protección de Datos', texto: 'Implementamos medidas de seguridad diseñadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.', lista: '' },
  { titulo: '4. Cookies', texto: 'Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio, analizar el tráfico y personalizar contenido.', lista: '' },
  { titulo: '5. Tus Derechos', texto: 'Tienes derecho a acceder, corregir o eliminar tu información personal. Para ejercer estos derechos, contáctanos en contacto@inedito.digital', lista: '' },
  { titulo: '6. Contacto', texto: 'Si tienes preguntas sobre esta política de privacidad, contáctanos:\nEmail: contacto@inedito.digital\nTeléfono: +52 1 449 583 9229', lista: '' },
];


export default function PrivacyPage() {
  const t = contenido('privacidad', 'encabezado');
  const tAp = contenido('privacidad', 'apartados');
  return (
    <>
      <SEO
        title="Política de Privacidad"
        description="Política de privacidad de INÉDITO DIGITAL. Conoce cómo protegemos tu información."
      />

      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="heading text-4xl md:text-6xl mb-8 text-center">
            {t('titulo_1', 'POLÍTICA DE')} <span className="text-[#7700CE]">{t('titulo_2', 'PRIVACIDAD')}</span>
          </h1>

          <GlassCard className="prose prose-invert max-w-none">
            <p className="text-white/70">{t('fecha', 'Última actualización: Diciembre 16, 2024')}</p>

            <ApartadosLegales t={tAp} respaldo={APARTADOS} />
          </GlassCard>
        </div>
      </div>
    </>
  );
}