// Opciones estandarizadas de los campos de detalle (motivos, observaciones, resultados). El formulario muestra una lista
// y, como ultima opcion, "Otro": solo entonces se escribe el texto a mano. Lo que se guarda es el texto elegido (la
// columna sigue siendo de texto libre), asi los registros usan siempre la misma redaccion y se pueden agrupar.
//
// Las descripciones de los catalogos (que es un cargo, un tipo de licencia...) NO usan esto: definen el registro.

export const OTRO = 'Otro';

export const TEXTOS = {
  // Desactivar un registro (modal unico de baja). Se agregan las opciones propias de cada recurso (MOTIVOS_DE_BAJA).
  baja: ['Registrado por error', 'Registro duplicado', 'Ya no se usa', 'Reemplazado por otro registro', 'Dispuesto por la jefatura o RRHH (documento)'],

  rechazo: [
    'Falta el documento de sustento',
    'El documento de sustento no corresponde',
    'Presentado fuera del plazo del RIT',
    'Fechas u horas incorrectas',
    'No corresponde según el RIT',
    'Necesidad del servicio',
  ],
  observacionAprobacion: ['Conforme', 'Conforme, con documento de sustento revisado', 'Aprobado por necesidad del servicio'],
  observarConsolidado: [
    'Faltas sin justificar por revisar',
    'Marcaciones incompletas (sin entrada o sin salida)',
    'Tardanzas por verificar',
    'Turnos programados sin registro de asistencia',
    'Falta registrar licencias o descansos médicos',
  ],

  ajusteMarcacion: [
    'Omisión involuntaria de marcación',
    'Falla del equipo biométrico',
    'Corte de energía o de internet',
    'Comisión de servicio fuera del establecimiento',
    'Marcó en un establecimiento distinto',
    'Error en el tipo de marca (entrada / salida)',
  ],
  observacionJustificacion: ['Sustentado con documento', 'Comunicado al jefe inmediato el mismo día', 'Con visto bueno del jefe inmediato'],
  observacionDescanso: ['CITT de EsSalud', 'Certificado médico del MINSA', 'Certificado médico particular (por validar con CITT)', 'Ampliación de un descanso anterior'],
  motivoLicencia: [
    'Por enfermedad grave de familiar directo',
    'Por fallecimiento de familiar directo',
    'Por maternidad',
    'Por paternidad',
    'Por capacitación oficializada',
    'Por citación judicial o policial',
    'Por asuntos particulares',
  ],
  motivoPapeleta: [
    'Cita médica en EsSalud o MINSA',
    'Trámite personal impostergable',
    'Comisión de servicio',
    'Capacitación oficializada',
    'Citación judicial o policial',
    'Asuntos particulares a cuenta de vacaciones',
  ],
  resultadoConstatacion: [
    'Se encontró al trabajador en su domicilio guardando reposo',
    'No se encontró al trabajador en su domicilio',
    'Domicilio no ubicado o dirección incorrecta',
    'Se encontró al trabajador, pero no guardaba reposo',
  ],
  ocurrenciaPorteria: [
    'Ingreso fuera de horario',
    'Salida durante el turno sin papeleta',
    'Personal ajeno al servicio en el establecimiento',
    'Equipo biométrico sin funcionar',
    'Retiro de bienes del establecimiento',
  ],

  motivoCambioTurno: ['Por necesidad del servicio', 'Por salud del trabajador', 'Por capacitación', 'Por asuntos personales (con reemplazo)', 'Por comisión de servicio'],
  observacionCambioTurno: ['Con conformidad del jefe del establecimiento', 'Con reemplazo confirmado', 'Pendiente de documento'],
  observacionProgramacion: ['Programación regular del mes', 'Incluye guardias comunitarias', 'Reprogramada por necesidad del servicio', 'Considera vacaciones y licencias del mes'],
  observacionTurno: ['Guardia comunitaria', 'Reemplazo de otro trabajador', 'Turno reprogramado', 'Campaña de salud'],
  informeGuardia: ['Atención de emergencias en la comunidad', 'Visitas domiciliarias', 'Campaña de vacunación', 'Seguimiento de pacientes', 'Sin ocurrencias'],
  observacionAsignacion: ['Horario regular', 'Horario por necesidad del servicio', 'Horario por lactancia materna', 'Horario por estudios (con compensación)', 'Horario temporal'],
  observacionResponsable: ['Designado por resolución directoral', 'Encargatura temporal', 'Designado por memorándum'],
  motivoCese: ['Renuncia voluntaria', 'Término de contrato', 'Destitución', 'Jubilación o cese por límite de edad', 'Fallecimiento', 'Rotación a otra unidad ejecutora', 'Mutuo disenso'],

  motivoTrabajoAdicional: [
    'Atención de emergencia',
    'Cobertura de un trabajador ausente',
    'Campaña de salud',
    'Cierre de informes o metas',
    'Capacitación fuera del horario',
  ],
  observacionLineaLiquidacion: ['Calculado según el consolidado del mes', 'Corrección del mes anterior', 'Descuento por tardanzas acumuladas', 'Descuento por faltas injustificadas'],

  descripcionPad: [
    'Inasistencias injustificadas reiteradas',
    'Tardanzas reiteradas',
    'Abandono del puesto de trabajo durante el turno',
    'Ausencia en el domicilio durante el descanso médico',
    'Incumplimiento de la programación de turnos',
  ],
  resultadoSupervision: [
    'Todo el personal programado se encontró en su puesto',
    'Personal programado ausente sin papeleta',
    'Personal fuera de su puesto de trabajo',
    'Registro de asistencia incompleto',
  ],
  observacionSupervision: ['Se comunicó al jefe del establecimiento', 'Se levantó acta', 'Se recomienda iniciar procedimiento disciplinario', 'Sin observaciones'],

  motivoBloqueo: ['Sospecha de uso indebido de la cuenta', 'El trabajador está de licencia o vacaciones', 'Por disposición de la jefatura', 'Contraseña compartida o expuesta'],
  feriado: [
    'Año Nuevo',
    'Jueves Santo',
    'Viernes Santo',
    'Día del Trabajo',
    'Día de la Bandera (Batalla de Arica)',
    'San Pedro y San Pablo',
    'Día de la Fuerza Aérea del Perú',
    'Fiestas Patrias',
    'Batalla de Junín',
    'Santa Rosa de Lima',
    'Combate de Angamos',
    'Todos los Santos',
    'Inmaculada Concepción',
    'Batalla de Ayacucho',
    'Navidad',
    'Día no laborable para el sector público',
    'Aniversario de la ciudad',
  ],
};

