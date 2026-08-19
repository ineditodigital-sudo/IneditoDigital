import { lazy } from 'react';
import { useParams } from 'react-router';
import { esMiembro } from '../cms';

const MiembroPage = lazy(() => import('./MiembroPage'));
const PaginaCMS = lazy(() => import('./PaginaCMS'));

/**
 * Decide qué es una dirección que no pertenece a ninguna ruta fija.
 *
 * Puede ser la página de contacto de alguien del equipo (/armando-trejo) o
 * una página que el cliente armó con bloques. Si no es ninguna, PaginaCMS ya
 * se encarga de mostrar el 404.
 */
export default function RutaLibre() {
  const { slug } = useParams<{ slug: string }>();
  return esMiembro(slug || '') ? <MiembroPage /> : <PaginaCMS />;
}
