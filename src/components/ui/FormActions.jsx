import { Loader2 } from 'lucide-react';

export default function FormActions({
  onCancel,
  submitting,
  submitLabel = 'Guardar',
  savingLabel = 'Guardando…',
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-line-soft pt-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-page"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {submitting ? savingLabel : submitLabel}
      </button>
    </div>
  );
}