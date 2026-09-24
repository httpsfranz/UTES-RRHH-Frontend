import { Bell, Search } from 'lucide-react';

// Barra superior, separada del Sidebar: fondo blanco, altura reducida, alineacion
// minimalista. No tiene logica de sesion todavia (no hay login); el avatar es un
// marcador visual para cuando exista Seguridad.Usuario.
export default function Navbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-surface px-6">
      <div className="text-sm text-muted">{/* breadcrumb / titulo de seccion */}</div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-line bg-page px-3 py-1.5 text-sm text-muted sm:flex">
          <Search size={16} />
          <span>Buscar…</span>
        </div>

        <button
          type="button"
          className="relative rounded-lg p-2 text-muted transition-colors hover:bg-page hover:text-heading"
          aria-label="Notificaciones"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
          AU
        </div>
      </div>
    </header>
  );
}
