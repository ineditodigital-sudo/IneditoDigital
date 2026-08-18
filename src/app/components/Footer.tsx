import { Link } from 'react-router';
import { contenido, marca } from '../cms';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

/** Enlace del pie: <Link> para rutas del sitio, <a> para destinos externos. */
function EnlacePie({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  const externo = /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
  if (externo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const p = marca.pie();
  const pS = contenido('marca', 'pie_servicios');
  const pE = contenido('marca', 'pie_empresa');
  const pL = contenido('marca', 'pie_legal');
  const r = marca.redes();
  const mLogo = marca.logo();
  const { settings } = useApp();
  const currentYear = new Date().getFullYear();

  const services = [
    { ver: pS.visible('s1_ver'), name: pS('s1_nombre', 'Diseño y Desarrollo Web'), href: pS('s1_url', '/servicios/diseno-y-desarrollo-web') },
    { ver: pS.visible('s2_ver'), name: pS('s2_nombre', 'Chatbots y Agentes IA'), href: pS('s2_url', '/servicios/chatbots-y-agentes') },
    { ver: pS.visible('s3_ver'), name: pS('s3_nombre', 'Funnels de Venta'), href: pS('s3_url', '/servicios/funnels-de-venta') },
    { ver: pS.visible('s4_ver'), name: pS('s4_nombre', 'Posicionamiento Orgánico'), href: pS('s4_url', '/servicios/posicionamiento-organico') },
    { ver: pS.visible('s5_ver'), name: pS('s5_nombre', 'Google ADS'), href: pS('s5_url', '/servicios/google-ads') },
  ].filter((i) => i.ver);


  const company = [
    { ver: pE.visible('e1_ver'), name: pE('e1_nombre', 'Nosotros'), href: pE('e1_url', '/nosotros') },
    { ver: pE.visible('e2_ver'), name: pE('e2_nombre', 'Portafolio'), href: pE('e2_url', '/portafolio') },
    { ver: pE.visible('e3_ver'), name: pE('e3_nombre', 'Blog'), href: pE('e3_url', '/blog') },
    { ver: pE.visible('e4_ver'), name: pE('e4_nombre', 'Contacto'), href: pE('e4_url', '/contacto') },
  ].filter((i) => i.ver);


  const legal = [
    { ver: pL.visible('l1_ver'), name: pL('l1_nombre', 'Política de Privacidad'), href: pL('l1_url', '/privacidad') },
    { ver: pL.visible('l2_ver'), name: pL('l2_nombre', 'Términos y Condiciones'), href: pL('l2_url', '/terminos') },
  ].filter((i) => i.ver);


  return (
    <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src={mLogo('imagen', 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp')}
              alt="INÉDITO DIGITAL"
              className="h-10 w-auto"
              loading="lazy"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              {p('descripcion', 'Agencia de Marketing Digital en Aguascalientes que impulsa tus ventas con IA y estrategias digitales comprobadas.')}
            </p>
            <div className="flex gap-4">
              <a
                href={r('facebook', 'https://www.facebook.com/ineditoagenciadigital')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7700CE] hover:border-[#7700CE] transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={r('instagram', 'https://www.instagram.com/ineditodigital/')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#7700CE] hover:border-[#7700CE] transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={r('linkedin', 'https://www.linkedin.com/company/inedito-digital/')}
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
            <h3 className="heading text-base mb-4">{p('titulo_serv', 'SERVICIOS')}</h3>
            <ul className="space-y-2">
              {services.map((item) => (
                <li key={item.name}>
                  <EnlacePie href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.name}
                  </EnlacePie>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="heading text-base mb-4">{p('titulo_emp', 'EMPRESA')}</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <EnlacePie href={item.href} className="text-white/60 hover:text-white text-sm transition-colors">
                    {item.name}
                  </EnlacePie>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="heading text-base mb-4">{p('titulo_cont', 'CONTACTO')}</h3>
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
              {p('derechos', '© 2026 INÉDITO DIGITAL. Todos los derechos reservados.')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {legal.map((item) => (
                <EnlacePie key={item.name} href={item.href} className="text-white/40 hover:text-white text-sm transition-colors">
                  {item.name}
                </EnlacePie>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}