import { Link } from 'react-router';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { settings } = useApp();
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Diseño y Desarrollo Web', href: '/servicios/diseno-y-desarrollo-web' },
    { name: 'Chatbots y Agentes IA', href: '/servicios/chatbots-y-agentes' },
    { name: 'Funnels de Venta', href: '/servicios/funnels-de-venta' },
    { name: 'Posicionamiento Orgánico', href: '/servicios/posicionamiento-organico' },
    { name: 'Google ADS', href: '/servicios/google-ads' },
  ];

  const company = [
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Portafolio', href: '/portafolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const legal = [
    { name: 'Política de Privacidad', href: '/privacidad' },
    { name: 'Términos y Condiciones', href: '/terminos' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp"
              alt="INÉDITO DIGITAL"
              className="h-10 w-auto"
              loading="lazy"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              Agencia de Marketing Digital en Aguascalientes que impulsa tus ventas con IA y estrategias digitales comprobadas.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/ineditoagenciadigital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7700CE] hover:border-[#7700CE] transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/ineditodigital/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7700CE] hover:border-[#7700CE] transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/inedito-digital/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7700CE] hover:border-[#7700CE] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="heading text-base mb-4">SERVICIOS</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="heading text-base mb-4">EMPRESA</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="heading text-base mb-4">CONTACTO</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  {settings.businessAddress}<br />
                  {settings.businessCity}, {settings.businessState}
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail size={18} className="flex-shrink-0" />
                <a href={`mailto:${settings.businessEmail}`} className="hover:text-white transition-colors">
                  {settings.businessEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © {currentYear} {settings.businessName}. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {legal.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}