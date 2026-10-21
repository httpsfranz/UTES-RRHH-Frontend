// Que permiso exige cada llamada a la API. Es el espejo de App\Support\PermisosDeRuta del backend (que es quien de verdad
// protege los datos): aqui solo sirve para no mostrar botones que terminarian en "No tienes permiso".
//   consultar (GET) -> {MODULO}_VER · crear/editar/anular -> {MODULO}_EDITAR · acciones de flujo -> permiso propio.

const MODULOS = {
  ORGANIZACION: ['microredes', 'establecimientos', 'tipos-establecimiento', 'responsables-eess', 'tipos-responsabilidad'],
  PERSONAL: ['trabajadores', 'vinculos-laborales', 'asignaciones-horario', 'cargos', 'grupos-ocupacionales', 'profesiones', 'colegiaturas', 'tipos-colegiatura', 'condiciones-laborales', 'regimenes-laborales', 'tipos-documento-identidad', 'consulta-dni'],
  ASISTENCIA: ['marcaciones', 'asistencia-diaria', 'ajustes-marcacion', 'cargas-asistencia-manual', 'justificaciones-falta', 'conceptos-justificacion', 'estados-asistencia'],
  PROGRAMACION: ['programaciones-periodo', 'programaciones-trabajador', 'turnos-programados', 'cambios-turno', 'tipos-cambio-turno', 'tipos-periodo-programacion', 'cargas-programacion', 'informes-guardia-comunitaria', 'programacion-calendario', 'programacion-mensual'],
  SOLICITUDES: ['papeletas', 'tipos-papeleta', 'motivos-papeleta', 'licencias', 'tipos-licencia', 'descansos-medicos', 'constataciones-domiciliarias', 'ocurrencias-porteria', 'goces-vacacionales', 'periodos-vacacionales', 'roles-vacacionales', 'documentos-sustento'],
  CONFIGURACION: ['turnos', 'horarios', 'horarios-detalle', 'tipos-jornada', 'parametros-jornada', 'tablas-tolerancia', 'tramos-tolerancia', 'calendario-no-laborable', 'dispositivos-marcacion', 'metodos-marcacion', 'plantillas-biometricas', 'autorizaciones-metodo', 'consentimientos-biometricos'],
  REPORTES: ['periodos-asistencia', 'cierre-mes', 'consolidados-asistencia', 'detalles-consolidado', 'liquidaciones-descuento', 'detalles-liquidacion', 'compensaciones-horarias', 'tipos-compensacion', 'conceptos-descuento', 'expedientes-pad', 'supervisiones-inopinadas', 'tipos-falta-disciplinaria'],
  SEGURIDAD: ['usuarios', 'usuarios-roles', 'usuarios-ambitos', 'roles', 'roles-permisos', 'permisos', 'sesiones-acceso', 'tipos-notificacion'],
};

const ACCIONES = {
  aprobar: { 'ajustes-marcacion': 'ASISTENCIA_APROBAR', 'justificaciones-falta': 'ASISTENCIA_APROBAR', 'liquidaciones-descuento': 'REPORTES_EDITAR', 'consolidados-asistencia': 'ASISTENCIA_APROBAR', '*': 'SOLICITUDES_APROBAR' },
  rechazar: { 'ajustes-marcacion': 'ASISTENCIA_APROBAR', 'justificaciones-falta': 'ASISTENCIA_APROBAR', '*': 'SOLICITUDES_APROBAR' },
  observar: { '*': 'ASISTENCIA_APROBAR' },
  revocar: { '*': 'SEGURIDAD_EDITAR' },
  bloquear: { '*': 'SEGURIDAD_EDITAR' },
  desbloquear: { '*': 'SEGURIDAD_EDITAR' },
  'iniciar-pad': { '*': 'REPORTES_EDITAR' },
  publicar: { '*': 'PROGRAMACION_APROBAR' },
  cerrar: { '*': 'PROGRAMACION_APROBAR' },
  cumplir: { '*': 'PROGRAMACION_EDITAR' },
  remitir: { '*': 'REPORTES_EDITAR' },
  devolver: { '*': 'REPORTES_EDITAR' },
  reprogramar: { '*': 'SOLICITUDES_EDITAR' },
  generar: { '*': 'REPORTES_EDITAR' },
  calcular: { '*': 'ASISTENCIA_EDITAR' },
  marcar: { '*': 'ASISTENCIA_MARCAR' },
  conformidad: { '*': 'ASISTENCIA_APROBAR' },
  liquidaciones: { '*': 'REPORTES_EDITAR' },
};

const ESPECIALES = { auditoria: 'SEGURIDAD_AUDITORIA', 'logs-integracion': 'SEGURIDAD_AUDITORIA', 'parametros-sistema': 'SISTEMA_PARAMETROS' };

/**
 * Permiso que exige escribir en `ruta` ('/papeletas', '/papeletas/5/aprobar'). null = basta la sesion; undefined = ruta
 * desconocida (se deja pasar: decide el backend).
 */
export function permisoDeEscritura(ruta) {
  const segmentos = ruta.replace(/^\/+/, '').split('/').filter(Boolean);
  const recurso = segmentos[0] ?? '';
  if (recurso === 'notificaciones') return null;
  if (ESPECIALES[recurso]) return ESPECIALES[recurso];
  const accion = segmentos.at(-1);
  if (segmentos.length > 1 && ACCIONES[accion]) return ACCIONES[accion][recurso] ?? ACCIONES[accion]['*'];
  if (recurso === 'roles' && segmentos[2] === 'permisos') return 'SEGURIDAD_EDITAR';
  const modulo = Object.keys(MODULOS).find((m) => MODULOS[m].includes(recurso));
  return modulo ? `${modulo}_EDITAR` : undefined;
}

/** ¿Puede esta sesion escribir en `ruta`? Un usuario que solo consulta lo propio (TRABAJADOR) no registra nada. */
export function puedeEscribir(auth, ruta) {
  const permiso = permisoDeEscritura(ruta);
  if (permiso === null) return true;
  if (auth.alcance?.propio) return false;
  return permiso === undefined || auth.tiene(permiso);
}

/** ¿Puede ejecutar la accion de flujo `accion` (aprobar, publicar...) sobre los registros de `endpoint`? */
export const puedeAccion = (auth, endpoint, accion) => puedeEscribir(auth, `${endpoint}/0/${accion}`);
