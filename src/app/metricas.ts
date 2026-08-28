/*
 * Acciones que valen dinero, contadas.
 *
 * Las vistas ya se cuentan (api/hit.php); esto cuenta lo que la gente HACE:
 * abrir el asistente, tocar WhatsApp, tocar el teléfono. Con eso el panel
 * puede dibujar el embudo completo: visitantes → acciones → leads.
 *
 * Mismas reglas que las vistas: el equipo (cookie del panel) y los bots se
 * descartan en el servidor, y medir jamás puede romper la página.
 */

export function evento(nombre: string, detalle = ''): void {
  try {
    const url =
      '/api/evento.php?e=' + encodeURIComponent(nombre) +
      '&d=' + encodeURIComponent(detalle.slice(0, 160)) +
      '&p=' + encodeURIComponent(location.pathname) +
      '&t=' + Date.now();
    /* sendBeacon sobrevive a la navegación (útil en enlaces que se van a
       WhatsApp en la misma pestaña); si no existe, el gif de siempre */
    if (!(navigator.sendBeacon && navigator.sendBeacon(url))) {
      new Image().src = url;
    }
  } catch {
    /* silencioso */
  }
}

let instalado = false;

/** Un solo listener global cuenta todos los clics a WhatsApp y a tel:. */
export function instalarMedicionDeClicks(): void {
  if (instalado) return;
  instalado = true;
  document.addEventListener(
    'click',
    (ev) => {
      const objetivo = ev.target as HTMLElement | null;
      const enlace = objetivo?.closest?.('a[href]');
      if (!enlace) return;
      const href = enlace.getAttribute('href') || '';
      if (/wa\.me|whatsapp\.com/i.test(href)) evento('whatsapp');
      else if (href.startsWith('tel:')) evento('llamada');
    },
    { capture: true }
  );
}
