import { menu } from './menu';

// Que permiso hace falta para ver cada entrada del menu. Es el espejo de App\Support\PermisosDeRuta del backend (que es
// quien realmente protege los datos): aqui solo se decide que se muestra y a que pantallas se puede entrar.
const PERMISO_DE_GRUPO = {
  Organización: 'ORGANIZACION_VER',
  Personal: 'PERSONAL_VER',
  Asistencia: 'ASISTENCIA_VER',
  Biometría: 'CONFIGURACION_VER',
  Compensaciones: 'REPORTES_VER',
  Configuración: 'CONFIGURACION_VER',
  Programación: 'PROGRAMACION_VER',
  Solicitudes: 'SOLICITUDES_VER',
  Vacaciones: 'SOLICITUDES_VER',
  Disciplina: 'REPORTES_VER',
  Consolidación: 'REPORTES_VER',
  Seguridad: 'SEGURIDAD_VER',
};

// Excepciones por pantalla. null = basta con haber iniciado sesion.
const PERMISO_DE_ITEM = {
  '/seguridad/auditoria': 'SEGURIDAD_AUDITORIA',
  '/soporte/logs-integracion': 'SEGURIDAD_AUDITORIA',
  '/soporte/documentos-sustento': 'SOLICITUDES_VER',
  '/soporte/calendario-no-laborable': null,
  '/soporte/notificaciones': null,
  '/configuracion/parametros-sistema': 'CONFIGURACION_VER',
};

// Quien solo es TRABAJADOR consulta unicamente lo suyo: estas son las pantallas que le corresponden.
const PANTALLAS_PROPIAS = new Set([
  '/asistencia/marcaciones',
  '/asistencia/asistencia-diaria',
  '/asistencia/ajustes',
  '/asistencia/justificacion-faltas',
  '/solicitudes/papeletas',
  '/solicitudes/licencias',
  '/solicitudes/descansos-medicos',
  '/solicitudes/constatacion-domiciliaria',
  '/vacaciones/periodos',
  '/vacaciones/rol',
  '/vacaciones/goce',
  '/soporte/notificaciones',
]);

const grupoDe = (path) => menu.find((g) => g.children.some((c) => c.path === path));

/** Permiso que exige una pantalla (por su ruta). null = solo sesion. undefined = ruta desconocida. */
export function permisoDePantalla(path) {
  if (path in PERMISO_DE_ITEM) return PERMISO_DE_ITEM[path];
  const grupo = grupoDe(path);
  if (!grupo) return undefined;
  return PERMISO_DE_GRUPO[grupo.label] ?? null;
}

/** ¿Puede esta sesion abrir la pantalla `path`? */
export function puedeAbrir(auth, path) {
  const permiso = permisoDePantalla(path);
  if (permiso === undefined) return false;
  if (auth.alcance?.propio && !PANTALLAS_PROPIAS.has(path)) return false;
  return permiso === null || auth.tiene(permiso);
}

/** El menu solo con lo que esta sesion puede abrir; los grupos que quedan vacios desaparecen. */
export function menuPara(auth) {
  return menu
    .map((grupo) => ({ ...grupo, children: grupo.children.filter((item) => puedeAbrir(auth, item.path)) }))
    .filter((grupo) => grupo.children.length > 0);
}
