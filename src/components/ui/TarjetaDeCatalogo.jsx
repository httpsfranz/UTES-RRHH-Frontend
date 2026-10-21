import { ChevronRight } from 'lucide-react';
import ModuleIcon from './ModuleIcon';
import { TONES } from '../../nav/moduleIcons';

// Celda de la pantalla de configuracion: un catalogo pequeno (icono, nombre y para que sirve). Al pulsarla se abre su
// administracion en un modal.
export default function TarjetaDeCatalogo({ icono, titulo, descripcion, tono = TONES.slate, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-pop)]"
    >
      <ModuleIcon icon={icono} tone={tono} size="md" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-heading">{titulo}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted">{descripcion}</span>
      </span>
      <ChevronRight size={16} className="mt-1 shrink-0 text-slate-300 transition-colors group-hover:text-brand" />
    </button>
  );
}
