import { motion } from 'motion/react';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

// La tarjeta de catalogo que se repite en (casi) todos los modulos de mantenimiento:
// avatar (icono fijo o inicial del nombre) + badge de estado arriba, titulo + lineas
// de meta-info (el badge se omite si `active` no viene: tablas sin Estado, que se eliminan con onDelete), y una franja inferior con el dato "corto" (codigo/id) + acciones.
export default function EntityCard({
  icon: Icon,
  initial,
  active,
  title,
  meta = [],
  footer,
  onEdit,
  onToggle,
  onDelete,
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm hover:shadow-md ${
        active === false ? 'opacity-70' : ''
      }`}
    >
      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-semibold text-brand">
            {Icon ? <Icon size={20} /> : initial}
          </div>
          {active !== undefined && <StatusBadge active={active} />}
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
        <ActionButtons active={active} onEdit={onEdit} onToggle={onToggle} onDelete={onDelete} />
      </div>
    </motion.div>
  );
}
