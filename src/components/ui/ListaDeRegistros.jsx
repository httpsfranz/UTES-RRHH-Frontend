import ActionButtons from './ActionButtons';
import StatusBadge from './StatusBadge';

/**
 * Lista corta dentro de un detalle (p. ej. los responsables de un establecimiento): una fila por registro con su titulo,
 * su detalle y las acciones de editar / desactivar.
 *
 *   filas   [{ id, titulo, detalle, activo, onEdit, onToggle }]
 */
export default function ListaDeRegistros({ titulo, filas, vacio, accion }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{titulo}</h3>
        {accion}
      </div>
      {filas.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-sm text-muted">{vacio}</p>
      ) : (
        <ul className="divide-y divide-line-soft rounded-xl border border-line">
          {filas.map((fila) => (
            <li key={fila.id} className={`flex items-center gap-3 px-3 py-2.5 ${fila.activo === false ? 'opacity-60' : ''}`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-heading">{fila.titulo}</p>
                <p className="truncate text-xs text-muted">{fila.detalle}</p>
              </div>
              {fila.activo === false && <StatusBadge active={false} />}
              <ActionButtons active={fila.activo} onEdit={fila.onEdit} onToggle={fila.onToggle} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
