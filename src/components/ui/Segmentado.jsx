// Selector de una opcion entre pocas, como botones unidos (p. ej. Dia | Semana | Mes).
//   opciones  [{ value, label, icon? }]
export default function Segmentado({ opciones, value, onChange, etiqueta }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-surface p-1 shadow-sm" role="group" aria-label={etiqueta}>
      {opciones.map(({ value: opcion, label, icon: Icono }) => (
        <button
          key={opcion}
          type="button"
          onClick={() => onChange(opcion)}
          aria-pressed={value === opcion}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opcion ? 'bg-brand text-white shadow-sm' : 'text-muted hover:bg-page hover:text-heading'
          }`}
        >
          {Icono && <Icono size={14} />}
          {label}
        </button>
      ))}
    </div>
  );
}
