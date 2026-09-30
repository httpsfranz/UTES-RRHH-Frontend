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

import RegimenLaboralPage from './pages/personal/RegimenLaboralPage';

import TipoDocumentoIdentidadPage from './pages/personal/TipoDocumentoIdentidadPage';

import GrupoOcupacionalPage from './pages/personal/GrupoOcupacionalPage';

import ProfesionPage from './pages/personal/ProfesionPage';

import ColegiaturaTipoPage from './pages/personal/ColegiaturaTipoPage';

import CondicionLaboralPage from './pages/personal/CondicionLaboralPage';

import TipoCambioTurnoPage from './pages/programacion/TipoCambioTurnoPage';

import TipoPeriodoProgramacionPage from './pages/programacion/TipoPeriodoProgramacionPage';

import AuditoriaPage from './pages/seguridad/AuditoriaPage';

import PermisoPage from './pages/seguridad/PermisoPage';

import RolPage from './pages/seguridad/RolPage';

import TipoLicenciaPage from './pages/solicitudes/TipoLicenciaPage';

import TipoPapeletaPage from './pages/solicitudes/TipoPapeletaPage';

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