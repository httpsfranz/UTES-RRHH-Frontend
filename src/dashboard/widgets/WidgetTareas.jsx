import { Link } from 'react-router-dom';
import { ArrowRight, PartyPopper } from 'lucide-react';
import { TONES } from '../../nav/moduleIcons';
import ModuleIcon from '../../components/ui/ModuleIcon';
import { ICONOS } from '../iconos';
import { TONES_DE_ICONO, tonoDe } from '../tonos';

// "Por hacer": cada pendiente es una tarjeta que lleva directo a donde se resuelve (bandeja, control de asistencia,
// programacion del mes, cierre del mes). Sin pendientes, un mensaje de todo al dia.
export default function WidgetTareas({ titulo, items, vacio }) {
  return (
    <section aria-label={titulo} className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{titulo}</h2>
      {items.length === 0 ? (
        <p className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <PartyPopper size={18} /> {vacio}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((tarea) => (
            <Link
              key={tarea.titulo}
              to={tarea.enlace}
              className="group flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-surface p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand/50"
            >
              <ModuleIcon icon={ICONOS[tarea.icono] ?? ICONOS.check} tone={TONES[TONES_DE_ICONO[tarea.tono]] ?? TONES.teal} size="md" />
              <span className="min-w-0 flex-1">
                <span className={`block text-2xl font-bold leading-none ${tonoDe(tarea.tono).texto}`}>{tarea.cantidad}</span>
                <span className="mt-1 block text-sm font-semibold text-heading">{tarea.titulo}</span>
                <span className="mt-0.5 block text-xs text-muted">{tarea.detalle}</span>
              </span>
              <ArrowRight size={16} className="mt-1 shrink-0 text-slate-300 transition-colors group-hover:text-brand" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
