import { Pencil, Power, RotateCcw, Trash2 } from 'lucide-react';

// Botones de accion de una tarjeta (EntityCard) o de una fila (EntityList en modo tabla).
// `active` decide que hace el boton de estado: desactivar si esta activo, reactivar si no.
// Las tablas sin columna de Estado (se eliminan de verdad) usan onDelete en vez de onToggle.
// `extras` son acciones propias del modulo: [{ icon, label, onClick }] (p. ej. "Permisos" de un rol).
function IconButton({ icon: Icon, label, onClick, tono }) {
  const colores =
    tono === 'peligro'
      ? 'hover:bg-red-50 hover:text-red-600'
      : tono === 'ok'
        ? 'hover:bg-green-50 hover:text-accent-green'
        : 'hover:bg-page hover:text-brand';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg p-1.5 text-muted transition-colors ${colores}`}
      aria-label={label}
      title={label}
    >
      <Icon size={14} />
    </button>
  );
}

export default function ActionButtons({ active, extras = [], onEdit, onToggle, onDelete }) {
  return (
    <div className="flex shrink-0 justify-end gap-1">
      {extras.map((extra) => (
        <IconButton key={extra.label} icon={extra.icon} label={extra.label} onClick={extra.onClick} />
      ))}
      {onEdit && <IconButton icon={Pencil} label="Editar" onClick={onEdit} />}
      {onToggle &&
        (active === false ? (
          <IconButton icon={RotateCcw} label="Reactivar" tono="ok" onClick={onToggle} />
        ) : (
          <IconButton icon={Power} label="Desactivar" tono="peligro" onClick={onToggle} />
        ))}
      {onDelete && <IconButton icon={Trash2} label="Eliminar" tono="peligro" onClick={onDelete} />}
    </div>
  );
}
