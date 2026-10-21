import { Loader2 } from 'lucide-react';
import { colorDeTurno } from './coloresDeTurno';

const DIA_DE_SEMANA = { Sa: 'bg-slate-50', Do: 'bg-slate-100' };

/**
 * Grilla de programacion del mes: trabajadores en filas (con sus horas del mes), dias en columnas y, en cada celda, los
 * turnos asignados. Las celdas con una ausencia aprobada (vacaciones, licencia, descanso medico) se muestran y no se
 * pintan. La ultima fila cuenta cuantos trabajadores cubren cada dia.
 *
 *   grilla     respuesta de GET /programacion-mensual
 *   editable   si se puede pintar (borrador o sin programacion, y con permiso)
 *   ocupada    "vinculo|fecha" de la celda que se esta guardando
 *   onCelda    (fila, dia) => void
 */
export default function GrillaDeProgramacion({ grilla, editable, ocupada, onCelda }) {
  const { dias } = grilla.periodo;
  const total = (fecha) => Object.values(grilla.cobertura[fecha] ?? {}).reduce((a, b) => a + b, 0);
  const detalle = (fecha) =>
    Object.entries(grilla.cobertura[fecha] ?? {})
      .map(([codigo, n]) => `${codigo}: ${n}`)
      .join(' · ');
  const fondoDia = (dia) => (dia.no_laborable ? 'bg-rose-50' : (DIA_DE_SEMANA[dia.dia_semana] ?? ''));

  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
      <table className="border-separate border-spacing-0 text-xs">
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 min-w-56 border-b border-r border-line bg-surface px-3 py-2 text-left font-semibold text-heading">Trabajador</th>
            <th className="sticky top-0 z-20 border-b border-r border-line bg-surface px-2 py-2 font-semibold text-heading">Horas</th>
            {dias.map((dia) => (
              <th
                key={dia.fecha}
                title={dia.no_laborable ? (dia.no_laborable.descripcion ?? dia.no_laborable.tipo) : undefined}
                className={`sticky top-0 z-20 min-w-11 border-b border-r border-line-soft px-1 py-1 text-center font-medium ${dia.no_laborable ? 'bg-rose-50 text-rose-700' : `${fondoDia(dia) || 'bg-surface'} text-heading`}`}
              >
                <span className="block text-[13px]">{dia.dia}</span>
                <span className="block text-[10px] text-muted">{dia.dia_semana}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grilla.trabajadores.map((fila) => (
            <tr key={fila.vinculo_id}>
              <th className="sticky left-0 z-10 border-b border-r border-line bg-surface px-3 py-1.5 text-left font-normal">
                <span className="block max-w-56 truncate font-semibold uppercase text-heading">{fila.nombre}</span>
                <span className="block max-w-56 truncate text-[11px] text-muted">
                  {fila.cargo} · {fila.condicion}
                </span>
              </th>
              <td className="border-b border-r border-line px-2 text-center font-semibold text-heading">{fila.horas}</td>
              {dias.map((dia) => {
                const celda = fila.celdas[dia.fecha];
                const clave = `${fila.vinculo_id}|${dia.fecha}`;
                const cargando = ocupada === clave;
                const bloqueada = !editable || Boolean(celda.ausencia);
                return (
                  <td key={dia.fecha} className={`h-11 border-b border-r border-line-soft p-0.5 text-center ${fondoDia(dia)}`}>
                    <button
                      type="button"
                      disabled={bloqueada || Boolean(ocupada)}
                      onClick={() => onCelda(fila, dia)}
                      title={celda.ausencia ? celda.ausencia.nombre : `${fila.nombre} · ${dia.dia_semana} ${dia.dia}`}
                      data-celda={clave}
                      className={`flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-md transition-colors ${
                        bloqueada ? 'cursor-default' : 'hover:bg-brand-soft'
                      } ${celda.ausencia ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgb(226_232_240)_4px,rgb(226_232_240)_6px)]' : ''}`}
                    >
                      {cargando ? (
                        <Loader2 size={14} className="animate-spin text-muted" />
                      ) : celda.ausencia && celda.turnos.length === 0 ? (
                        <span className="text-[10px] font-semibold text-muted">{celda.ausencia.abreviatura}</span>
                      ) : (
                        celda.turnos.map((t) => (
                          <span key={t.id} className={`whitespace-nowrap rounded px-1 text-[10px] font-bold leading-4 ${colorDeTurno(grilla.turnos, t.turno_id)}`}>
                            {t.codigo}
                          </span>
                        ))
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className="sticky bottom-0 left-0 z-30 border-r border-t border-line bg-page px-3 py-2 text-left font-semibold text-heading">Personal programado</th>
            <td className="sticky bottom-0 z-20 border-r border-t border-line bg-page" />
            {dias.map((dia) => (
              <td key={dia.fecha} title={detalle(dia.fecha)} className="sticky bottom-0 z-20 border-r border-t border-line-soft bg-page py-2 text-center font-semibold text-heading">
                {total(dia.fecha) || '·'}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
