import { idiomaVigente } from '../idioma';

/*
 * En las páginas legales, la traducción es de cortesía.
 *
 * El texto en español es el que obliga —ahí están los plazos de cancelación y
 * las condiciones de pago— y una traducción es una lectura, no un contrato. Es
 * lo que hace cualquier documento legal traducido y evita que una frase mal
 * pasada al inglés se pueda esgrimir después.
 *
 * En español no se dibuja nada: no hay nada que advertir.
 */
export default function AvisoIdiomaLegal() {
  if (idiomaVigente() !== 'en') return null;

  return (
    <p
      lang="en"
      className="mb-6 border-l border-[#CC66FF]/50 pl-4 text-[13px] leading-relaxed text-white/45"
    >
      This English version is provided for convenience. The Spanish text is the
      binding one; where the two differ, the Spanish governs. For a certified
      translation, write to{' '}
      <a href="mailto:contacto@inedito.digital" className="text-[#CC66FF] hover:text-white">
        contacto@inedito.digital
      </a>
      .
    </p>
  );
}
