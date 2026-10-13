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

// Tipo de marcacion (CK_MarcacionTipo).
export const TIPOS_MARCACION = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SALIDA', label: 'Salida' },
  { value: 'SALIDA_PAPELETA', label: 'Salida con papeleta' },
  { value: 'RETORNO_PAPELETA', label: 'Retorno de papeleta' },
  { value: 'SALIDA_REFRIGERIO', label: 'Salida a refrigerio' },
  { value: 'RETORNO_REFRIGERIO', label: 'Retorno de refrigerio' },
];

// Estados de una solicitud con aprobacion (justificaciones, papeletas, licencias, descansos medicos...).
export const ESTADOS_SOLICITUD = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADO', label: 'Aprobada' },
  { value: 'RECHAZADO', label: 'Rechazada' },
  { value: 'ANULADO', label: 'Anulada' },
];

// Estado editable de una carga de asistencia manual (ANULADO se alcanza eliminando la carga).
export const ESTADOS_CARGA = [
  { value: 'REGISTRADO', label: 'Registrado' },
  { value: 'PROCESADO', label: 'Procesado' },
  { value: 'OBSERVADO', label: 'Observado' },
];

// Resultado de una constatacion domiciliaria (ANULADO se alcanza eliminando el registro).
export const ESTADOS_CONSTATACION = [
  { value: 'PENDIENTE', label: 'Pendiente de visita' },
  { value: 'CONFORME', label: 'Conforme' },
  { value: 'NO_CONFORME', label: 'No conforme' },
];

// Estados editables de una carga de programacion (ANULADO se alcanza eliminando la carga).
export const ESTADOS_CARGA_PROGRAMACION = [
  { value: 'REGISTRADO', label: 'Registrado' },
  { value: 'OBSERVADO', label: 'Observado' },
  { value: 'CONFORME', label: 'Conforme' },
];

// Ciclo de vida de la programacion de un periodo.
export const ESTADOS_PROGRAMACION = [
  { value: 'BORRADOR', label: 'Borrador' },
  { value: 'PUBLICADA', label: 'Publicada' },
  { value: 'CERRADA', label: 'Cerrada' },
  { value: 'ANULADA', label: 'Anulada' },
];

// Estados de un consolidado de asistencia (CERRADO lo pone el cierre del periodo).
export const ESTADOS_CONSOLIDADO = [
  { value: 'GENERADO', label: 'Generado' },
  { value: 'OBSERVADO', label: 'Observado' },
  { value: 'CONFORME', label: 'Conforme' },
  { value: 'CERRADO', label: 'Cerrado' },
];

// Estados de una compensacion horaria.
export const ESTADOS_COMPENSACION = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'APROBADO', label: 'Aprobada' },
  { value: 'CONSUMIDO', label: 'Consumida' },
  { value: 'VENCIDO', label: 'Vencida' },
  { value: 'ANULADO', label: 'Anulada' },
];

// Estados del periodo vacacional (ANULADO se alcanza eliminando el registro).
export const ESTADOS_PERIODO_VACACIONAL = [
  { value: 'ABIERTO', label: 'Abierto' },
  { value: 'CERRADO', label: 'Cerrado' },
  { value: 'ANULADO', label: 'Anulado' },
];

// Etapas del procedimiento administrativo disciplinario (ANULADO se alcanza eliminando el expediente).
export const ESTADOS_PAD = [
  { value: 'INICIADO', label: 'Iniciado' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'RESUELTO', label: 'Resuelto' },
  { value: 'ARCHIVADO', label: 'Archivado' },
  { value: 'ANULADO', label: 'Anulado' },
];

// Siguiente etapa permitida desde cada una (el procedimiento avanza, no retrocede).
export const SIGUIENTES_PAD = {
  INICIADO: ['INICIADO', 'EN_PROCESO', 'ARCHIVADO'],
  EN_PROCESO: ['EN_PROCESO', 'RESUELTO', 'ARCHIVADO'],
};

// Resultado de una supervision inopinada (ANULADO se alcanza eliminando el registro).
export const ESTADOS_SUPERVISION = [
  { value: 'REGISTRADO', label: 'Registrada' },
  { value: 'CONFORME', label: 'Conforme' },
  { value: 'OBSERVADO', label: 'Observada' },
  { value: 'ANULADO', label: 'Anulada' },
];

// Estados de un turno programado (REPROGRAMADO lo pone un cambio de turno aprobado; CUMPLIDO, "Marcar cumplido").
export const ESTADOS_TURNO_PROGRAMADO = [
  { value: 'PROGRAMADO', label: 'Programado' },
  { value: 'REPROGRAMADO', label: 'Reprogramado' },
  { value: 'CUMPLIDO', label: 'Cumplido' },
  { value: 'ANULADO', label: 'Anulado' },
];

