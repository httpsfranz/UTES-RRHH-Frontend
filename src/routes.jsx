/* eslint-disable react-refresh/only-export-components -- archivo de configuracion del router: declara las paginas con carga diferida y exporta el router, no un componente. */
import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RequierePermiso from './components/auth/RequierePermiso';
import RequiereSesion from './components/auth/RequiereSesion';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

// ASISTENCIA
const MarcacionPage = lazy(() => import('./pages/asistencia/MarcacionPage'));

const AsistenciaDiariaPage = lazy(() => import('./pages/asistencia/AsistenciaDiariaPage'));

const JustificacionFaltaPage = lazy(() => import('./pages/asistencia/JustificacionFaltaPage'));

const CargaAsistenciaManualPage = lazy(() => import('./pages/asistencia/CargaAsistenciaManualPage'));

const ConceptoJustificacionPage = lazy(() => import('./pages/asistencia/ConceptoJustificacionPage'));

const EstadoAsistenciaPage = lazy(() => import('./pages/asistencia/EstadoAsistenciaPage'));

const AjusteMarcacionPage = lazy(() => import('./pages/asistencia/AjusteMarcacionPage'));

// ORGANIZACIÓN
const ResponsableEessPage = lazy(() => import('./pages/organizacion/ResponsableEessPage'));

const MicroredPage = lazy(() => import('./pages/organizacion/MicroredPage'));

const EstablecimientoSaludPage = lazy(() => import('./pages/organizacion/EstablecimientoSaludPage'));

// BIOMETRÍA
const PlantillaBiometricaPage = lazy(() => import('./pages/biometria/PlantillaBiometricaPage'));

const AutorizacionMetodoPage = lazy(() => import('./pages/biometria/AutorizacionMetodoPage'));

const ConsentimientoBiometricoPage = lazy(() => import('./pages/biometria/ConsentimientoBiometricoPage'));

const MetodoMarcacionPage = lazy(() => import('./pages/biometria/MetodoMarcacionPage'));

const DispositivoMarcacionPage = lazy(() => import('./pages/biometria/DispositivoMarcacionPage'));

const TipoEstablecimientoPage = lazy(() => import('./pages/organizacion/TipoEstablecimientoPage'));

const TipoResponsabilidadPage = lazy(() => import('./pages/organizacion/TipoResponsabilidadPage'));

// COMPENSACIONES
const CompensacionHorariaPage = lazy(() => import('./pages/compensaciones/CompensacionHorariaPage'));

const ConceptoDescuentoPage = lazy(() => import('./pages/compensaciones/ConceptoDescuentoPage'));

const TipoCompensacionPage = lazy(() => import('./pages/compensaciones/TipoCompensacionPage'));

const LiquidacionDescuentoPage = lazy(() => import('./pages/compensaciones/LiquidacionDescuentoPage'));

// CONFIGURACIÓN
const ParametroSistemaPage = lazy(() => import('./pages/configuracion/ParametroSistemaPage'));

const TablaToleranciaPage = lazy(() => import('./pages/configuracion/TablaToleranciaPage'));

const TramoToleranciaPage = lazy(() => import('./pages/configuracion/TramoToleranciaPage'));

const TurnoPage = lazy(() => import('./pages/configuracion/TurnoPage'));

const HorarioPage = lazy(() => import('./pages/configuracion/HorarioPage'));

const ParametroJornadaPage = lazy(() => import('./pages/configuracion/ParametroJornadaPage'));

const TipoJornadaPage = lazy(() => import('./pages/configuracion/TipoJornadaPage'));

// CONSOLIDACIÓN
const ConsolidadoAsistenciaPage = lazy(() => import('./pages/consolidacion/ConsolidadoAsistenciaPage'));

const PeriodoAsistenciaPage = lazy(() => import('./pages/consolidacion/PeriodoAsistenciaPage'));

// VACACIONES
const PeriodoVacacionalPage = lazy(() => import('./pages/vacaciones/PeriodoVacacionalPage'));

const RolVacacionalPage = lazy(() => import('./pages/vacaciones/RolVacacionalPage'));

const GoceVacacionalPage = lazy(() => import('./pages/vacaciones/GoceVacacionalPage'));

// DISCIPLINA
const ExpedientePadPage = lazy(() => import('./pages/disciplina/ExpedientePadPage'));

const SupervisionInopinadaPage = lazy(() => import('./pages/disciplina/SupervisionInopinadaPage'));

const TipoFaltaDisciplinariaPage = lazy(() => import('./pages/disciplina/TipoFaltaDisciplinariaPage'));

// PERSONAL
const AsignacionHorarioPage = lazy(() => import('./pages/personal/AsignacionHorarioPage'));

const VinculoLaboralPage = lazy(() => import('./pages/personal/VinculoLaboralPage'));

const ColegiaturaPage = lazy(() => import('./pages/personal/ColegiaturaPage'));

