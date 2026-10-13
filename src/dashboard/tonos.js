// Tonos que usa el backend en los widgets (en espanol) -> clases Tailwind y colores. Las clases van completas para que
// Tailwind las detecte.
export const TONOS = {
  verde: { bg: 'bg-emerald-500', fill: 'fill-emerald-500', stroke: 'stroke-emerald-500', texto: 'text-emerald-600', hex: '#10b981' },
  ambar: { bg: 'bg-amber-400', fill: 'fill-amber-400', stroke: 'stroke-amber-400', texto: 'text-amber-600', hex: '#fbbf24' },
  rojo: { bg: 'bg-rose-500', fill: 'fill-rose-500', stroke: 'stroke-rose-500', texto: 'text-rose-600', hex: '#f43f5e' },
  azul: { bg: 'bg-blue-500', fill: 'fill-blue-500', stroke: 'stroke-blue-500', texto: 'text-blue-600', hex: '#3b82f6' },
  indigo: { bg: 'bg-indigo-500', fill: 'fill-indigo-500', stroke: 'stroke-indigo-500', texto: 'text-indigo-600', hex: '#6366f1' },
  turquesa: { bg: 'bg-teal-500', fill: 'fill-teal-500', stroke: 'stroke-teal-500', texto: 'text-teal-600', hex: '#14b8a6' },
  naranja: { bg: 'bg-orange-500', fill: 'fill-orange-500', stroke: 'stroke-orange-500', texto: 'text-orange-600', hex: '#f97316' },
  gris: { bg: 'bg-slate-400', fill: 'fill-slate-400', stroke: 'stroke-slate-400', texto: 'text-slate-600', hex: '#94a3b8' },
};

export const tonoDe = (nombre) => TONOS[nombre] ?? TONOS.gris;

// Tono del backend -> TONES de nav/moduleIcons (cajita del icono de los indicadores).
export const TONES_DE_ICONO = { verde: 'green', ambar: 'amber', rojo: 'red', azul: 'blue', indigo: 'indigo', turquesa: 'teal', naranja: 'orange', gris: 'slate' };
