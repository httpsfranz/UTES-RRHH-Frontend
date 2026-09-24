import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PlaceholderPage from './pages/PlaceholderPage';
import MicroredPage from './pages/organizacion/MicroredPage';
import { menu } from './nav/menu';

// Excepciones: rutas que ya tienen una pantalla real en vez de PlaceholderPage.
// Cuando construyas la pagina de verdad de otro modulo, agregas su entrada aqui.
const paginasReales = {
  '/organizacion/microredes': MicroredPage,
};

// Una ruta hija por cada item del menu. Si no esta en paginasReales, cae en la
// PlaceholderPage generica (solo cambia el titulo).
const moduleRoutes = menu.flatMap((group) =>
  group.children.map((item) => {
    const PaginaReal = paginasReales[item.path];

    return {
      path: item.path.replace(/^\//, ''), // rutas hijas son relativas al layout ("/")
      element: PaginaReal ? <PaginaReal /> : <PlaceholderPage title={item.label} />,
    };
  })
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [{ index: true, element: <HomePage /> }, ...moduleRoutes],
  },
]);
