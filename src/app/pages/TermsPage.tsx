import SEO from '../components/SEO';
import { contenido } from '../cms';
import { GlassCard } from '../components/GlassCard';

export default function TermsPage() {
  const t = contenido('terminos', 'encabezado');
  return (
    <>
      <SEO
        title="Términos y Condiciones"
        description="Términos y condiciones de uso de los servicios de INÉDITO DIGITAL."
      />

      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="heading text-4xl md:text-6xl mb-8 text-center">
            {t('titulo_1', 'TÉRMINOS Y')} <span className="text-[#7700CE]">{t('titulo_2', 'CONDICIONES')}</span>
          </h1>

          <GlassCard className="prose prose-invert max-w-none">
            <p className="text-white/70">{t('fecha', 'Última actualización: Diciembre 16, 2024')}</p>

            <h2 className="heading text-2xl mt-8 mb-4">1. Aceptación de Términos</h2>
            <p className="text-white/70">
              Al acceder y usar los servicios de INÉDITO DIGITAL, aceptas estar sujeto a estos términos y condiciones.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">2. Servicios</h2>
            <p className="text-white/70">
              Ofrecemos servicios de marketing digital, desarrollo web, SEO, publicidad digital y consultoría.
              Los detalles específicos de cada servicio se acordarán en contratos individuales.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">3. Pagos y Facturación</h2>
            <p className="text-white/70">
              Los términos de pago se especificarán en cada propuesta comercial. Generalmente requerimos:
            </p>
            <ul className="text-white/70 list-disc pl-6 space-y-2">
              <li>50% de anticipo para iniciar el proyecto</li>
              <li>50% restante contra entrega</li>
              <li>Servicios recurrentes: pago mensual anticipado</li>
            </ul>

            <h2 className="heading text-2xl mt-8 mb-4">4. Garantías y Resultados</h2>
            <p className="text-white/70">
              Garantizamos esfuerzo máximo y entregas en tiempo. Sin embargo, resultados específicos
              (rankings, ventas, leads) dependen de múltiples factores externos y no pueden garantizarse.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">5. Propiedad Intelectual</h2>
            <p className="text-white/70">
              Una vez pagado en su totalidad, el cliente recibe derechos completos sobre el trabajo entregado.
              Nos reservamos el derecho de mostrar el trabajo en nuestro portafolio.
            </p>

            <h2 className="heading text-2xl mt-8 mb-4">6. Cancelación</h2>
            <p className="text-white/70">
              Los términos de cancelación se especifican en cada contrato. Generalmente:
            </p>
            <ul className="text-white/70 list-disc pl-6 space-y-2">
              <li>Proyectos: El anticipo no es reembolsable</li>
              <li>Servicios mensuales: Aviso de 30 días</li>
            </ul>

            <h2 className="heading text-2xl mt-8 mb-4">7. Contacto</h2>
            <p className="text-white/70">
              Para preguntas sobre estos términos:
              <br />Email: contacto@inedito.digital
              <br />Teléfono: +52 1 449 583 9229
            </p>
          </GlassCard>
        </div>
      </div>
    </>
  );
}