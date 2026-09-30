import { createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

import MicroredPage from './pages/organizacion/MicroredPage';

import MetodoMarcacionPage from './pages/biometria/MetodoMarcacionPage';
import DispositivoMarcacionPage from './pages/biometria/DispositivoMarcacionPage';

import TipoEstablecimientoPage from './pages/organizacion/TipoEstablecimientoPage';

import ConceptoDescuentoPage from './pages/compensaciones/ConceptoDescuentoPage.jsx';

import TipoCompensacionPage from './pages/compensaciones/TipoCompensacionPage';

import ParametroSistemaPage from './pages/configuracion/ParametroSistemaPage';
import TablaToleranciaPage from './pages/configuracion/TablaToleranciaPage';
import TipoJornadaPage from './pages/configuracion/TipoJornadaPage';
import PeriodoAsistenciaPage from './pages/consolidacion/PeriodoAsistenciaPage';
import TipoFaltaDisciplinariaPage from './pages/disciplina/TipoFaltaDisciplinariaPage';

import { menu } from './nav/menu';

// =========================================================
// PÁGINAS REALES
// =========================================================

const paginasReales = {

  '/biometria/metodos': MetodoMarcacionPage,
  '/biometria/dispositivos': DispositivoMarcacionPage,

  '/organizacion/microredes': MicroredPage,
  '/organizacion/tipos-establecimiento': TipoEstablecimientoPage,

  '/compensaciones/conceptos-descuento': ConceptoDescuentoPage,
  '/compensaciones/tipos-compensacion': TipoCompensacionPage,
  '/configuracion/parametros-sistema': ParametroSistemaPage,
  '/configuracion/tablas-tolerancia': TablaToleranciaPage,
  '/configuracion/tipos-jornada': TipoJornadaPage,
  '/consolidacion/periodos-asistencia': PeriodoAsistenciaPage,
  '/disciplina/tipos-falta': TipoFaltaDisciplinariaPage,
  
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