import SEO from '../components/SEO';
import { contenido } from '../cms';
import { GlassCard } from '../components/GlassCard';
import ApartadosLegales, { Apartado } from '../components/ApartadosLegales';

const APARTADOS: Apartado[] = [
  { titulo: '1. Aceptación de Términos', texto: 'Al acceder y usar los servicios de INÉDITO DIGITAL, aceptas estar sujeto a estos términos y condiciones.', lista: '' },
  { titulo: '2. Servicios', texto: 'Ofrecemos servicios de marketing digital, desarrollo web, SEO, publicidad digital y consultoría. Los detalles específicos de cada servicio se acordarán en contratos individuales.', lista: '' },
  { titulo: '3. Pagos y Facturación', texto: 'Los términos de pago se especificarán en cada propuesta comercial. Generalmente requerimos:', lista: '50% de anticipo para iniciar el proyecto\n50% restante contra entrega\nServicios recurrentes: pago mensual anticipado' },
  { titulo: '4. Garantías y Resultados', texto: 'Garantizamos esfuerzo máximo y entregas en tiempo. Sin embargo, resultados específicos (rankings, ventas, leads) dependen de múltiples factores externos y no pueden garantizarse.', lista: '' },
  { titulo: '5. Propiedad Intelectual', texto: 'Una vez pagado en su totalidad, el cliente recibe derechos completos sobre el trabajo entregado. Nos reservamos el derecho de mostrar el trabajo en nuestro portafolio.', lista: '' },
  { titulo: '6. Cancelación', texto: 'Los términos de cancelación se especifican en cada contrato. Generalmente:', lista: 'Proyectos: El anticipo no es reembolsable\nServicios mensuales: Aviso de 30 días' },
  { titulo: '7. Contacto', texto: 'Para preguntas sobre estos términos:\nEmail: contacto@inedito.digital\nTeléfono: +52 1 449 583 9229', lista: '' },
];


export default function TermsPage() {
  const t = contenido('terminos', 'encabezado');
  const tAp = contenido('terminos', 'apartados');
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

            <ApartadosLegales t={tAp} respaldo={APARTADOS} />
          </GlassCard>
        </div>
      </div>
    </>
  );
}