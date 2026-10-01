import { LayoutGrid, Sparkles, Table2 } from 'lucide-react';

const OPCIONES = [
  { value: 'auto', label: 'Automática', icon: Sparkles },
  { value: 'tarjetas', label: 'Tarjetas', icon: LayoutGrid },
  { value: 'tabla', label: 'Tabla', icon: Table2 },
];

// Selector de vista del listado: Automática (tarjetas o tabla segun cuantos registros haya),
// o forzar una de las dos.
export default function ViewToggle({ value, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-surface p-1 shadow-sm" role="group" aria-label="Vista del listado">
      {OPCIONES.map(({ value: opcion, label, icon: Icon }) => (
        <button
          key={opcion}
          type="button"
          onClick={() => onChange(opcion)}
          aria-pressed={value === opcion}
          title={label}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opcion ? 'bg-brand text-white shadow-sm' : 'text-muted hover:bg-page hover:text-heading'
          }`}
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
