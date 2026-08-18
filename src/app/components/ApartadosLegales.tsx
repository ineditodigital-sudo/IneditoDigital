import { Fragment } from 'react';
import type { LectorSeccion } from '../cms';

export interface Apartado {
  titulo: string;
  texto: string;
  lista?: string;
}

/**
 * Los apartados de una página legal, escritos desde el panel.
 *
 * Cada uno lleva título, texto y una lista opcional de puntos (uno por línea).
 * El respaldo es el texto que hoy tiene el sitio, así que si el panel no
 * responde la página se sigue leyendo igual. Un apartado sin nada no se dibuja,
 * y por eso los slots libres del final permiten agregar apartados nuevos sin
 * tocar el código. Para quitar uno que sí tiene texto se apaga su interruptor:
 * dejarlo en blanco no sirve, porque un campo vacío siempre vuelve al respaldo.
 */
export default function ApartadosLegales({ t, respaldo, libres = 3 }: {
  t: LectorSeccion;
  respaldo: Apartado[];
  libres?: number;
}) {
  const total = respaldo.length + libres;
  const bloques = [];

  for (let i = 1; i <= total; i++) {
    const def = respaldo[i - 1] ?? { titulo: '', texto: '', lista: '' };
    const titulo = t(`a${i}_titulo`, def.titulo);
    const texto = t(`a${i}_texto`, def.texto);
    const puntos = t(`a${i}_lista`, def.lista ?? '')
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (!t.visible(`a${i}_ver`)) continue;
    if (!titulo && !texto && puntos.length === 0) continue;

    bloques.push(
      <Fragment key={i}>
        {titulo && <h2 className="heading text-2xl mt-8 mb-4">{titulo}</h2>}
        {texto && (
          <p className="text-white/70">
            {texto.split('\n').map((linea, k) => (
              <Fragment key={k}>
                {k > 0 && <br />}
                {linea}
              </Fragment>
            ))}
          </p>
        )}
        {puntos.length > 0 && (
          <ul className="text-white/70 list-disc pl-6 space-y-2">
            {puntos.map((p, k) => (
              <li key={k}>{p}</li>
            ))}
          </ul>
        )}
      </Fragment>
    );
  }

  return <>{bloques}</>;
}
