import { Pencil, Power } from 'lucide-react';

// Botones editar/desactivar al final de una fila de <Table>. Mismo estilo que los de EntityCard.
export default function RowActions({ onEdit, onToggle }) {
  return (
    <div className="flex justify-end gap-1">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-page hover:text-brand"
          aria-label="Editar"
          title="Editar"
        >
          <Pencil size={14} />
        </button>
      )}
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Desactivar"
          title="Desactivar"
        >
          <Power size={14} />
        </button>
      )}
    </div>
  );
}
