// Botones Día / Semana / Mes de un gráfico de tendencia. Sin opciones (otros widgets) no se dibuja nada.
export default function SelectorDeAgrupacion({ opciones, actual, alElegir }) {
  if (!opciones || !alElegir) return null;
  return (
    <div className="flex shrink-0 gap-0.5 rounded-lg bg-page p-0.5" role="group" aria-label="Agrupar por">
      {Object.entries(opciones).map(([clave, nombre]) => (
        <button
          key={clave}
          type="button"
          aria-pressed={clave === actual}
          onClick={() => alElegir(clave)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${clave === actual ? 'bg-surface text-heading shadow-sm' : 'text-slate-500 hover:text-heading'}`}
        >
          {nombre}
        </button>
      ))}
    </div>
  );
}
