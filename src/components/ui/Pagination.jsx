import { ChevronLeft, ChevronRight } from 'lucide-react';

const TAMANOS = [5, 10, 25, 50];

// Botones de pagina con elipsis: 1 … 4 5 6 … 12
function paginasVisibles(actual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const lista = [...new Set([1, total, actual - 1, actual, actual + 1])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  return lista.flatMap((n, i) => (i > 0 && n - lista[i - 1] > 1 ? ['…', n] : [n]));
}

const BOTON = 'flex h-8 min-w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors';

// Pie de paginacion UNICO de todas las vistas (tabla y tarjetas).
//   total / desde / cantidad   para el texto "Mostrando a–b de N"
//   porPagina                  'auto' (cabe en pantalla) o un numero fijo
export default function Pagination({ total, pagina, paginas, desde, cantidad, porPagina, onPagina, onPorPagina }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2.5 text-xs text-slate-500">
      <span>{total === 0 ? '0 registros' : `Mostrando ${desde + 1}–${desde + cantidad} de ${total} registros`}</span>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          Registros por página
          <select
            value={porPagina}
            onChange={(event) => onPorPagina(event.target.value === 'auto' ? 'auto' : Number(event.target.value))}
            className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs text-heading outline-none focus:border-brand"
          >
            <option value="auto">Auto</option>
            {TAMANOS.map((tamano) => (
              <option key={tamano} value={tamano}>
                {tamano}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPagina(pagina - 1)}
            disabled={pagina === 1}
            aria-label="Página anterior"
            className={`${BOTON} border border-line text-slate-500 hover:bg-page disabled:opacity-40 disabled:hover:bg-transparent`}
          >
            <ChevronLeft size={15} />
          </button>
          {paginasVisibles(pagina, paginas).map((n, i) =>
            n === '…' ? (
              <span key={`e${i}`} className="px-1 text-slate-400">
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPagina(n)}
                aria-current={n === pagina ? 'page' : undefined}
                className={`${BOTON} ${n === pagina ? 'bg-brand text-white shadow-sm' : 'text-slate-600 hover:bg-page'}`}
              >
                {n}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => onPagina(pagina + 1)}
            disabled={pagina === paginas}
            aria-label="Página siguiente"
            className={`${BOTON} border border-line text-slate-500 hover:bg-page disabled:opacity-40 disabled:hover:bg-transparent`}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
