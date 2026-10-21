import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RequierePermiso from './components/auth/RequierePermiso';
import RequiereSesion from './components/auth/RequiereSesion';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

import { menu } from './nav/menu';

// =========================================================
// PÁGINAS REALES (una por entrada del menu; lo demas se abre como pestana o tarjeta dentro de ellas)
// =========================================================

const paginasReales = {
  // DÍA A DÍA
  '/asistencia/asistencia-diaria': lazy(() => import('./pages/asistencia/AsistenciaDiariaPage')),
  '/solicitudes/bandeja': lazy(() => import('./pages/solicitudes/BandejaDeSolicitudesPage')),
  '/solicitudes/registro': lazy(() => import('./pages/solicitudes/RegistroDeSolicitudesPage')),
  '/solicitudes/ocurrencias-porteria': lazy(() => import('./pages/solicitudes/OcurrenciaPorteriaPage')),

  // PROGRAMACIÓN
  '/programacion/mensual': lazy(() => import('./pages/programacion/ProgramacionMensualPage')),
  '/programacion/gestion': lazy(() => import('./pages/programacion/CambiosYAusenciasPage')),

  // PERSONAL
  '/personal/trabajadores': lazy(() => import('./pages/personal/TrabajadorPage')),
  '/vacaciones/gestion': lazy(() => import('./pages/vacaciones/VacacionesPage')),

  // FIN DE MES
  '/consolidacion/cierre': lazy(() => import('./pages/consolidacion/CierreDelMesPage')),
  '/consolidacion/gestion': lazy(() => import('./pages/consolidacion/ConsolidadoYDescuentosPage')),
  '/disciplina/gestion': lazy(() => import('./pages/disciplina/DisciplinaPage')),

  // ADMINISTRACIÓN
  '/organizacion/red': lazy(() => import('./pages/organizacion/OrganizacionPage')),
  '/configuracion/panel': lazy(() => import('./pages/configuracion/CatalogosPage')),
  '/seguridad/panel': lazy(() => import('./pages/seguridad/SeguridadPage')),
  '/soporte/notificaciones': lazy(() => import('./pages/soporte/NotificacionesPage')),
};

// =========================================================
// RUTAS DE LOS MÓDULOS
// =========================================================

const moduleRoutes = menu.flatMap((group) =>
  group.children.map((item) => {
    const PaginaReal = paginasReales[item.path];

    return {
      path: item.path.replace(/^\/+/, ''),
      element: (
        <RequierePermiso path={item.path}>{PaginaReal ? <PaginaReal /> : <PlaceholderPage title={item.label} />}</RequierePermiso>
      ),
    };
  })
);

// Rutas de pantallas que ahora son una pestana o una tarjeta de otra: siguen funcionando (enlaces de notificaciones
// guardadas, marcadores) y abren directamente esa pestana o tarjeta.
const RUTAS_ANTERIORES = {
  '/asistencia/justificacion-faltas': '/solicitudes/registro?pestana=justificaciones',
  '/asistencia/ajustes': '/solicitudes/registro?pestana=ajustes',
  '/solicitudes/papeletas': '/solicitudes/registro?pestana=papeletas',
  '/solicitudes/licencias': '/solicitudes/registro?pestana=licencias',
  '/solicitudes/descansos-medicos': '/solicitudes/registro?pestana=descansos',
  '/solicitudes/constatacion-domiciliaria': '/solicitudes/registro?pestana=constataciones',
  '/programacion/periodos': '/programacion/gestion?pestana=programaciones',
  '/programacion/cambios-turno': '/programacion/gestion?pestana=cambios',
  '/programacion/calendario-ausencias': '/programacion/gestion?pestana=ausencias',
  '/programacion/guardia-comunitaria': '/programacion/gestion?pestana=guardias',
  '/programacion/trabajadores': '/programacion/mensual',
  '/programacion/turnos-programados': '/programacion/mensual',
  '/programacion/calendario': '/programacion/mensual',
  '/personal/vinculos-laborales': '/personal/trabajadores',
  '/personal/asignacion-horario': '/personal/trabajadores',
  '/consolidacion/consolidado': '/consolidacion/gestion?pestana=consolidado',
  '/consolidacion/periodos-asistencia': '/consolidacion/gestion?pestana=periodos',
  '/compensaciones/liquidaciones': '/consolidacion/gestion?pestana=liquidaciones',
  '/compensaciones/compensacion-horaria': '/consolidacion/gestion?pestana=compensaciones',
  '/disciplina/expedientes-pad': '/disciplina/gestion?pestana=pad',
  '/disciplina/supervisiones': '/disciplina/gestion?pestana=supervisiones',
  '/organizacion/establecimientos': '/organizacion/red',
  '/organizacion/microredes': '/organizacion/red',
  '/organizacion/responsables': '/organizacion/red',
  '/configuracion/catalogos': '/configuracion/panel',
  '/configuracion/turnos-horarios': '/configuracion/panel?abrir=turnos',
  '/configuracion/parametros': '/configuracion/panel?abrir=parametros',
  '/biometria/administracion': '/configuracion/panel?abrir=biometria',
  '/soporte/calendario-no-laborable': '/configuracion/panel?abrir=calendario',
  '/soporte/documentos-sustento': '/configuracion/panel?abrir=documentos',
  '/soporte/logs-integracion': '/configuracion/panel?abrir=logs',
  '/seguridad/usuarios': '/seguridad/panel?abrir=usuarios',
  '/seguridad/roles': '/seguridad/panel?abrir=roles',
  '/seguridad/usuarios-roles': '/seguridad/panel?abrir=roles-de-usuario',
  '/seguridad/usuarios-ambitos': '/seguridad/panel?abrir=ambitos',
  '/seguridad/sesiones': '/seguridad/panel?abrir=sesiones',
  '/seguridad/auditoria': '/seguridad/panel?abrir=auditoria',
};
const redirecciones = Object.entries(RUTAS_ANTERIORES).map(([desde, hacia]) => ({ path: desde.slice(1), element: <Navigate to={hacia} replace /> }));

// =========================================================
// ROUTER PRINCIPAL
// =========================================================

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequiereSesion />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          ...moduleRoutes,
          ...redirecciones,
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
