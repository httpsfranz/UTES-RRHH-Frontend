import { ChevronRight } from 'lucide-react';

/**
 * Tarjeta pequena que abre el detalle de un registro (p. ej. un establecimiento dentro de su microred): titulo, unas
 * lineas de datos y, opcionalmente, una linea resaltada (el responsable). Toda la tarjeta es el boton.
 */
export default function TarjetaResumen({ titulo, lineas = [], destacado, inactivo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-2 rounded-xl border border-line bg-page/40 p-3 text-left transition-colors hover:border-brand/40 hover:bg-surface ${
        inactivo ? 'opacity-60' : ''
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 block text-sm font-semibold text-heading">{titulo}</span>
        {lineas.filter(Boolean).map((linea) => (
          <span key={linea} className="mt-0.5 block truncate text-xs text-muted">
            {linea}
          </span>
        ))}
        {destacado && <span className="mt-1.5 block truncate text-xs font-medium text-brand-dark">{destacado}</span>}
      </span>
      <ChevronRight size={16} className="mt-0.5 shrink-0 text-slate-300 transition-colors group-hover:text-brand" />
    </button>
  );
}