const TrabajadorPage = lazy(() => import('./pages/personal/TrabajadorPage'));

const CargoPage = lazy(() => import('./pages/personal/CargoPage'));

const RegimenLaboralPage = lazy(() => import('./pages/personal/RegimenLaboralPage'));

const TipoDocumentoIdentidadPage = lazy(() => import('./pages/personal/TipoDocumentoIdentidadPage'));

const GrupoOcupacionalPage = lazy(() => import('./pages/personal/GrupoOcupacionalPage'));

const ProfesionPage = lazy(() => import('./pages/personal/ProfesionPage'));

const ColegiaturaTipoPage = lazy(() => import('./pages/personal/ColegiaturaTipoPage'));

const CondicionLaboralPage = lazy(() => import('./pages/personal/CondicionLaboralPage'));

// PROGRAMACIÓN
const ProgramacionPeriodoPage = lazy(() => import('./pages/programacion/ProgramacionPeriodoPage'));

const CargaProgramacionPage = lazy(() => import('./pages/programacion/CargaProgramacionPage'));

const InformeGuardiaComunitariaPage = lazy(() => import('./pages/programacion/InformeGuardiaComunitariaPage'));

const TipoCambioTurnoPage = lazy(() => import('./pages/programacion/TipoCambioTurnoPage'));

const TipoPeriodoProgramacionPage = lazy(() => import('./pages/programacion/TipoPeriodoProgramacionPage'));

const ProgramacionTrabajadorPage = lazy(() => import('./pages/programacion/ProgramacionTrabajadorPage'));

const TurnoProgramadoPage = lazy(() => import('./pages/programacion/TurnoProgramadoPage'));
const CalendarioProgramacionPage = lazy(() => import('./pages/programacion/CalendarioProgramacionPage'));
const CalendarioAusenciasPage = lazy(() => import('./pages/programacion/CalendarioAusenciasPage'));

const CambioTurnoPage = lazy(() => import('./pages/programacion/CambioTurnoPage'));

// SEGURIDAD
const AuditoriaPage = lazy(() => import('./pages/seguridad/AuditoriaPage'));

const PermisoPage = lazy(() => import('./pages/seguridad/PermisoPage'));

const RolPage = lazy(() => import('./pages/seguridad/RolPage'));

const UsuarioPage = lazy(() => import('./pages/seguridad/UsuarioPage'));

const UsuarioRolPage = lazy(() => import('./pages/seguridad/UsuarioRolPage'));

const UsuarioAmbitoPage = lazy(() => import('./pages/seguridad/UsuarioAmbitoPage'));

const SesionAccesoPage = lazy(() => import('./pages/seguridad/SesionAccesoPage'));

// SOLICITUDES
const PapeletaPage = lazy(() => import('./pages/solicitudes/PapeletaPage'));

const LicenciaPage = lazy(() => import('./pages/solicitudes/LicenciaPage'));

const DescansoMedicoPage = lazy(() => import('./pages/solicitudes/DescansoMedicoPage'));

const ConstatacionDomiciliariaPage = lazy(() => import('./pages/solicitudes/ConstatacionDomiciliariaPage'));

const TipoLicenciaPage = lazy(() => import('./pages/solicitudes/TipoLicenciaPage'));

const TipoPapeletaPage = lazy(() => import('./pages/solicitudes/TipoPapeletaPage'));

const MotivoPapeletaPage = lazy(() => import('./pages/solicitudes/MotivoPapeletaPage'));

const OcurrenciaPorteriaPage = lazy(() => import('./pages/solicitudes/OcurrenciaPorteriaPage'));

// SOPORTE
const CalendarioNoLaborablePage = lazy(() => import('./pages/soporte/CalendarioNoLaborablePage'));

const DocumentoSustentoPage = lazy(() => import('./pages/soporte/DocumentoSustentoPage'));

const LogIntegracionPage = lazy(() => import('./pages/soporte/LogIntegracionPage'));

const NotificacionPage = lazy(() => import('./pages/soporte/NotificacionPage'));

import { menu } from './nav/menu';

// =========================================================
// PÁGINAS REALES
// =========================================================

