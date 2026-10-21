import { CircleCheck, X } from 'lucide-react';

// Confirmacion breve de una accion (p. ej. "Entrada de ... registrada a las 07:31"). Se cierra con la X.
export default function AvisoExito({ children, onCerrar }) {
  if (!children) return null;

  return (
    <div role="status" className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
      <CircleCheck size={18} className="shrink-0" />
      <div className="flex-1">{children}</div>
      {onCerrar && (
        <button type="button" onClick={onCerrar} aria-label="Cerrar aviso" className="rounded-md p-1 text-emerald-700 transition-colors hover:bg-emerald-100">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
