// Alturas fijas de la tabla: EntityList las usa para calcular cuantas filas caben en pantalla.
export const ALTO_FILA = 40;
export const ALTO_ENCABEZADO = 38;

// Colores pastel que rotan en la columna "#".
const COLORES_NUMERO = [
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-orange-100 text-orange-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
];

// Valores de texto que se pintan como pill en cualquier tabla (verde = positivo, rojo = negativo,
// ambar = intermedio). Incluye los "Sí"/"No" de utils/formato.
const PILLS = {
  Sí: 'bg-emerald-50 text-emerald-700',
  No: 'bg-rose-50 text-rose-600',
  Activo: 'bg-emerald-50 text-emerald-700',
  Inactivo: 'bg-rose-50 text-rose-600',
  Pendiente: 'bg-amber-50 text-amber-700',
  'En proceso': 'bg-amber-50 text-amber-700',
  Parcial: 'bg-amber-50 text-amber-700',
  Observado: 'bg-amber-50 text-amber-700',
};

function Celda({ valor }) {
  if (typeof valor === 'string' && PILLS[valor]) {
    return (
      <span className={`inline-flex min-w-9 justify-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${PILLS[valor]}`}>
        {valor}
      </span>
    );
  }
  return valor;
}

// columns: [{ key, header, render?(row) }]. Presentacional: la paginacion la maneja EntityList
// (`rows` ya es la pagina visible; `offset` numera las filas). `numbered` agrega la columna "#".
// El encabezado queda fijo si el contenedor tiene scroll.
export default function Table({ columns, rows, getRowKey = (row) => row.id, numbered = false, offset = 0 }) {
  const encabezado = 'sticky top-0 z-10 whitespace-nowrap bg-page px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500';

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr style={{ height: ALTO_ENCABEZADO }}>
          {numbered && (
            <th scope="col" className={`${encabezado} w-12`}>
              #
            </th>
          )}
          {columns.map((column) => (
            <th key={column.key} scope="col" className={encabezado}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr
            key={getRowKey(row)}
            style={{ height: ALTO_FILA }}
            className="border-t border-line-soft transition-colors hover:bg-brand-soft/60"
          >
            {numbered && (
              <td className="px-4">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                    COLORES_NUMERO[(offset + index) % COLORES_NUMERO.length]
                  }`}
                >
                  {offset + index + 1}
                </span>
              </td>
            )}
            {columns.map((column) => (
              <td key={column.key} className="px-4 text-[13px] text-heading">
                <Celda valor={column.render ? column.render(row) : (row[column.key] ?? '—')} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
