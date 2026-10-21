import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, KeyRound, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import BuscadorDelMenu from './BuscadorDelMenu';
import CampanaDeNotificaciones from './CampanaDeNotificaciones';

// Barra superior: boton de menu (movil) a la izquierda; buscador, notificaciones y usuario a la derecha.
// El usuario y su menu (cerrar sesion) salen de la sesion iniciada.
export default function Navbar({ onMenu, onCambiarClave }) {
  const { usuario, roles, cerrarSesion } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef(null);
  const nombre = usuario?.trabajador?.nombre_completo ?? usuario?.nombre ?? '';
  const iniciales = nombre.replace(',', ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || 'U';

  useEffect(() => {
    if (!abierto) return undefined;
    const cerrar = (event) => {
      if (!contenedor.current?.contains(event.target)) setAbierto(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, [abierto]);

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
        <BuscadorDelMenu />

        <CampanaDeNotificaciones />

        <div className="mx-1 hidden h-8 w-px bg-line sm:block" />

        <div ref={contenedor} className="relative">
          <button type="button" onClick={() => setAbierto((v) => !v)} aria-expanded={abierto} className="flex items-center gap-3 rounded-xl px-1.5 py-1 transition-colors hover:bg-page">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">{iniciales}</div>
            <div className="hidden text-left leading-tight lg:block">
              <p className="max-w-52 truncate text-[13px] font-semibold text-heading">{nombre}</p>
              <p className="max-w-52 truncate text-[11px] text-muted">{roles.map((rol) => rol.nombre).join(' · ')}</p>
            </div>
            <ChevronDown size={15} className="hidden text-muted lg:block" />
          </button>
          {abierto && (
            <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-pop)]">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-semibold text-heading">{nombre}</p>
                <p className="truncate text-xs text-muted">{usuario?.nombre}{usuario?.correo ? ` · ${usuario.correo}` : ''}</p>
              </div>
              <Link to="/soporte/notificaciones" onClick={() => setAbierto(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-heading transition-colors hover:bg-page">
                <Bell size={15} /> Mis avisos
              </Link>
              <button
                type="button"
                onClick={() => {
                  setAbierto(false);
                  onCambiarClave();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-heading transition-colors hover:bg-page"
              >
                <KeyRound size={15} /> Cambiar mi contraseña
              </button>
              <button type="button" onClick={cerrarSesion} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50">
                <LogOut size={15} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
