import { useState } from 'react';
import { marca } from '../cms';

interface LogoProps {
  className?: string;
  alt?: string;
}

export default function Logo({ className = '', alt }: LogoProps) {
  const [hasError, setHasError] = useState(false);
  const m = marca.logo();

  const logoUrl = m('imagen', 'https://imagenes.inedito.digital/INEDITO%20DIGITAL/LOGO%20INEDITO%20MORADO%20Y%20BLANCO.webp');
  const textoAlt = alt ?? m('alt', 'INÉDITO DIGITAL');

  // Fallback SVG logo
  const fallbackLogo = (
    <svg 
      className={className}
      viewBox="0 0 200 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'auto', height: '100%' }}
    >
      <text 
        x="5" 
        y="28" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="24" 
        fontWeight="700" 
        fill="url(#gradient)"
        letterSpacing="2"
      >
        INÉDITO
      </text>
      <text 
        x="115" 
        y="28" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="24" 
        fontWeight="400" 
        fill="white"
        letterSpacing="1"
      >
        DIGITAL
      </text>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#7700CE', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#9933FF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );

  if (hasError) {
    return fallbackLogo;
  }

  return (
    <img
      src={logoUrl}
      alt={textoAlt}
      className={className}
      onError={() => setHasError(true)}
      loading="eager"
    />
  );
}
