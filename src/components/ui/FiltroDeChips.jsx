// Fila de "pastillas" para filtrar una lista por grupo, con su cantidad: Todos (25) · Papeletas (4) · ...
//   opciones  [{ clave, etiqueta, cantidad? }]
export default function FiltroDeChips({ opciones, valor, onChange, etiqueta }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={etiqueta}>
      {opciones.map(({ clave, etiqueta: texto, cantidad }) => (
        <button
          key={clave}
          type="button"
          onClick={() => onChange(clave)}
          aria-pressed={valor === clave}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            valor === clave ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:text-heading'
          }`}
        >
          {texto}
          {cantidad !== undefined && <span className="ml-1 opacity-80">({cantidad})</span>}
        </button>
      ))}
    </div>
  );
}
