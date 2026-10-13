import { useState } from 'react';
import { HeartPulse } from 'lucide-react';

// Pantalla de acceso centrada: fondo a pantalla completa (foto difuminada, degradado institucional y manchas de color) y,
// al centro, una tarjeta de cristal con el logo de la Gerencia Regional de Salud sobre un panel blanco difuminado. Todo el
// efecto es CSS; si faltan las imagenes se queda el degradado y, en lugar del logo, un icono institucional.
//
//   children  el formulario de acceso
const IMAGENES_DE_FONDO = ['/assets/images/branding/login-bg.jpg', '/assets/images/branding/building-bg.png'];
const LOGO = '/assets/images/documents/logo-gerencia-salud.jpg';
const ILUSTRACION = '/assets/images/branding/sidebar-illustration.png';

// Imagen de fondo: la primera que exista; si ninguna carga, solo quedan las manchas de color.
function FondoDePantalla() {
  const [indice, setIndice] = useState(0);
  if (indice >= IMAGENES_DE_FONDO.length) return null;
  return <img src={IMAGENES_DE_FONDO[indice]} alt="" onError={() => setIndice((i) => i + 1)} className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-[4px]" />;
}

// Logo institucional (JPG con fondo blanco): sus bordes se disuelven con una mascara radial para fundirse con el panel blanco.
function Logo() {
  const [falta, setFalta] = useState(false);
  return (
    <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
      <span className="absolute -inset-3 rounded-full bg-white/80 blur-2xl" />
      <span className="absolute inset-0 rounded-full bg-white shadow-[0_8px_30px_rgba(11,37,69,0.18)] ring-1 ring-brand/10" />
      {falta ? (
        <HeartPulse size={56} strokeWidth={1.6} className="relative text-brand" />
      ) : (
        <img
          src={LOGO}
          alt="Gerencia Regional de Salud"
          onError={() => setFalta(true)}
          className="relative h-32 w-32 object-contain [mask-image:radial-gradient(closest-side,#000_72%,transparent_100%)]"
        />
      )}
    </div>
  );
}

export default function LoginLayout({ children }) {
  return (
    <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden bg-navy px-4 py-10">
      <FondoDePantalla />
      <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/75 to-brand-dark/70" />
      <span className="absolute -left-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-brand/40 blur-3xl" />
      <span className="absolute -bottom-32 -right-24 h-[32rem] w-[32rem] rounded-full bg-cyan-400/25 blur-3xl" />
      <span className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/15 blur-3xl" />
      <img src={ILUSTRACION} alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 w-[min(70rem,140vw)] max-w-none -translate-x-1/2 opacity-25 blur-[1px] [mask-image:linear-gradient(to_top,#000_35%,transparent_95%)]" />

      <main className="relative w-full max-w-md">
        <div className="rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_-20px_rgba(2,12,27,0.6)] backdrop-blur-2xl sm:p-10">
          <div className="mb-8 text-center">
            <Logo />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-heading">Red de Salud Trujillo</h1>
            <p className="mt-1 text-sm text-muted">Control de asistencia y recursos humanos · UTES</p>
          </div>
          {children}
        </div>
        <p className="mt-6 text-center text-xs tracking-wide text-white/70">Gerencia Regional de Salud · Comprometidos con tu bienestar</p>
      </main>
    </div>
  );
}
