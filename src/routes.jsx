import { createBrowserRouter } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';

import PlaceholderPage from './pages/PlaceholderPage';

import MicroredPage from './pages/organizacion/MicroredPage';
import MetodoMarcacionPage from './pages/biometria/MetodoMarcacionPage';

import TipoEstablecimientoPage from './pages/organizacion/TipoEstablecimientoPage';
import { menu } from './nav/menu';

// =========================================================
// PÁGINAS REALES
// =========================================================

const paginasReales = {
  '/organizacion/microredes': MicroredPage,
  '/biometria/metodos': MetodoMarcacionPage,
  '/organizacion/tipos-establecimiento': TipoEstablecimientoPage,
};

// =========================================================
// RUTAS DE LOS MÓDULOS
// =========================================================

const moduleRoutes = menu.flatMap((group) =>
  group.children.map((item) => {
    const PaginaReal = paginasReales[item.path];

    return {
      path: item.path.replace(/^\//, ''),
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