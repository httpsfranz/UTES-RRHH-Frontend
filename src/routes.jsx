import { createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

// ASISTENCIA
import MarcacionPage from './pages/asistencia/MarcacionPage';

import AsistenciaDiariaPage from './pages/asistencia/AsistenciaDiariaPage';

import JustificacionFaltaPage from './pages/asistencia/JustificacionFaltaPage';

import CargaAsistenciaManualPage from './pages/asistencia/CargaAsistenciaManualPage';

import ConceptoJustificacionPage from './pages/asistencia/ConceptoJustificacionPage';

import EstadoAsistenciaPage from './pages/asistencia/EstadoAsistenciaPage';

import AjusteMarcacionPage from './pages/asistencia/AjusteMarcacionPage';

// ORGANIZACIÓN
import ResponsableEessPage from './pages/organizacion/ResponsableEessPage';

import MicroredPage from './pages/organizacion/MicroredPage';

import EstablecimientoSaludPage from './pages/organizacion/EstablecimientoSaludPage';

// BIOMETRÍA
import PlantillaBiometricaPage from './pages/biometria/PlantillaBiometricaPage';

import AutorizacionMetodoPage from './pages/biometria/AutorizacionMetodoPage';

import ConsentimientoBiometricoPage from './pages/biometria/ConsentimientoBiometricoPage';

import MetodoMarcacionPage from './pages/biometria/MetodoMarcacionPage';

import DispositivoMarcacionPage from './pages/biometria/DispositivoMarcacionPage';

import TipoEstablecimientoPage from './pages/organizacion/TipoEstablecimientoPage';

import TipoResponsabilidadPage from './pages/organizacion/TipoResponsabilidadPage';

// COMPENSACIONES
import CompensacionHorariaPage from './pages/compensaciones/CompensacionHorariaPage';

import ConceptoDescuentoPage from './pages/compensaciones/ConceptoDescuentoPage';

import TipoCompensacionPage from './pages/compensaciones/TipoCompensacionPage';

import LiquidacionDescuentoPage from './pages/compensaciones/LiquidacionDescuentoPage';

// CONFIGURACIÓN
import ParametroSistemaPage from './pages/configuracion/ParametroSistemaPage';

import TablaToleranciaPage from './pages/configuracion/TablaToleranciaPage';

import TramoToleranciaPage from './pages/configuracion/TramoToleranciaPage';

import TurnoPage from './pages/configuracion/TurnoPage';

import HorarioPage from './pages/configuracion/HorarioPage';

import ParametroJornadaPage from './pages/configuracion/ParametroJornadaPage';

import TipoJornadaPage from './pages/configuracion/TipoJornadaPage';

// CONSOLIDACIÓN
import ConsolidadoAsistenciaPage from './pages/consolidacion/ConsolidadoAsistenciaPage';

import PeriodoAsistenciaPage from './pages/consolidacion/PeriodoAsistenciaPage';

// VACACIONES
import PeriodoVacacionalPage from './pages/vacaciones/PeriodoVacacionalPage';

import RolVacacionalPage from './pages/vacaciones/RolVacacionalPage';

import GoceVacacionalPage from './pages/vacaciones/GoceVacacionalPage';

// DISCIPLINA
import ExpedientePadPage from './pages/disciplina/ExpedientePadPage';

import SupervisionInopinadaPage from './pages/disciplina/SupervisionInopinadaPage';

import TipoFaltaDisciplinariaPage from './pages/disciplina/TipoFaltaDisciplinariaPage';

// PERSONAL
import AsignacionHorarioPage from './pages/personal/AsignacionHorarioPage';

import VinculoLaboralPage from './pages/personal/VinculoLaboralPage';

import ColegiaturaPage from './pages/personal/ColegiaturaPage';

import TrabajadorPage from './pages/personal/TrabajadorPage';

import CargoPage from './pages/personal/CargoPage';

import RegimenLaboralPage from './pages/personal/RegimenLaboralPage';

import TipoDocumentoIdentidadPage from './pages/personal/TipoDocumentoIdentidadPage';

import GrupoOcupacionalPage from './pages/personal/GrupoOcupacionalPage';

import ProfesionPage from './pages/personal/ProfesionPage';

import ColegiaturaTipoPage from './pages/personal/ColegiaturaTipoPage';

import CondicionLaboralPage from './pages/personal/CondicionLaboralPage';

// PROGRAMACIÓN
import ProgramacionPeriodoPage from './pages/programacion/ProgramacionPeriodoPage';

import CargaProgramacionPage from './pages/programacion/CargaProgramacionPage';

import InformeGuardiaComunitariaPage from './pages/programacion/InformeGuardiaComunitariaPage';

import TipoCambioTurnoPage from './pages/programacion/TipoCambioTurnoPage';

import TipoPeriodoProgramacionPage from './pages/programacion/TipoPeriodoProgramacionPage';

import ProgramacionTrabajadorPage from './pages/programacion/ProgramacionTrabajadorPage';

import TurnoProgramadoPage from './pages/programacion/TurnoProgramadoPage';

import CambioTurnoPage from './pages/programacion/CambioTurnoPage';

// SEGURIDAD
import AuditoriaPage from './pages/seguridad/AuditoriaPage';

import PermisoPage from './pages/seguridad/PermisoPage';

import RolPage from './pages/seguridad/RolPage';

import UsuarioPage from './pages/seguridad/UsuarioPage';

import UsuarioRolPage from './pages/seguridad/UsuarioRolPage';

import UsuarioAmbitoPage from './pages/seguridad/UsuarioAmbitoPage';

import SesionAccesoPage from './pages/seguridad/SesionAccesoPage';

// SOLICITUDES
import PapeletaPage from './pages/solicitudes/PapeletaPage';

import LicenciaPage from './pages/solicitudes/LicenciaPage';

import DescansoMedicoPage from './pages/solicitudes/DescansoMedicoPage';

import ConstatacionDomiciliariaPage from './pages/solicitudes/ConstatacionDomiciliariaPage';

import TipoLicenciaPage from './pages/solicitudes/TipoLicenciaPage';

import TipoPapeletaPage from './pages/solicitudes/TipoPapeletaPage';

import MotivoPapeletaPage from './pages/solicitudes/MotivoPapeletaPage';

import OcurrenciaPorteriaPage from './pages/solicitudes/OcurrenciaPorteriaPage';

// SOPORTE
import CalendarioNoLaborablePage from './pages/soporte/CalendarioNoLaborablePage';

import DocumentoSustentoPage from './pages/soporte/DocumentoSustentoPage';

import LogIntegracionPage from './pages/soporte/LogIntegracionPage';

import NotificacionPage from './pages/soporte/NotificacionPage';

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
      element: PaginaReal ? (
        <PaginaReal />
      ) : (
        <PlaceholderPage title={item.label} />
      ),
    };
  })
);

// =========================================================
// ROUTER PRINCIPAL
// =========================================================

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...moduleRoutes,
    ],
  },
]);