// Motivos de baja propios de cada recurso (endpoint de la API), ademas de los comunes.
export const MOTIVOS_DE_BAJA = {
  '/trabajadores': ['Cese del trabajador', 'Fallecimiento'],
  '/vinculos-laborales': ['Término del vínculo laboral', 'Cambio de condición laboral'],
  '/usuarios': ['Cese del trabajador', 'Cambio de funciones: ya no necesita acceso', 'Cuenta duplicada'],
  '/usuarios-roles': ['Cambio de funciones', 'Término de la encargatura'],
  '/usuarios-ambitos': ['Rotación a otro establecimiento', 'Cambio de funciones'],
  '/responsables-eess': ['Término de la designación', 'Designación de un nuevo responsable'],
  '/asignaciones-horario': ['Cambio de horario', 'Término del vínculo laboral'],
  '/establecimientos': ['Establecimiento cerrado', 'Fusionado con otro establecimiento'],
  '/microredes': ['Microred reorganizada', 'Fusionada con otra microred'],
  '/dispositivos-marcacion': ['Equipo dañado', 'Equipo dado de baja', 'Equipo trasladado'],
};

/** Opciones de baja de un recurso: las propias primero, luego las comunes (sin repetir). */
export const opcionesDeBaja = (endpoint) => [...new Set([...(MOTIVOS_DE_BAJA[endpoint] ?? []), ...TEXTOS.baja])];
