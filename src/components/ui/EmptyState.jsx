import ModuleIcon from './ModuleIcon';
import { useModuleMeta } from '../../nav/moduleIcons';

// Sin `icon` usa el icono del modulo actual (o el fallback): nunca queda vacio.
export default function EmptyState({ icon, message }) {
  const meta = useModuleMeta();

  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/80 px-6 py-12 text-center shadow-[var(--shadow-card)]">
      <ModuleIcon icon={icon ?? meta.icon} tone={meta.tone} size="lg" className="mx-auto mb-4" />
      <p className="mx-auto max-w-md text-sm text-muted">{message}</p>
    </div>
  );
}
