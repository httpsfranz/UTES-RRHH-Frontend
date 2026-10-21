import { ChevronLeft, ChevronRight } from 'lucide-react';

// Anterior | etiqueta del periodo | Siguiente, y "Hoy" (o `textoHoy`) para volver al periodo de referencia.
export default function NavegadorDeFecha({ etiqueta, onAnterior, onSiguiente, onHoy, esHoy, textoHoy = 'Hoy' }) {
  const boton = 'rounded-lg p-2 text-muted transition-colors hover:bg-page hover:text-heading';
  return (
    <div className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-sm">
      <button type="button" onClick={onAnterior} className={boton} aria-label="Anterior">
        <ChevronLeft size={16} />
      </button>
      <span className="min-w-44 px-2 text-center text-sm font-medium text-heading">{etiqueta}</span>
      <button type="button" onClick={onSiguiente} className={boton} aria-label="Siguiente">
        <ChevronRight size={16} />
      </button>
      <button
        type="button"
        onClick={onHoy}
        disabled={esHoy}
        className="ml-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/10 disabled:cursor-default disabled:text-muted disabled:hover:bg-transparent"
      >
        {textoHoy}
      </button>
    </div>
  );
}
