import { createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

import MicroredPage from './pages/organizacion/MicroredPage';

import MetodoMarcacionPage from './pages/biometria/MetodoMarcacionPage';
import DispositivoMarcacionPage from './pages/biometria/DispositivoMarcacionPage';

import TipoEstablecimientoPage from './pages/organizacion/TipoEstablecimientoPage';

import ConceptoDescuentoPage from './pages/compensaciones/ConceptoDescuentoPage.jsx';

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