import { contenido } from '../cms';
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#7700CE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">{contenido('sistema', 'avisos')('cargando', 'Cargando...')}</p>
      </div>
    </div>
  );
}
