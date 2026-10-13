import { useState } from 'react';
import { HeartPulse } from 'lucide-react';

// Pantalla de acceso: a la izquierda (solo en pantallas anchas) un panel institucional con la imagen de fondo y el logo,
// ambos con difuminados; a la derecha la tarjeta con el formulario. Todo el efecto es CSS: si faltan las imagenes
// (public/assets/images/branding/login-bg.jpg y logo.png) se usa la foto del edificio del sistema (building-bg.png) y un
// icono institucional, junto con las manchas de color.
//
//   children  el formulario de acceso
const IMAGENES_DE_FONDO = ['/assets/images/branding/login-bg.jpg', '/assets/images/branding/building-bg.png'];
const LOGO = '/assets/images/branding/logo.png';

// Imagen de fondo: la primera que exista; si ninguna carga, solo quedan las manchas de color.
function FondoDelPanel() {
  const [indice, setIndice] = useState(0);
  if (indice >= IMAGENES_DE_FONDO.length) return null;
  return <img src={IMAGENES_DE_FONDO[indice]} alt="" onError={() => setIndice((i) => i + 1)} className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-[3px]" />;
}

// Logo institucional; si el archivo no existe se muestra el icono de la Red.
function Logo({ tamano, clase }) {
  const [falta, setFalta] = useState(false);
  if (falta) return <HeartPulse size={tamano} strokeWidth={1.6} className={clase} />;
  return <img src={LOGO} alt="" onError={() => setFalta(true)} className={`object-contain ${clase}`} />;
}

export default function LoginLayout({ children }) {
  return (
    <div className="grid min-h-screen w-screen bg-page lg:grid-cols-[1.15fr_1fr]">
      {/* Panel institucional */}
      <aside className="relative hidden overflow-hidden bg-navy lg:block" aria-hidden="true">
        <FondoDelPanel />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/85 via-navy/70 to-brand-dark/60" />
        <span className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand/40 blur-3xl" />
        <span className="absolute -bottom-32 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-400/25 blur-3xl" />
        <span className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative flex h-full flex-col items-center justify-center gap-8 px-12 text-center">
          <div className="relative flex h-44 w-44 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/25 blur-2xl" />
            <span className="absolute inset-4 rounded-full bg-white/10 ring-1 ring-white/30 backdrop-blur-md" />
            <Logo tamano={72} clase="relative z-10 max-h-28 max-w-28 text-white drop-shadow-xl" />
          </div>
          <div className="max-w-md space-y-3 text-white">
            <h1 className="text-3xl font-semibold tracking-tight">Red de Salud Trujillo</h1>
            <p className="text-base text-white/80">Sistema de control de asistencia y gestión de recursos humanos</p>
          </div>
          <p className="absolute bottom-8 text-xs tracking-wide text-white/55">Comprometidos con tu bienestar</p>
        </div>
      </aside>

      {/* Formulario */}
      <main className="relative flex items-center justify-center overflow-hidden px-4 py-10 sm:px-8">
        <span className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-surface/85 p-8 shadow-[var(--shadow-pop)] backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft ring-1 ring-brand/15 lg:hidden">
              <Logo tamano={30} clase="max-h-9 max-w-9 text-brand" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-heading">Iniciar sesión</h2>
              <p className="mt-1 text-sm text-muted">Ingresa con tu usuario del sistema UTES · RRHH.</p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
