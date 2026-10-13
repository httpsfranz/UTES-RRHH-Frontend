// Calendario mensual de asistencia: trabajadores en filas, dias en columnas (formato "Control de Asistencia" de la Red).
// Dibuja EXACTAMENTE la respuesta de GET /asistencia-diaria/calendario (la misma que usa el PDF).
//
//   calendario  respuesta del backend: { periodo: { dias }, trabajadores: [{ celdas }] }
//   onCelda     (trabajador, dia, celda) => void   al pulsar una celda
//
// Ocupa todo el ancho disponible: las columnas de los dias se reparten el espacio que dejan N°, DNI y PERSONAL. Solo si
// el contenedor es mas angosto que el minimo legible (MIN_DIA px por dia) aparece el desplazamiento horizontal; en ese
// caso, y con el desplazamiento vertical de muchos trabajadores, N°, DNI y PERSONAL y el encabezado quedan fijos.
// Los domingos llevan borde rojo (como el formato impreso) y los sabados un fondo suave.
import { TONOS_ASISTENCIA } from './tonosAsistencia';

const ANCHO_N = 32;
const ANCHO_DNI = 76;
const ANCHO_PERSONAL = 168;
const MIN_DIA = 26;

const detalleNoLaborable = (dia) => (dia.no_laborable ? `${dia.no_laborable.tipo}${dia.no_laborable.descripcion ? `: ${dia.no_laborable.descripcion}` : ''}` : null);

function titulo(trabajador, dia, celda) {
  const partes = [trabajador.nombre, `${dia.dia_semana} ${dia.fecha}`];
  if (dia.no_laborable) partes.push(detalleNoLaborable(dia));
  if (!celda.vacia) {
    if (celda.turno) partes.push(`Turno ${celda.turno}`);
    partes.push(celda.estado_nombre ?? 'Programado, sin registro de asistencia');
    if (celda.hora_entrada) partes.push(`${celda.hora_entrada} – ${celda.hora_salida ?? 'sin salida'}`);
    if (celda.minutos_tardanza) partes.push(`Tardanza: ${celda.minutos_tardanza} min`);
    if (celda.observacion) partes.push(celda.observacion);
  }
  return partes.join('\n');
}

const bordeDia = (dia) => (dia.es_domingo ? 'border-x-2 border-x-rose-400' : 'border-r border-r-line-soft');

export default function CalendarioAsistencia({ calendario, onCelda }) {
  const { dias } = calendario.periodo;

  return (
    <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
      <table className="w-full table-fixed border-separate border-spacing-0 text-xs" style={{ minWidth: ANCHO_N + ANCHO_DNI + ANCHO_PERSONAL + dias.length * MIN_DIA }}>
        <colgroup>
          <col style={{ width: ANCHO_N }} />
          <col style={{ width: ANCHO_DNI }} />
          <col style={{ width: ANCHO_PERSONAL }} />
          {dias.map((dia) => (
            <col key={dia.fecha} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="sticky left-0 top-0 z-30 border-b border-line bg-page py-2 text-center font-semibold text-heading">N°</th>
            <th className="sticky left-[32px] top-0 z-30 border-b border-line bg-page py-2 text-center font-semibold text-heading">DNI</th>
            <th className="sticky left-[108px] top-0 z-30 border-b border-r border-line bg-page px-2 py-2 text-left font-semibold text-heading">PERSONAL</th>
            {dias.map((dia) => (
              <th
                key={dia.fecha}
                title={detalleNoLaborable(dia) ?? undefined}
                className={`sticky top-0 z-20 border-b border-line py-1.5 text-center font-semibold leading-tight ${bordeDia(dia)} ${
                  dia.no_laborable ? 'bg-rose-50 text-rose-700' : dia.es_sabado ? 'bg-slate-100 text-heading' : 'bg-page text-heading'
                }`}
              >
                <div>{String(dia.dia).padStart(2, '0')}</div>
                <div className="text-[10px] font-medium text-muted">{dia.dia_semana}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendario.trabajadores.map((trabajador) => (
            <tr key={trabajador.vinculo_id}>
              <td className="sticky left-0 z-10 border-b border-line-soft bg-surface text-center text-muted">{trabajador.n}</td>
              <td className="sticky left-[32px] z-10 border-b border-line-soft bg-surface text-center tabular-nums text-heading">{trabajador.dni}</td>
              <td className="sticky left-[108px] z-10 border-b border-r border-line border-b-line-soft bg-surface px-2 py-1 text-left" title={`${trabajador.nombre}\n${trabajador.cargo} · ${trabajador.condicion}`}>
                <div className="truncate text-[11px] font-semibold uppercase leading-tight text-heading">{trabajador.nombre}</div>
                <div className="truncate text-[10px] leading-tight text-muted">
                  {trabajador.cargo} · {trabajador.condicion}
                </div>
              </td>
              {dias.map((dia) => {
                const celda = trabajador.celdas[dia.fecha];
                const fondo = celda.vacia ? (dia.no_laborable ? 'bg-rose-50' : dia.es_sabado ? 'bg-slate-50' : '') : (TONOS_ASISTENCIA[celda.categoria] ?? TONOS_ASISTENCIA.normal).celda;
                return (
                  <td key={dia.fecha} className={`h-9 border-b border-line-soft p-0 ${bordeDia(dia)} ${fondo}`}>
                    <button
                      type="button"
                      onClick={() => onCelda?.(trabajador, dia, celda)}
                      title={titulo(trabajador, dia, celda)}
                      aria-label={`${trabajador.nombre}, ${dia.fecha}: ${celda.vacia ? 'sin registro' : (celda.estado_nombre ?? 'turno programado')}`}
                      className="flex h-full w-full flex-col items-center justify-center overflow-hidden leading-tight outline-none transition-colors hover:bg-brand/10 focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {celda.vacia ? (
                        <span className="text-line">·</span>
                      ) : (
                        <>
                          <span className={`font-semibold ${celda.linea1.length > 3 ? 'text-[8px]' : 'text-[12px]'}`}>{celda.linea1}</span>
                          <span className="text-[10px]">{celda.linea2 || ' '}</span>
                        </>
                      )}
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
