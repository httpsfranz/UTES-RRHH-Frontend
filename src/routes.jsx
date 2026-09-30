import { createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

import MicroredPage from './pages/organizacion/MicroredPage';

import MetodoMarcacionPage from './pages/biometria/MetodoMarcacionPage';

import DispositivoMarcacionPage from './pages/biometria/DispositivoMarcacionPage';

import TipoEstablecimientoPage from './pages/organizacion/TipoEstablecimientoPage';

import TipoResponsabilidadPage from './pages/organizacion/TipoResponsabilidadPage';

import ConceptoDescuentoPage from './pages/compensaciones/ConceptoDescuentoPage.jsx';

import TipoCompensacionPage from './pages/compensaciones/TipoCompensacionPage';

// CONFIGURACIÓN
import ParametroSistemaPage from './pages/configuracion/ParametroSistemaPage';

import TablaToleranciaPage from './pages/configuracion/TablaToleranciaPage';

import TipoJornadaPage from './pages/configuracion/TipoJornadaPage';

// CONSOLIDACIÓN
import PeriodoAsistenciaPage from './pages/consolidacion/PeriodoAsistenciaPage';

// DISCIPLINA
import TipoFaltaDisciplinariaPage from './pages/disciplina/TipoFaltaDisciplinariaPage';

// PERSONAL
import RegimenLaboralPage from './pages/personal/RegimenLaboralPage';

import TipoDocumentoIdentidadPage from './pages/personal/TipoDocumentoIdentidadPage';

import GrupoOcupacionalPage from './pages/personal/GrupoOcupacionalPage';

import ProfesionPage from './pages/personal/ProfesionPage';

import ColegiaturaTipoPage from './pages/personal/ColegiaturaTipoPage';

import CondicionLaboralPage from './pages/personal/CondicionLaboralPage';

// PROGRAMACIÓN
import TipoCambioTurnoPage from './pages/programacion/TipoCambioTurnoPage';

import TipoPeriodoProgramacionPage from './pages/programacion/TipoPeriodoProgramacionPage';

// SEGURIDAD
import AuditoriaPage from './pages/seguridad/AuditoriaPage';

import PermisoPage from './pages/seguridad/PermisoPage';

import RolPage from './pages/seguridad/RolPage';

// SOLICITUDES
import TipoLicenciaPage from './pages/solicitudes/TipoLicenciaPage';

import TipoPapeletaPage from './pages/solicitudes/TipoPapeletaPage';

// SOPORTE
import CalendarioNoLaborablePage from './pages/soporte/CalendarioNoLaborablePage';

import DocumentoSustentoPage from './pages/soporte/DocumentoSustentoPage';

import LogIntegracionPage from './pages/soporte/LogIntegracionPage';

import { menu } from './nav/menu';

// =========================================================
// PÁGINAS REALES
// =========================================================

const paginasReales = {
  // BIOMETRÍA
  '/biometria/metodos': MetodoMarcacionPage,
  '/biometria/dispositivos': DispositivoMarcacionPage,

  // ORGANIZACIÓN
  '/organizacion/microredes': MicroredPage,
  '/organizacion/tipos-establecimiento': TipoEstablecimientoPage,
  '/organizacion/tipos-responsabilidad': TipoResponsabilidadPage,

  // COMPENSACIONES
  '/compensaciones/conceptos-descuento': ConceptoDescuentoPage,
  '/compensaciones/tipos-compensacion': TipoCompensacionPage,

  // CONFIGURACIÓN
  '/configuracion/parametros-sistema': ParametroSistemaPage,
  '/configuracion/tablas-tolerancia': TablaToleranciaPage,
  '/configuracion/tipos-jornada': TipoJornadaPage,

  // CONSOLIDACIÓN
  '/consolidacion/periodos-asistencia': PeriodoAsistenciaPage,

  // DISCIPLINA
  '/disciplina/tipos-falta': TipoFaltaDisciplinariaPage,

  // PERSONAL
  '/personal/regimen-laboral': RegimenLaboralPage,
  '/personal/tipos-documento-identidad': TipoDocumentoIdentidadPage,
  '/personal/grupos-ocupacionales': GrupoOcupacionalPage,
  '/personal/profesiones': ProfesionPage,
  '/personal/tipos-colegiatura': ColegiaturaTipoPage,
  '/personal/condicion-laboral': CondicionLaboralPage,

  // PROGRAMACIÓN
  '/programacion/tipos-cambio-turno': TipoCambioTurnoPage,
  '/programacion/tipos-periodo': TipoPeriodoProgramacionPage,

  // SEGURIDAD
  '/seguridad/auditoria': AuditoriaPage,
  '/seguridad/permisos': PermisoPage,
  '/seguridad/roles': RolPage,

  // SOLICITUDES
  '/solicitudes/tipos-licencia': TipoLicenciaPage,
  '/solicitudes/tipos-papeleta': TipoPapeletaPage,

  // SOPORTE
  '/soporte/calendario-no-laborable': CalendarioNoLaborablePage,
  '/soporte/documentos-sustento': DocumentoSustentoPage,
  '/soporte/logs-integracion': LogIntegracionPage,
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