import {
  Search, Code, Bot, Palette, Sparkles, Mail, TrendingUp, Target, QrCode,
  Nfc, MapPin, ScanSearch, LayoutGrid, type LucideIcon,
} from 'lucide-react';

/*
 * El icono de cada servicio.
 *
 * El campo `icon` existe en el panel desde el principio y guarda un nombre de
 * lucide ("Search", "Bot", "QrCode"). Nunca se habia pintado en ninguna parte.
 *
 * El mapa es explicito y no un import dinamico a proposito: asi solo entran al
 * bundle los trece iconos que se usan, y si alguien escribe un nombre que no
 * existe se ve una rejilla en vez de romperse la pagina.
 */
const ICONOS: Record<string, LucideIcon> = {
  Search, Code, Bot, Palette, Sparkles, Mail, TrendingUp, Target, QrCode,
  Nfc, MapPin, ScanSearch,
};

export function IconoServicio({
  nombre,
  size = 18,
  className = '',
}: {
  nombre?: string;
  size?: number;
  className?: string;
}) {
  const Icono = (nombre && ICONOS[nombre]) || LayoutGrid;
  return <Icono size={size} className={className} strokeWidth={1.8} />;
}
