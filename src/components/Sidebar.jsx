import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronsLeft, HeartPulse, House } from 'lucide-react';
import { menu } from '../nav/menu';
import { getModuleMeta } from '../nav/moduleIcons';

const WIDTH_TRANSITION = { type: 'spring', stiffness: 380, damping: 35, mass: 0.75 };
const PILL_TRANSITION = { type: 'spring', stiffness: 500, damping: 40 };
const EASE_OUT = [0.16, 1, 0.3, 1];

const ANCHO = 272;
const ANCHO_RIEL = 72;

// `collapsed` en escritorio = riel de solo iconos; en movil (isMobile) = menu oculto fuera de pantalla
// (se abre como cajon sobre el contenido). `onNavigate` cierra el cajon al elegir una pantalla.
export default function Sidebar({ collapsed, onToggle, isMobile = false, onNavigate }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const rail = collapsed && !isMobile;

  useEffect(() => {
    const grupoActivo = menu.find((g) => g.children.some((c) => c.path === location.pathname));
    if (grupoActivo) {
      // Sincroniza el grupo abierto con la URL actual (señal externa); solo al cambiar de ruta.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenGroup(grupoActivo.label);
    }
  }, [location.pathname]);

  function toggleGroup(label) {
    setOpenGroup((actual) => (actual === label ? null : label));
  }

  const posicion = isMobile
    ? { animate: { x: collapsed ? -ANCHO - 16 : 0 }, className: 'fixed inset-y-0 left-0 z-50 shadow-2xl' }
    : { animate: { width: rail ? ANCHO_RIEL : ANCHO }, className: 'relative' };

  const inicioActivo = location.pathname === '/';

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
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/[0.08] ${
          rail ? 'justify-center px-2' : 'gap-3 px-5'
        }`}
      >
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
            <Link
              to="/"
              onClick={onNavigate}
              title={rail ? 'Inicio' : undefined}
              className={`relative flex items-center gap-3.5 py-2.5 text-[13.5px] transition-colors hover:bg-white/[0.05] hover:text-white ${
                rail ? 'justify-center px-0' : 'px-5'
              } ${inicioActivo ? 'bg-sidebar-hover text-white' : 'text-slate-300'}`}
            >
              {inicioActivo && <span className="absolute inset-y-0 left-0 w-[3px] bg-teal-400" />}
              <House size={18} className="shrink-0" strokeWidth={1.6} />
              {!rail && <span className="truncate">Inicio</span>}
            </Link>
          </li>

          {menu.map((group) => {
            const Icon = group.icon;
            const isOpen = openGroup === group.label;
            const tieneActivo = group.children.some((c) => c.path === location.pathname);
            const resaltado = (isOpen || tieneActivo) && !rail;

            return (
              <li key={group.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (rail) onToggle();
                    toggleGroup(group.label);
                  }}
                  aria-expanded={isOpen}
                  className={`relative flex w-full items-center gap-3.5 overflow-hidden py-2.5 text-[13.5px] transition-colors hover:bg-white/[0.05] hover:text-white ${
                    rail ? 'justify-center px-0' : 'px-5'
                  } ${resaltado ? 'bg-sidebar-hover font-medium text-white' : 'text-slate-300'}`}
                  title={rail ? group.label : undefined}
                >
                  {resaltado && <span className="absolute inset-y-0 left-0 w-[3px] bg-teal-400" />}
                  <Icon size={18} strokeWidth={1.6} className="shrink-0" />
                  {!rail && (
                    <>
                      <span className="flex-1 truncate text-left">{group.label}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-slate-400"
                      >
                        <ChevronDown size={15} />
                      </motion.span>
                    </>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && !rail && (
                    <motion.ul
                      key="submenu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="list-none space-y-0.5 overflow-hidden bg-sidebar-sub/70 px-3 py-2"
                    >
                      {group.children.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const ItemIcon = getModuleMeta(item.path).icon;

                        return (
                          <motion.li
                            key={item.path}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, delay: index * 0.02 } }}
                          >
                            <Link
                              to={item.path}
                              onClick={onNavigate}
                              className={`relative flex items-center gap-3 rounded-lg py-2 pl-5 pr-3 text-[13px] transition-colors ${
                                isActive
                                  ? 'font-medium text-white'
                                  : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                              }`}
                            >
                              {/* layoutId compartido: Motion anima el "pill" turquesa desde el item
                                  activo anterior hasta este. */}
                              {isActive && (
                                <motion.span
                                  layoutId="sidebar-active-pill"
                                  transition={PILL_TRANSITION}
                                  className="absolute inset-0 rounded-lg bg-brand"
                                />
                              )}
                              <ItemIcon size={15} strokeWidth={1.7} className="relative z-10 shrink-0" />
                              <span className="relative z-10 leading-snug">{item.label}</span>
                            </Link>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Pie institucional: ilustracion (si el archivo no existe se oculta sola) + lema. */}
      {!rail && (
        <div className="pointer-events-none shrink-0 border-t border-white/[0.06] pb-4 pt-3 text-center" aria-hidden="true">
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
