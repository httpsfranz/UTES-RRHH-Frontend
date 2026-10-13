// Una categoria por estado, deducida por el backend de las banderas del catalogo EstadoAsistencia.
//   celda  fondo y color del texto de la celda del calendario (y de la ficha de la leyenda)
export const TONOS_ASISTENCIA = {
  normal: { celda: 'bg-emerald-100 text-emerald-900' },
  tardanza: { celda: 'bg-amber-100 text-amber-900' },
  salida: { celda: 'bg-orange-200 text-orange-900' },
  falta: { celda: 'bg-rose-100 text-rose-800' },
  justificada: { celda: 'bg-sky-100 text-sky-800' },
  cobertura: { celda: 'bg-violet-100 text-violet-800' },
  descanso: { celda: 'bg-slate-200 text-slate-600' },
  programado: { celda: 'bg-surface text-muted' },
};

// Categorias de los calendarios de programacion y de ausencias (programacion-calendario/*).
Object.assign(TONOS_ASISTENCIA, {
  turno: { celda: 'bg-teal-100 text-teal-900' },
  guardia: { celda: 'bg-indigo-100 text-indigo-900' },
  borrador: { celda: 'bg-slate-100 text-slate-500' },
  conflicto: { celda: 'bg-red-300 text-red-950' },
  descanso_medico: { celda: 'bg-pink-100 text-pink-900' },
  licencia: { celda: 'bg-sky-100 text-sky-800' },
  vacaciones: { celda: 'bg-cyan-200 text-cyan-900' },
  vacaciones_prog: { celda: 'bg-cyan-50 text-cyan-800' },
  papeleta: { celda: 'bg-violet-100 text-violet-800' },
});
