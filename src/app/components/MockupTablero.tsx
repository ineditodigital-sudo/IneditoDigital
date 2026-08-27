/*
 * Los marcos de dispositivo: un navegador de escritorio y un teléfono.
 *
 * Son la pieza visual del refresh: en lugar de fotos de banco, el producto
 * real —el tablero— dentro de una pantalla. Todo es markup y CSS puro, sin
 * motion ni JS: el del hero pesa lo que pesan sus dos imágenes.
 */

export function MarcoNavegador({
  src,
  alt,
  eager = false,
  className = '',
}: {
  src: string;
  alt: string;
  /** Solo el del hero: es candidato a LCP y no debe esperar. */
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-white/12 bg-[#16101d] shadow-2xl ${className}`}>
      {/* la barra del navegador */}
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/80" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white/[.06] px-3 py-1 text-center font-mono text-[9.5px] tracking-wide text-white/45">
          inedito.digital · tu tablero
        </span>
      </div>
      <img
        src={src}
        alt={alt}
        width={1440}
        height={930}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className="block w-full"
      />
    </div>
  );
}

export function MarcoTelefono({
  src,
  alt,
  eager = false,
  className = '',
}: {
  src: string;
  alt: string;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[1.6rem] border-[5px] border-[#16101d] bg-[#16101d] shadow-2xl ring-1 ring-white/15 ${className}`}>
      <div className="relative">
        {/* la muesca */}
        <span className="absolute left-1/2 top-1.5 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/70" />
        <img
          src={src}
          alt={alt}
          width={390}
          height={800}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="block w-full rounded-[1.25rem]"
        />
      </div>
    </div>
  );
}
