import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BrandBackdrop from '../components/ui/BrandBackdrop';
import ProgresoDePantalla from '../components/ui/ProgresoDePantalla';
import CambiarClaveModal from '../components/auth/CambiarClaveModal';
import ConfirmarBaja from '../components/ui/ConfirmarBaja';
import VisorDeDocumento from '../components/ui/VisorDeDocumento';
import { useAuth } from '../auth/useAuth';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function MainLayout() {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  // En escritorio: false = sidebar completo, true = riel de iconos. En movil: true = oculto.
  // `null` = el usuario aun no lo ha tocado: se usa el valor por defecto de cada tamaño de pantalla.
  const [preferencia, setPreferencia] = useState(null);
  const collapsed = preferencia ?? isMobile;
  const toggle = () => setPreferencia(!collapsed);
  const { usuario } = useAuth();
  const [cambiandoClave, setCambiandoClave] = useState(false);
  // Primer ingreso o clave restablecida por el administrador: debe cambiarla antes de seguir.
  const debeCambiar = Boolean(usuario?.debe_cambiar_clave);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-page">
      <Sidebar collapsed={collapsed} onToggle={toggle} isMobile={isMobile} onNavigate={isMobile ? () => setPreferencia(true) : undefined} />

      {isMobile && !collapsed && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setPreferencia(true)}
          className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-[2px]"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar onMenu={toggle} onCambiarClave={() => setCambiandoClave(true)} />

        {/* relative + overflow-hidden: este <main> NO se desplaza. Es el ancla de posicion del
            Modal (position:absolute inset-0) de cada pagina: el modal queda centrado en lo que se
            ve aunque la lista tenga scroll. Quien se desplaza es el div de adentro. */}
        <main className="relative isolate flex-1 overflow-hidden bg-page">
          {/* z-index:-1 dentro de un contexto `isolate`: queda sobre el fondo del <main> y bajo el contenido. */}
          <ConfirmarBaja>
            <BrandBackdrop />
            <div className="h-full overflow-y-auto">
              <Suspense fallback={<ProgresoDePantalla />}>
                <Outlet />
              </Suspense>
            </div>
            <CambiarClaveModal abierto={cambiandoClave || debeCambiar} obligatorio={debeCambiar} onClose={() => setCambiandoClave(false)} />
            <VisorDeDocumento />
          </ConfirmarBaja>
        </main>
      </div>
    </div>
  );
}
