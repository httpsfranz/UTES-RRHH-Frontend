// Un color por turno (en el orden en que llegan, por hora de entrada) para leer la grilla de un vistazo.
const COLORES = [
  'bg-slate-200 text-slate-800',
  'bg-sky-100 text-sky-800',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-violet-100 text-violet-800',
  'bg-rose-100 text-rose-800',
  'bg-indigo-100 text-indigo-800',
];

export const colorDeTurno = (turnos, id) => COLORES[Math.max(0, turnos.findIndex((t) => t.id === id)) % COLORES.length];
