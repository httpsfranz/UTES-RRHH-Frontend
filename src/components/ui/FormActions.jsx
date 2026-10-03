import { Loader2 } from 'lucide-react';

// `extra` es una accion propia a la izquierda (p. ej. "Agregar linea"); `hideSubmit` oculta Guardar cuando el
// modal solo se consulta, y `cancelLabel` pasa a "Cerrar" en ese caso.
export default function FormActions({
  onCancel,
  submitting,
  submitLabel = 'Guardar',
  savingLabel = 'Guardando…',
  cancelLabel = 'Cancelar',
  hideSubmit = false,
  extra = null,
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-line-soft pt-5">
      {extra && <div className="mr-auto">{extra}</div>}
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-page"
      >
        {cancelLabel}
      </button>
      {!hideSubmit && (
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? savingLabel : submitLabel}
        </button>
      )}
    </div>
  );
}
