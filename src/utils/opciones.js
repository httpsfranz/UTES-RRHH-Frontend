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

// Categorias de establecimientos de salud (NTS de categorias del MINSA). Espeja EstablecimientoSaludRequest::CATEGORIAS.
export const CATEGORIAS_EESS = ['I-1', 'I-2', 'I-3', 'I-4', 'II-1', 'II-2', 'II-E', 'III-1', 'III-2', 'III-E'].map((value) => ({
  value,
  label: value,
}));

// Tipo de tramo de la escala de tolerancia (CK_TramoToleranciaTipo).
export const TIPOS_TRAMO = [
  { value: 'TARDANZA', label: 'Tardanza al ingreso' },
  { value: 'SALIDA_ANTICIPADA', label: 'Salida anticipada' },
];

// Sexo del trabajador (CK_TrabajadorSexo).
export const SEXOS = [
  { value: 'F', label: 'Femenino' },
  { value: 'M', label: 'Masculino' },
];

// Tipo de plantilla biometrica (CK_PlantillaBiometricaTipo).
export const TIPOS_PLANTILLA = [
  { value: 'ROSTRO', label: 'Rostro (reconocimiento facial)' },
  { value: 'HUELLA', label: 'Huella dactilar' },
];

// Dedos de la huella (PlantillaBiometricaRequest::DEDOS).
export const DEDOS = [
  ['PULGAR', 'Pulgar'],
  ['INDICE', 'Índice'],
  ['MEDIO', 'Medio'],
  ['ANULAR', 'Anular'],
  ['MENIQUE', 'Meñique'],
].flatMap(([clave, nombre]) => [
  { value: `${clave}_DERECHO`, label: `${nombre} derecho` },
  { value: `${clave}_IZQUIERDO`, label: `${nombre} izquierdo` },
]);

// Tipo de ocurrencia del cuaderno de porteria (RIT Art. 21; OcurrenciaPorteriaRequest::TIPOS).
export const TIPOS_OCURRENCIA = [
  { value: 'SALIDA_CON_PAPELETA', label: 'Salida con papeleta' },
  { value: 'RETORNO_DE_PAPELETA', label: 'Retorno de papeleta' },
  { value: 'EXCESO_DE_PAPELETA', label: 'Exceso de papeleta' },
  { value: 'SALIDA_SIN_AUTORIZACION', label: 'Salida sin autorización' },
  { value: 'INGRESO_FUERA_DE_HORARIO', label: 'Ingreso fuera de horario' },
  { value: 'OTRO', label: 'Otro' },
];

export const ESTADOS_OCURRENCIA = [
  { value: 'REGISTRADO', label: 'Registrado' },
  { value: 'ATENDIDO', label: 'Atendido' },
  { value: 'ANULADO', label: 'Anulado' },
];

// Dias de la semana ISO-8601 (HorarioDetalleDia: 1 = lunes ... 7 = domingo).
export const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((label, indice) => ({
  value: indice + 1,
  label,
  corto: label.slice(0, 3),
}));

// Decision registrada en un consentimiento biometrico. Viaja como "1"/"0": el backend exige indicarla de forma explicita.
export const DECISIONES_CONSENTIMIENTO = [
  { value: '1', label: 'Acepta el tratamiento de sus datos biométricos' },
  { value: '0', label: 'Revoca su consentimiento' },
];
