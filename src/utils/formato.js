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

// El navegador trabaja con "AAAA-MM-DDTHH:MM" (datetime-local); la API entrega y recibe "AAAA-MM-DD HH:MM[:SS]".
export const aCampoFecha = (fechaHora) => (fechaHora ? fechaHora.slice(0, 16).replace(' ', 'T') : '');

// Ahora mismo, en formato datetime-local.
export function ahoraLocal() {
  const ahora = new Date();
  const dosDigitos = (n) => String(n).padStart(2, '0');
  return `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}T${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}`;
}

// "Quispe Huamán, María Elena · Enfermero(a) · C.S. La Esperanza": como se elige un vinculo laboral en un select.
export const etiquetaVinculo = (vinculo) =>
  [vinculo.trabajador?.nombre_completo, vinculo.cargo?.nombre, vinculo.eess?.nombre].filter(Boolean).join(' · ') +
  (vinculo.vigente === false ? ' (no vigente)' : '');

// Ultimo dia de un descanso de `dias` dias calendario desde `inicio` (AAAA-MM-DD), sin pasar por la zona horaria.
export function finDelDescanso(inicio, dias) {
  const n = Number(dias);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio ?? '') || !Number.isInteger(n) || n < 1) return null;
  const fecha = new Date(`${inicio}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + n - 1);
  return fecha.toISOString().slice(0, 10);
}

// Dias calendario entre dos fechas AAAA-MM-DD, ambas incluidas (null si falta alguna o el fin es anterior al inicio).
export function diasCalendario(inicio, fin) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio ?? '') || !/^\d{4}-\d{2}-\d{2}$/.test(fin ?? '')) return null;
  const dias = Math.round((Date.parse(`${fin}T12:00:00Z`) - Date.parse(`${inicio}T12:00:00Z`)) / 86400000) + 1;
  return dias >= 1 ? dias : null;
}

// 218.75 -> "S/ 218.75"
export const formatoSoles = (monto) => `S/ ${Number(monto ?? 0).toFixed(2)}`;
