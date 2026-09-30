// Listas fijas que espejan restricciones CHECK de SQL Server (V001__esquema_base.sql).
// Formulario y validacion de usuario las comparten; el backend las valida con Rule::in.

export const TIPOS_DIA_NO_LABORABLE = [
  { value: 'FERIADO', label: 'Feriado' },
  { value: 'DIA_NO_LABORABLE', label: 'Día no laborable' },
  { value: 'ASUETO', label: 'Asueto' },
  { value: 'DUELO', label: 'Duelo' },
];

export const GRAVEDADES = [
  { value: 'LEVE', label: 'Leve' },
  { value: 'GRAVE', label: 'Grave' },
  { value: 'MUY_GRAVE', label: 'Muy grave' },
];

export const ESTADOS_PERIODO = [
  { value: 'ABIERTO', label: 'Abierto' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'CERRADO', label: 'Cerrado' },
];

export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
].map((label, indice) => ({ value: String(indice + 1), label }));

export const valoresDe = (opciones) => opciones.map((opcion) => opcion.value);

export const etiquetaDe = (opciones, valor) =>
  opciones.find((opcion) => String(opcion.value) === String(valor))?.label ?? valor;
