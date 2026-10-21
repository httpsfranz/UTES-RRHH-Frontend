import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useBandeja } from '../hooks/useBandeja';
import { formatoFechaHora } from '../utils/formato';

// Campana del encabezado: cuantos avisos sin leer hay y los ultimos; al pulsar uno se marca leido y se va a su pantalla.
export default function CampanaDeNotificaciones() {
  const bandeja = useBandeja();
  const navegar = useNavigate();
  const [abierta, setAbierta] = useState(false);
  const contenedor = useRef(null);

  useEffect(() => {
    if (!abierta) return undefined;
    const cerrar = (event) => {
      if (!contenedor.current?.contains(event.target)) setAbierta(false);
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, [abierta]);

  async function abrir(notificacion) {
    await bandeja.leer(notificacion);
    setAbierta(false);
    if (notificacion.enlace) navegar(notificacion.enlace);
  }

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        className="relative rounded-xl p-2.5 text-muted transition-colors hover:bg-page hover:text-heading"
        aria-label={`Notificaciones${bandeja.no_leidas ? `: ${bandeja.no_leidas} sin leer` : ''}`}
        aria-expanded={abierta}
      >
        <Bell size={19} />
        {bandeja.no_leidas > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white ring-2 ring-surface">
            {bandeja.no_leidas > 99 ? '99+' : bandeja.no_leidas}
          </span>
        )}
      </button>
      {abierta && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-2xl border border-line bg-surface shadow-[var(--shadow-pop)]">
          <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
            <p className="text-sm font-semibold text-heading">Notificaciones</p>
            {bandeja.no_leidas > 0 && (
              <button type="button" onClick={bandeja.leerTodas} className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                <CheckCheck size={14} /> Marcar todas
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {bandeja.data.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No tienes avisos.</li>}
            {bandeja.data.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => abrir(n)} className={`w-full border-b border-line-soft px-4 py-3 text-left transition-colors hover:bg-page ${n.leida ? '' : 'bg-brand/5'}`}>
                  <span className="flex items-center gap-2">
                    {!n.leida && <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />}
                    <span className="truncate text-sm font-semibold text-heading">{n.titulo}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{n.mensaje}</span>
                  <span className="mt-1 block text-[11px] text-slate-400">{formatoFechaHora(n.fecha)}</span>
                </button>
              </li>
            ))}
          </ul>
          <Link to="/soporte/notificaciones" onClick={() => setAbierta(false)} className="block rounded-b-2xl px-4 py-2.5 text-center text-xs font-medium text-brand hover:bg-page">
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}