// Ciclo de vida de una liquidacion de descuentos (RIT, Art. 25).
export const ESTADOS_LIQUIDACION = [
  { value: 'GENERADO', label: 'Generada' },
  { value: 'APROBADO', label: 'Aprobada' },
  { value: 'REMITIDO', label: 'Remitida a planilla' },
  { value: 'ANULADO', label: 'Anulada' },
];

// Estados de una programacion del Rol de Vacaciones.
export const ESTADOS_ROL_VACACIONAL = [
  { value: 'PROGRAMADO', label: 'Programado' },
  { value: 'GOZADO', label: 'Gozado' },
  { value: 'REPROGRAMADO', label: 'Reprogramado' },
  { value: 'ANULADO', label: 'Anulado' },
];

// Si el valor guardado ya no esta en la lista (dato historico), se agrega para que el formulario no lo muestre vacio.
export const conValorActual = (opciones, valor) =>
  valor && !opciones.some((opcion) => String(opcion.value) === String(valor)) ? [...opciones, { value: valor, label: String(valor) }] : opciones;

const aOpciones = (valores) => valores.map((value) => ({ value, label: value }));

// Modulos del catalogo de permisos (primer segmento del codigo: ASISTENCIA_VER -> ASISTENCIA).
export const MODULOS_DE_PERMISO = [
  ['ASISTENCIA', 'Asistencia'],
  ['PERSONAL', 'Personal'],
  ['ORGANIZACION', 'Organización'],
  ['PROGRAMACION', 'Programación'],
  ['SOLICITUDES', 'Solicitudes'],
  ['VACACIONES', 'Vacaciones'],
  ['COMPENSACIONES', 'Compensaciones'],
  ['CONSOLIDACION', 'Consolidación'],
  ['DISCIPLINA', 'Disciplina'],
  ['BIOMETRIA', 'Biometría'],
  ['CONFIGURACION', 'Configuración'],
  ['SEGURIDAD', 'Seguridad'],
  ['SOPORTE', 'Soporte'],
  ['REPORTES', 'Reportes'],
  ['SISTEMA', 'Sistema'],
].map(([value, label]) => ({ value, label }));

// Tipos de dispositivo de marcacion (texto libre en BD; estos son los que usa el sistema).
export const TIPOS_DISPOSITIVO = aOpciones(['Huella dactilar', 'Facial', 'Tarjeta de proximidad', 'Aplicativo móvil', 'Manual']);

// Tipos de notificacion que genera el sistema; GENERAL es la que se redacta a mano.
export const TIPOS_NOTIFICACION = [
  { value: 'GENERAL', label: 'General' },
  { value: 'ALERTA_FALTAS_REITERADAS', label: 'Alerta de faltas reiteradas' },
  { value: 'CARGA_OBSERVADA', label: 'Carga observada' },
  { value: 'JUSTIFICACION_APROBADA', label: 'Justificación aprobada' },
  { value: 'JUSTIFICACION_RECHAZADA', label: 'Justificación rechazada' },
];

// Sanciones de la Ley 30057 (RIT, Art. 101); la amonestacion verbal no pasa por el PAD.
export const SANCIONES_PAD = aOpciones([
  'Amonestación escrita',
  'Suspensión sin goce de remuneraciones por 5 días',
  'Suspensión sin goce de remuneraciones por 10 días',
  'Suspensión sin goce de remuneraciones por 15 días',
  'Suspensión sin goce de remuneraciones por 30 días',
  'Suspensión sin goce de remuneraciones por 60 días',
  'Destitución',
]);

export const TIPOS_MIME = [
  { value: 'application/pdf', label: 'PDF (application/pdf)' },
  { value: 'image/jpeg', label: 'Imagen JPEG (image/jpeg)' },
  { value: 'image/png', label: 'Imagen PNG (image/png)' },
  { value: 'application/msword', label: 'Word (application/msword)' },
  { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word (.docx)' },
  { value: 'application/vnd.ms-excel', label: 'Excel (application/vnd.ms-excel)' },
  { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel (.xlsx)' },
];

export const EXTENSIONES_DOCUMENTO = aOpciones(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']);

// Parametros del sistema cuyo valor es una eleccion y no un texto libre (codigo -> opciones).
const SI_NO = [
  { value: '1', label: 'Sí' },
  { value: '0', label: 'No' },
];
export const PARAMETROS_CON_OPCIONES = {
  REFRIGERIO_DESCUENTA_JORNADA: SI_NO,
  MODO_IMPORTACION_LEGADO: SI_NO,
  ZONA_HORARIA: aOpciones(['America/Lima', 'America/Bogota', 'America/Guayaquil', 'America/Santiago']),
  FORMATO_FECHA: aOpciones(['dd/MM/yyyy', 'yyyy-MM-dd', 'MM/dd/yyyy']),
};
