/*
 * El logo de Inédito: el archivo oficial, no una reconstrucción.
 *
 * Son los SVG de marca tal cual (public/marca), en sus dos versiones: letras
 * blancas para el tema oscuro y negras para el claro. Van como <img> y no
 * incrustados porque los dos archivos usan los mismos nombres de clase y el
 * mismo id de recorte con significados distintos: metidos en la misma página
 * se pisarían los estilos y uno saldría con los colores del otro.
 *
 * Se cargan los dos y se enseña el que toca, así cambiar de tema no espera a
 * que baje el otro archivo.
 *
 * El alto manda y el ancho sale solo de la proporción del archivo. `altoMd`
 * es el alto desde tableta; sin él, el mismo en todas las pantallas.
 */
export default function Logotipo({
  alto,
  altoMd,
  tema,
}: {
  alto: number;
  altoMd?: number;
  tema: 'oscuro' | 'claro';
}) {
  const vars = { '--l-alto': `${alto}px`, '--l-alto-md': `${altoMd ?? alto}px` } as React.CSSProperties;
  return (
    <span className="inline-flex shrink-0" style={vars}>
      {(['oscuro', 'claro'] as const).map((v) => (
        <img
          key={v}
          src={v === 'oscuro' ? '/marca/inedito-blanco.svg' : '/marca/inedito-negro.svg'}
          alt={v === tema ? 'Inédito agencia digital' : ''}
          aria-hidden={v === tema ? undefined : true}
          draggable={false}
          className={`${v === tema ? 'block' : 'hidden'} h-[var(--l-alto)] w-auto select-none md:h-[var(--l-alto-md)]`}
        />
      ))}
    </span>
  );
}
