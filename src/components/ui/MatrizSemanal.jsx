import { DIAS_SEMANA } from '../../utils/opciones';

const ESTILOS = {
  '': 'border-line bg-surface text-muted hover:bg-page',
  trabaja: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  descanso: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100',
};

const TEXTOS = { '': '—', trabaja: 'Trabaja', descanso: 'Descanso' };

/**
 * Grilla semanal: una fila por turno y una columna por dia (lunes a domingo).
 *   filas       [{ id, titulo, detalle }]
 *   valorDe     (filaId, dia) => '' | 'trabaja' | 'descanso'
 *   onCambiar   (filaId, dia) => void   (la pantalla decide como avanza el estado)
 */
export default function MatrizSemanal({ filas, valorDe, onCambiar }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="bg-page/60 text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <th scope="col" className="px-3 py-2.5">
              Turno
            </th>
            {DIAS_SEMANA.map((dia) => (
              <th key={dia.value} scope="col" className="px-1 py-2.5 text-center">
                {dia.corto}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id} className="border-t border-line-soft">
              <th scope="row" className="px-3 py-2 text-left font-medium text-heading">
                <span className="block">{fila.titulo}</span>
                <span className="block text-xs font-normal text-muted">{fila.detalle}</span>
              </th>
              {DIAS_SEMANA.map((dia) => {
                const valor = valorDe(fila.id, dia.value);
                return (
                  <td key={dia.value} className="px-1 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => onCambiar(fila.id, dia.value)}
                      aria-label={`${fila.titulo}, ${dia.label}: ${valor ? TEXTOS[valor] : 'sin asignar'}`}
                      data-estado={valor || 'ninguno'}
                      className={`h-9 w-full min-w-[68px] rounded-lg border text-xs font-medium transition-colors ${ESTILOS[valor]}`}
                    >
                      {TEXTOS[valor]}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
