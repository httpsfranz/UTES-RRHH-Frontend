const TONOS = {
  success: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  neutral: { pill: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
  warning: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  danger: { pill: 'bg-rose-50 text-rose-600', dot: 'bg-rose-500' },
  info: { pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
};

// Pill de estado con punto. Uso habitual: <StatusBadge active={bool} /> (Activo / Inactivo).
// Para otros estados: <StatusBadge tone="warning" label="Pendiente" />.
export default function StatusBadge({ active, tone, label }) {
  const resuelto = tone ?? (active ? 'success' : 'danger');
  const texto = label ?? (active ? 'Activo' : 'Inactivo');
  const estilo = TONOS[resuelto] ?? TONOS.neutral;

  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${estilo.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${estilo.dot}`} />
      {texto}
    </span>
  );
}
