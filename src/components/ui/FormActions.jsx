import { Loader2 } from 'lucide-react';

export default function FormActions({
  onCancel,
  submitting,
  submitLabel = 'Guardar',
  savingLabel = 'Guardando…',
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-line pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-page"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        {submitting ? savingLabel : submitLabel}
      </button>
    </div>
  );
}
