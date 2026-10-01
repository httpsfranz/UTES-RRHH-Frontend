import { Bell, ChevronDown, Menu, Search } from 'lucide-react';

// Barra superior: boton de menu (movil) a la izquierda; buscador, notificaciones y usuario a la derecha.
// Aun no hay login: el usuario es un marcador visual para cuando exista Seguridad.Usuario.
export default function Navbar({ onMenu }) {
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line/60 bg-surface/90 px-4 backdrop-blur-md lg:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-xl p-2 text-muted transition-colors hover:bg-page hover:text-heading lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden w-64 items-center gap-2 rounded-xl border border-line bg-page/70 px-3.5 py-2 text-sm text-muted md:flex">
          <Search size={16} />
          <span>Buscar en el sistema…</span>
        </div>

        <button
          type="button"
          className="relative rounded-xl p-2.5 text-muted transition-colors hover:bg-page hover:text-heading"
          aria-label="Notificaciones"
        >
          <Bell size={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand ring-2 ring-surface" />
        </button>

        <div className="mx-1 hidden h-8 w-px bg-line sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
            AU
          </div>
          <div className="hidden leading-tight lg:block">
            <p className="text-[13px] font-semibold text-heading">Administrador</p>
          </div>
          <ChevronDown size={15} className="hidden text-muted lg:block" />
        </div>
      </div>
    </header>
  );
}
