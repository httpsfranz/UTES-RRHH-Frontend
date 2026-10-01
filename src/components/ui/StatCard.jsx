import ModuleIcon from './ModuleIcon';
import { TONES } from '../../nav/moduleIcons';

// Indicador: icono pastel grande + etiqueta + numero grande de color. Opcional: `progress` (0-100)
// dibuja a la derecha del numero el porcentaje y una barra fina; `hint` es un texto suelto.
export default function StatCard({ label, value, icon, tone = TONES.teal, hint, progress }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
      {icon && <ModuleIcon icon={icon} tone={tone} size="xl" />}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-600">{label}</p>
        <div className="mt-1 flex items-end gap-4">
          <p className={`text-3xl font-bold leading-none tracking-tight ${icon ? tone.text : 'text-heading'}`}>{value}</p>
          {progress !== undefined ? (
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-right text-xs font-medium text-slate-600">{hint ?? `${progress}%`}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-line-soft">
                <div
                  className={`h-full rounded-full ${tone.bar}`}
                  style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
                />
              </div>
            </div>
          ) : (
            hint && <span className="pb-0.5 text-xs font-medium text-muted">{hint}</span>
          )}
        </div>
      </div>
    </div>
  );
}
