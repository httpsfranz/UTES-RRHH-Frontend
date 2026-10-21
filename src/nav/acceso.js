import { menu } from './menu';

// Que permiso hace falta para ver cada pantalla del menu. Es el espejo de App\Support\PermisosDeRuta del backend (que es
// quien realmente protege los datos): aqui solo se decide que se muestra y a que pantallas se puede entrar.
//   null = basta con haber iniciado sesion · lista = basta con uno de esos permisos.
// Dentro de una pantalla con pestanas o tarjetas, cada una pide ademas el suyo (PantallaConPestanas, CatalogosPage).
const PERMISO_DE_PANTALLA = {
  '/asistencia/asistencia-diaria': 'ASISTENCIA_VER',
  // La bandeja reune lo que cada sesion puede ver (el backend filtra por permiso y alcance).
  '/solicitudes/bandeja': null,
  '/solicitudes/registro': ['SOLICITUDES_VER', 'ASISTENCIA_VER'],
  '/solicitudes/ocurrencias-porteria': 'SOLICITUDES_VER',
  '/programacion/mensual': 'PROGRAMACION_VER',
  '/programacion/gestion': 'PROGRAMACION_VER',
  '/personal/trabajadores': 'PERSONAL_VER',
  '/vacaciones/gestion': 'SOLICITUDES_VER',
  '/consolidacion/cierre': 'REPORTES_VER',
  '/consolidacion/gestion': 'REPORTES_VER',
  '/disciplina/gestion': 'REPORTES_VER',
  '/organizacion/red': 'ORGANIZACION_VER',
  '/configuracion/panel': ['CONFIGURACION_VER', 'SEGURIDAD_VER'],
  '/seguridad/panel': 'SEGURIDAD_VER',
  '/soporte/notificaciones': null,
};

// Permiso de cada area de Configuracion (grupos de tarjetas). Un area sin entrada solo exige sesion.
const PERMISO_DE_AREA = {
  Organización: 'ORGANIZACION_VER',
  Personal: 'PERSONAL_VER',
  Asistencia: 'ASISTENCIA_VER',
  Biometría: 'CONFIGURACION_VER',
  Compensaciones: 'REPORTES_VER',
  Configuración: 'CONFIGURACION_VER',
  Programación: 'PROGRAMACION_VER',
  Solicitudes: 'SOLICITUDES_VER',
  Disciplina: 'REPORTES_VER',
};

// Quien solo es TRABAJADOR consulta unicamente lo suyo: estas son las pantallas que le corresponden.
const PANTALLAS_PROPIAS = new Set(['/asistencia/asistencia-diaria', '/solicitudes/bandeja', '/vacaciones/gestion', '/soporte/notificaciones']);

const conPermiso = (auth, permiso) => permiso === null || [permiso].flat().some((p) => auth.tiene(p));

/** Permiso que exige una pantalla (por su ruta). null = solo sesion. undefined = ruta desconocida. */
export function permisoDePantalla(path) {
  return path in PERMISO_DE_PANTALLA ? PERMISO_DE_PANTALLA[path] : undefined;
}

/** ¿Puede esta sesion abrir la pantalla `path`? */
export function puedeAbrir(auth, path) {
  const permiso = permisoDePantalla(path);
  if (permiso === undefined) return false;
  if (auth.alcance?.propio && !PANTALLAS_PROPIAS.has(path)) return false;
  return conPermiso(auth, permiso);
}

/** El menu solo con lo que esta sesion puede abrir (sin las entradas ocultas); los grupos que quedan vacios desaparecen. */
export function menuPara(auth) {
  return menu
    .map((grupo) => ({
      ...grupo,
      children: grupo.children
        .filter((item) => !item.oculto && puedeAbrir(auth, item.path))
        // Para el trabajador, la bandeja es el estado de sus propias solicitudes.
        .map((item) => (auth.alcance?.propio && item.path === '/solicitudes/bandeja' ? { ...item, label: 'Mis solicitudes' } : item)),
    }))
    .filter((grupo) => grupo.children.length > 0);
}

/** ¿Puede esta sesion ver (y administrar segun sus permisos) lo de un area? Lo usan las tarjetas de Configuracion. */
export function puedeVerArea(auth, area) {
  if (auth.alcance?.propio) return false;
  return conPermiso(auth, PERMISO_DE_AREA[area] ?? null);
}
