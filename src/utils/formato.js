// Formato de valores para mostrar en tablas y tarjetas.

export const siNo = (valor) => (valor ? 'Sí' : 'No');

export function formatoBytes(bytes) {
  if (bytes === null || bytes === undefined) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 2026-07-28 -> 28/07/2026 (sin pasar por Date: evita el desfase de zona horaria).
export function formatoFecha(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso ?? '—');
}

// 2026-09-28 06:00:05 -> 28/09/2026 06:00
export function formatoFechaHora(valor) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(valor ?? '');
  return m ? `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}` : (valor ?? '—');
}

// 480 -> "8 h", 450 -> "7 h 30 min", 45 -> "45 min"
export function formatoDuracion(minutos) {
  if (minutos === null || minutos === undefined) return '—';
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

// "Quispe Huamán, María Elena (DNI 70000001)": como se elige un trabajador en un select.
export const etiquetaTrabajador = (trabajador) =>
  `${trabajador.nombre_completo} (${trabajador.numero_documento})${trabajador.activo === false ? ' (inactivo)' : ''}`;
