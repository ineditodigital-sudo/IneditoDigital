/*
 * El mensaje que se abre en WhatsApp.
 *
 * Antes llegaba como una ficha de CRM en tercera persona:
 *
 *     *NUEVO LEAD - INEDITO DIGITAL*
 *     Nombre: Juan
 *     Empresa: ACME
 *     Servicio de Interes: ...
 *     _El prospecto esta esperando respuesta..._
 *
 * El problema no es estetico. Ese texto lo escribe el VISITANTE desde su
 * telefono: al abrirse WhatsApp queda en su caja de envio, y muchos lo borran
 * porque no reconocen como suyo un mensaje que habla de ellos en tercera
 * persona y los llama "prospecto". Ahora se redacta en primera persona, como
 * lo habria escrito la persona, y se envia entero.
 *
 * Solo aparece lo que de verdad se contesto: nada de lineas con "no
 * especificado", que es justo lo que delata un formulario.
 */

export type Requerimiento = {
  nombre?: string;
  empresa?: string;
  servicio?: string;
  objetivo?: string;
  cuando?: string;
  presupuesto?: string;
  detalle?: string;      // lo que escribio con sus palabras
  email?: string;
  telefono?: string;
  paginaOrigen?: string; // desde donde abrio el asistente
  /* Lo que consulto en el asistente y que se le respondio. Va en el mensaje
     para que quien atiende no repita lo ya contestado. */
  consultas?: { pregunta: string; respondido?: string }[];
};

const hay = (v?: string) => !!v && v.trim() !== '' && v.trim() !== '-';

/** Une frases en una sola linea natural, sin dejar dobles espacios. */
const parrafo = (partes: (string | false | undefined)[]) =>
  partes.filter(Boolean).join(' ').replace(/\s+/g, ' ').replace(/\s+([.,])/g, '$1').trim();

export function construirMensaje(r: Requerimiento): string {
  const bloques: string[] = [];

  /* --- quien soy --- */
  bloques.push(
    parrafo([
      'Hola, buen día.',
      hay(r.nombre) ? `Soy ${r.nombre!.trim()}` : 'Les escribo',
      hay(r.empresa) && !/^(independiente|ninguna|n\/a|no)$/i.test(r.empresa!.trim())
        ? `de ${r.empresa!.trim()}.`
        : hay(r.nombre) ? '.' : '.',
    ])
  );

  /* --- que necesito --- */
  const necesidad = parrafo([
    hay(r.servicio)
      ? `Me interesa el servicio de *${r.servicio!.trim()}*.`
      : 'Quiero información sobre sus servicios.',
    hay(r.objetivo) ? `Lo que busco es ${r.objetivo!.trim().toLowerCase()}.` : false,
    hay(r.cuando) ? `Me gustaría empezar ${r.cuando!.trim().toLowerCase()}.` : false,
    hay(r.presupuesto) ? `El presupuesto que manejo es de ${r.presupuesto!.trim()}.` : false,
  ]);
  bloques.push(necesidad);

  /* --- lo que ya consulte --- */
  const consultas = (r.consultas ?? []).filter((c) => hay(c.pregunta));
  if (consultas.length) {
    const lineas = consultas
      .slice(0, 6)
      .map((c) => `• "${c.pregunta.trim()}"${c.respondido ? ` — ${c.respondido}` : ''}`)
      .join('\n');
    bloques.push(`Esto es lo que consulté en su asistente:\n${lineas}`);
  } else if (hay(r.detalle)) {
    bloques.push(`Les cuento un poco más:\n"${r.detalle!.trim()}"`);
  }

  /* --- como contactarme --- */
  const datos = [
    hay(r.email) ? `📧 ${r.email!.trim()}` : null,
    hay(r.telefono) ? `📱 ${r.telefono!.trim()}` : null,
  ].filter(Boolean);
  if (datos.length) {
    bloques.push(`Mis datos de contacto:\n${datos.join('\n')}`);
  }

  bloques.push('¿Me pueden orientar? Gracias.');

  /* --- de donde vengo: util para quien atiende, discreto para quien escribe --- */
  if (hay(r.paginaOrigen)) {
    bloques.push(`_(Escribo desde ${r.paginaOrigen})_`);
  }

  return bloques.join('\n\n');
}

/** El enlace listo para abrir, con el numero ya limpio. */
export function enlaceWhatsApp(numero: string, r: Requerimiento): string {
  const limpio = (numero || '').replace(/\D/g, '');
  return `https://wa.me/${limpio}?text=${encodeURIComponent(construirMensaje(r))}`;
}