const paginasReales = {
  // ASISTENCIA
  '/asistencia/marcaciones': MarcacionPage,
  '/asistencia/asistencia-diaria': AsistenciaDiariaPage,
  '/asistencia/justificacion-faltas': JustificacionFaltaPage,
  '/asistencia/carga-manual': CargaAsistenciaManualPage,
  '/asistencia/conceptos-justificacion': ConceptoJustificacionPage,
  '/asistencia/estados': EstadoAsistenciaPage,
  '/asistencia/ajustes': AjusteMarcacionPage,

  // BIOMETRÍA
  '/biometria/metodos': MetodoMarcacionPage,
  '/biometria/dispositivos': DispositivoMarcacionPage,
  '/biometria/plantillas': PlantillaBiometricaPage,
  '/biometria/autorizaciones': AutorizacionMetodoPage,
  '/biometria/consentimientos': ConsentimientoBiometricoPage,

  // ORGANIZACIÓN
  '/organizacion/microredes': MicroredPage,
  '/organizacion/responsables': ResponsableEessPage,
  '/organizacion/establecimientos': EstablecimientoSaludPage,
  '/organizacion/tipos-establecimiento': TipoEstablecimientoPage,
  '/organizacion/tipos-responsabilidad': TipoResponsabilidadPage,

  // COMPENSACIONES
  '/compensaciones/conceptos-descuento': ConceptoDescuentoPage,
  '/compensaciones/compensacion-horaria': CompensacionHorariaPage,
  '/compensaciones/tipos-compensacion': TipoCompensacionPage,
  '/compensaciones/liquidaciones': LiquidacionDescuentoPage,

  // CONFIGURACIÓN
  '/configuracion/parametros-sistema': ParametroSistemaPage,
  '/configuracion/tablas-tolerancia': TablaToleranciaPage,
  '/configuracion/tramos-tolerancia': TramoToleranciaPage,
  '/configuracion/turnos': TurnoPage,
  '/configuracion/horarios': HorarioPage,
  '/configuracion/parametros-jornada': ParametroJornadaPage,
  '/configuracion/tipos-jornada': TipoJornadaPage,

  // CONSOLIDACIÓN
  '/consolidacion/periodos-asistencia': PeriodoAsistenciaPage,
  '/consolidacion/consolidado': ConsolidadoAsistenciaPage,

  // VACACIONES
  '/vacaciones/periodos': PeriodoVacacionalPage,
  '/vacaciones/rol': RolVacacionalPage,
  '/vacaciones/goce': GoceVacacionalPage,

  // DISCIPLINA
  '/disciplina/expedientes-pad': ExpedientePadPage,
  '/disciplina/supervisiones': SupervisionInopinadaPage,
  '/disciplina/tipos-falta': TipoFaltaDisciplinariaPage,

  // PERSONAL
  '/personal/trabajadores': TrabajadorPage,
  '/personal/vinculos-laborales': VinculoLaboralPage,
  '/personal/asignacion-horario': AsignacionHorarioPage,
  '/personal/colegiaturas': ColegiaturaPage,
  '/personal/cargos': CargoPage,
  '/personal/regimen-laboral': RegimenLaboralPage,
  '/personal/tipos-documento-identidad': TipoDocumentoIdentidadPage,
  '/personal/grupos-ocupacionales': GrupoOcupacionalPage,
  '/personal/profesiones': ProfesionPage,
  '/personal/tipos-colegiatura': ColegiaturaTipoPage,
  '/personal/condicion-laboral': CondicionLaboralPage,

  // PROGRAMACIÓN
  '/programacion/periodos': ProgramacionPeriodoPage,
  '/programacion/carga': CargaProgramacionPage,
  '/programacion/guardia-comunitaria': InformeGuardiaComunitariaPage,
  '/programacion/tipos-cambio-turno': TipoCambioTurnoPage,
  '/programacion/tipos-periodo': TipoPeriodoProgramacionPage,
  '/programacion/trabajadores': ProgramacionTrabajadorPage,
  '/programacion/turnos-programados': TurnoProgramadoPage,
  '/programacion/calendario': CalendarioProgramacionPage,
  '/programacion/calendario-ausencias': CalendarioAusenciasPage,
  '/programacion/cambios-turno': CambioTurnoPage,

  // SEGURIDAD
  '/seguridad/auditoria': AuditoriaPage,
  '/seguridad/permisos': PermisoPage,
  '/seguridad/roles': RolPage,
  '/seguridad/usuarios': UsuarioPage,
  '/seguridad/usuarios-roles': UsuarioRolPage,
  '/seguridad/usuarios-ambitos': UsuarioAmbitoPage,
  '/seguridad/sesiones': SesionAccesoPage,

  // SOLICITUDES
  '/solicitudes/papeletas': PapeletaPage,
  '/solicitudes/licencias': LicenciaPage,
  '/solicitudes/descansos-medicos': DescansoMedicoPage,
  '/solicitudes/constatacion-domiciliaria': ConstatacionDomiciliariaPage,
  '/solicitudes/tipos-licencia': TipoLicenciaPage,
  '/solicitudes/tipos-papeleta': TipoPapeletaPage,
  '/solicitudes/motivos-papeleta': MotivoPapeletaPage,
  '/solicitudes/ocurrencias-porteria': OcurrenciaPorteriaPage,

  // SOPORTE
  '/soporte/calendario-no-laborable': CalendarioNoLaborablePage,
  '/soporte/documentos-sustento': DocumentoSustentoPage,
  '/soporte/logs-integracion': LogIntegracionPage,
  '/soporte/notificaciones': NotificacionPage,
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
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
