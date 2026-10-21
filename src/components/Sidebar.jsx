import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronsLeft, HeartPulse, House } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { menuPara } from '../nav/acceso';
import { getModuleMeta } from '../nav/moduleIcons';
import { useContadoresDelMenu } from '../hooks/useContadoresDelMenu';

const WIDTH_TRANSITION = { type: 'spring', stiffness: 380, damping: 35, mass: 0.75 };
const PILL_TRANSITION = { type: 'spring', stiffness: 500, damping: 40 };
const EASE_OUT = [0.16, 1, 0.3, 1];

const ANCHO = 272;
const ANCHO_RIEL = 72;

// Punto de color de cada seccion (el mismo tono de su grupo en nav/moduleIcons). Clases completas para Tailwind.
const PUNTO_DE_GRUPO = {
  'Día a día': 'bg-emerald-400',
  Programación: 'bg-cyan-400',
  Personal: 'bg-teal-400',
  'Fin de mes': 'bg-blue-400',
  Administración: 'bg-slate-400',
};

// Que significa el numero de cada entrada (tooltip y lector de pantalla).
const QUE_CUENTA = {
  '/solicitudes/bandeja': 'por resolver',
  '/personal/trabajadores': 'sin horario',
};

// Una entrada del menu (tambien en el riel de solo iconos, con un punto ambar si tiene pendientes).
function Entrada({ path, label, icon: Icon, cantidad, activa, rail, onNavigate }) {
  const explicacion = cantidad ? `${cantidad} ${QUE_CUENTA[path] ?? 'pendientes'}` : null;

  return (
    <Link
      to={path}
      onClick={onNavigate}
      title={rail ? [label, explicacion].filter(Boolean).join(' · ') : (explicacion ?? undefined)}
      aria-current={activa ? 'page' : undefined}
      className={`group relative flex items-center rounded-lg text-[13.5px] transition-colors ${
        rail ? 'mx-auto h-10 w-10 justify-center' : 'mx-3 gap-3 px-3 py-[7px]'
      } ${activa ? 'font-medium text-white' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'}`}
    >
      {/* layoutId compartido: Motion anima el "pill" turquesa desde la entrada activa anterior hasta esta. */}
      {activa && (
        <motion.span layoutId="sidebar-active-pill" transition={PILL_TRANSITION} className="absolute inset-0 rounded-lg bg-brand shadow-sm" />
      )}
      <Icon
        size={18}
        strokeWidth={1.7}
        className={`relative z-10 shrink-0 ${activa ? 'text-white' : 'text-slate-400 transition-colors group-hover:text-slate-200'}`}
      />
      {!rail && <span className="relative z-10 flex-1 truncate">{label}</span>}
      {cantidad > 0 &&
        (rail ? (
          <span className="absolute right-1 top-1 z-10 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-sidebar" aria-label={explicacion} />
        ) : (
          <span
            className={`relative z-10 min-w-[22px] rounded-full px-1.5 py-px text-center text-[11px] font-semibold tabular-nums ${
              activa ? 'bg-white/25 text-white' : 'bg-amber-400/90 text-slate-900'
            }`}
            aria-label={explicacion}
          >
            {cantidad > 99 ? '99+' : cantidad}
          </span>
        ))}
    </Link>
  );
}

// Menu con pocas entradas (14): todas a la vista, agrupadas por seccion, sin acordeon que esconda la mitad. Cada
// entrada lleva su icono y, si algo espera al usuario ahi (solicitudes por resolver, personal sin horario), su numero.
// `collapsed` en escritorio = riel de solo iconos; en movil (isMobile) = menu oculto fuera de pantalla
// (se abre como cajon sobre el contenido). `onNavigate` cierra el cajon al elegir una pantalla.
export default function Sidebar({ collapsed, onToggle, isMobile = false, onNavigate }) {
  const location = useLocation();
  const auth = useAuth();
  const menu = useMemo(() => menuPara(auth), [auth]);
  const contadores = useContadoresDelMenu();
  const rail = collapsed && !isMobile;

  const posicion = isMobile
    ? { animate: { x: collapsed ? -ANCHO - 16 : 0 }, className: 'fixed inset-y-0 left-0 z-50 shadow-2xl' }
    : { animate: { width: rail ? ANCHO_RIEL : ANCHO }, className: 'relative' };

  return (
    <motion.aside
      initial={false}
      animate={posicion.animate}
      transition={isMobile ? { duration: 0.25, ease: EASE_OUT } : WIDTH_TRANSITION}
      style={isMobile ? { width: ANCHO } : undefined}
      className={`flex h-screen shrink-0 flex-col overflow-hidden bg-sidebar text-slate-200 ${posicion.className}`}
      aria-hidden={isMobile && collapsed ? true : undefined}
    >
      {/* Cabecera: logo + nombre institucional, separada del menu por una linea sutil. */}
      <div className={`flex h-16 shrink-0 items-center border-b border-white/[0.08] ${rail ? 'justify-center px-2' : 'gap-3 px-5'}`}>
        <button
          type="button"
          onClick={rail ? onToggle : undefined}
          className={`flex h-10 w-10 shrink-0 items-center justify-center text-teal-300 ${
            rail ? 'cursor-pointer transition-colors hover:text-white' : 'cursor-default'
          }`}
          aria-label={rail ? 'Expandir menú' : undefined}
          tabIndex={rail ? 0 : -1}
        >
          <HeartPulse size={30} strokeWidth={1.7} />
        </button>

        {!rail && (
          <>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[15px] font-semibold tracking-wide text-white">UTES · RRHH</p>
              <p className="truncate text-[11px] text-slate-400">Red de Salud Trujillo</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={isMobile ? 'Cerrar menú' : 'Colapsar menú'}
            >
              <ChevronsLeft size={18} />
            </button>
          </>
        )}
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden py-3" aria-label="Menú principal">
        <ul className="list-none">
          <li>
            <Entrada path="/" label="Inicio" icon={House} activa={location.pathname === '/'} rail={rail} onNavigate={onNavigate} />
          </li>
        </ul>

        {menu.map((group) => (
          <section key={group.label} aria-label={group.label} className={rail ? 'mt-2 border-t border-white/[0.07] pt-2' : 'mt-4'}>
            {!rail && (
              <h2 className="mb-1 flex items-center gap-2 px-6 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                <span className={`h-1.5 w-1.5 rounded-full ${PUNTO_DE_GRUPO[group.label] ?? 'bg-slate-400'}`} aria-hidden="true" />
                {group.label}
              </h2>
            )}
            <ul className="list-none space-y-0.5">
              {group.children.map((item) => (
                <li key={item.path}>
                  <Entrada
                    path={item.path}
                    label={item.label}
                    icon={getModuleMeta(item.path).icon}
                    cantidad={contadores[item.path]}
                    activa={location.pathname === item.path}
                    rail={rail}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      {/* Pie institucional: ilustracion (si el archivo no existe se oculta sola) + lema. En pantallas bajas se omite
          para que el menu no tenga que desplazarse. */}
      {!rail && (
        <div
          className="pointer-events-none shrink-0 border-t border-white/[0.06] pb-4 pt-3 text-center [@media(max-height:980px)]:hidden"
          aria-hidden="true"
        >
          <img
            src="/assets/images/branding/sidebar-illustration.png"
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            className="mx-auto mb-2 h-20 object-contain opacity-90"
          />
          <p className="text-[13px] font-medium text-white">Red de Salud Trujillo</p>
          <p className="text-[11px] text-slate-400">Comprometidos con tu bienestar</p>
        </div>
      )}
    </motion.aside>
  );
}
