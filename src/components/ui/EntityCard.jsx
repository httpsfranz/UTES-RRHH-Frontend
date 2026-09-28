import { motion } from 'motion/react';
import { Pencil, Power } from 'lucide-react';
import StatusBadge from './StatusBadge';

// La tarjeta de catalogo que se repite en (casi) todos los modulos de mantenimiento:
// avatar (icono fijo o inicial del nombre) + badge de estado arriba, titulo + lineas
// de meta-info, y una franja inferior con el dato "corto" (codigo/id) + acciones.
export default function EntityCard({
  icon: Icon,
  initial,
  active,
  title,
  meta = [],
  footer,
  onEdit,
  onToggle,
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm hover:shadow-md"
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-semibold text-brand">
            {Icon ? <Icon size={20} /> : initial}
          </div>
          <StatusBadge active={active} />
        </div>

        <h3 className="mt-4 line-clamp-2 text-base font-medium leading-tight text-heading">
          {title}
        </h3>

        {meta.filter(Boolean).map((line, index) => (
          <p key={index} className="mt-1 line-clamp-2 text-sm text-muted">
            {line}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
        <span className="truncate text-xs font-medium text-muted">{footer}</span>
        <div className="flex shrink-0 gap-1">
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
      </div>
    </motion.div>
  );
}
