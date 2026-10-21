import { motion } from 'motion/react';
import { CircleAlert } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import ModuleIcon from './ModuleIcon';
import { useModuleMeta } from '../../nav/moduleIcons';

// La tarjeta de catalogo que se repite en (casi) todos los modulos de mantenimiento:
// cuadrado de icono + badge de estado arriba, titulo + lineas de meta-info (el badge se omite si
// `active` no viene: tablas sin Estado, que se eliminan con onDelete), y una franja inferior con el
// dato "corto" (codigo/id) + acciones. `aviso`: algo que falta completar (p. ej. "Falta horario"), como pastilla ambar.
//
// CUADRADO DE ICONO (nunca vacio). Orden de resolucion:
//   1. `icon`     que declare la Page en su card()
//   2. `initial`  inicial del nombre (personas, microredes...), solo si realmente trae un caracter
//   3. icono del modulo (registro central nav/moduleIcons.js, segun la ruta; hereda el del grupo
//      y, en ultima instancia, FALLBACK_ICON)
// Antes se pintaba `Icon ? <Icon/> : initial`: las Pages que no pasaban ni icon ni initial dejaban
// el cuadrado en blanco (Profesiones, Tipos de colegiatura, etc.).
export default function EntityCard({
  icon,
  initial,
  active,
  title,
  meta = [],
  footer,
  onEdit,
  onToggle,
  onDelete,
  extras,
  aviso,
  etiquetas = {},
}) {
  const modulo = useModuleMeta();
  const letra = typeof initial === 'string' ? initial.trim().slice(0, 1).toUpperCase() : '';

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] ${
        active === false ? 'opacity-70' : ''
      }`}
    >
      <div className="flex-1 overflow-hidden p-4">
        <div className="flex items-start justify-between gap-2">
          {icon || !letra ? (
            <ModuleIcon icon={icon ?? modulo.icon} tone={modulo.tone} />
          ) : (
            <ModuleIcon tone={modulo.tone}>{letra}</ModuleIcon>
          )}
          {active !== undefined && <StatusBadge active={active} label={active ? etiquetas.activo : etiquetas.inactivo} />}
        </div>

        <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-heading">{title}</h3>

        {meta.filter(Boolean).map((line, index) => (
          <p key={index} className="mt-0.5 line-clamp-1 text-[13px] text-muted">
            {line}
          </p>
        ))}

        {aviso && (
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11.5px] font-medium text-amber-700 ring-1 ring-amber-200">
            <CircleAlert size={12} aria-hidden="true" />
            {aviso}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line-soft bg-page/40 px-4 py-1.5">
        <span className="truncate text-xs font-medium text-muted">{footer}</span>
        <ActionButtons
          active={active}
          extras={extras}
          onEdit={onEdit}
          onToggle={onToggle}
          onDelete={onDelete}
          labelDesactivar={etiquetas.desactivar}
        />
      </div>
    </motion.div>
  );
}
