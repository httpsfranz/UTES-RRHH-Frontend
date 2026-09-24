import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-page">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        {/* relative + overflow-hidden: este <main> NO se desplaza. Es el ancla de
            posicion para el Modal (position:absolute inset-0) de cada pagina. Quien
            sí se desplaza es el div de adentro. Asi, si el usuario habia hecho scroll
            en la lista, el modal igual aparece centrado en lo que se ve, no se va
            "scrolleado" fuera de pantalla. */}
        <main className="relative flex-1 overflow-hidden bg-page">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
