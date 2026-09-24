import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronsLeft, HeartPulse } from 'lucide-react';
import { menu } from '../nav/menu';

// Spring critico (sin overshoot): el mismo tipo de curva que usa el ejemplo para
// que el riel de icono-solo no "rebote" al asentarse en su ancho final.
const WIDTH_TRANSITION = { type: 'spring', stiffness: 380, damping: 35, mass: 0.75 };
const PILL_TRANSITION = { type: 'spring', stiffness: 500, damping: 40 };
const EASE_OUT = [0.16, 1, 0.3, 1];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState(() => new Set());

  // Si entras directo a una URL (o navegas), el grupo que contiene esa ruta se
  // despliega solo, para que el item activo sea visible sin tener que buscarlo.
  useEffect(() => {
    const grupoActivo = menu.find((g) => g.children.some((c) => c.path === location.pathname));
    if (grupoActivo) {
      // Sincroniza el estado local (que grupo esta abierto) con la señal externa
      // (la URL actual). Solo cambia cuando cambia la ruta, no en cada render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenGroups((prev) => new Set(prev).add(grupoActivo.label));
    }
  }, [location.pathname]);

  function toggleGroup(label) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 288 }}
      transition={WIDTH_TRANSITION}
      className="flex h-screen shrink-0 flex-col overflow-hidden bg-sidebar text-slate-200"
    >
      {/* Encabezado SIN bloque de color propio: mismo fondo que el resto del sidebar,
          solo el icono lleva el acento (texto azul), tal como el AnimatedSidebarHeader
          del ejemplo (que es un div plano, sin bg). Colapsado, el icono mismo expande. */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
          collapsed ? 'justify-center px-2' : 'gap-3 px-4'
        }`}
      >
        <button
          type="button"
          onClick={collapsed ? onToggle : undefined}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ${
            collapsed ? 'cursor-pointer transition-colors hover:bg-white/10' : ''
          }`}
          aria-label={collapsed ? 'Expandir menú' : undefined}
          tabIndex={collapsed ? 0 : -1}
        >
          <HeartPulse size={18} className="text-brand" />
        </button>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">UTES · RRHH</p>
              <p className="truncate text-[11px] text-slate-400">Red de Salud Trujillo</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Colapsar menú"
            >
              <ChevronsLeft size={18} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
        <ul className="space-y-1">
          {menu.map((group) => {
            const Icon = group.icon;
            const isOpen = openGroups.has(group.label);

            return (
              <li key={group.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (collapsed) onToggle();
                    toggleGroup(group.label);
                  }}
                  className="flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-sidebar-hover hover:text-white"
                  title={collapsed ? group.label : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  <motion.span
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    transition={{ duration: collapsed ? 0.1 : 0.2, delay: collapsed ? 0 : 0.06 }}
                    className="flex-1 truncate text-left"
                  >
                    {group.label}
                  </motion.span>
                  {!collapsed && (
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && !collapsed && (
                    <motion.ul
                      key="submenu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: EASE_OUT }}
                      className="ml-8 mt-1 space-y-0.5 overflow-hidden border-l border-white/10 pl-3"
                    >
                      {group.children.map((item, index) => {
                        const isActive = location.pathname === item.path;

                        return (
                          <motion.li
                            key={item.path}
                            initial={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              filter: 'blur(0px)',
                              transition: { duration: 0.18, delay: index * 0.025 },
                            }}
                          >
                            <Link
                              to={item.path}
                              className={`relative block rounded-md px-3 py-2 text-sm transition-colors ${
                                isActive ? 'font-medium text-white' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              {/* layoutId compartido: al navegar, este fondo no aparece y
                                  desaparece de golpe — Motion anima un "FLIP" desde la
                                  posicion del item activo anterior hasta este. Ese
                                  deslizamiento es el efecto que viste en el ejemplo. */}
                              {isActive && (
                                <motion.span
                                  layoutId="sidebar-active-pill"
                                  transition={PILL_TRANSITION}
                                  className="absolute inset-0 rounded-md bg-sidebar-hover"
                                />
                              )}
                              <span className="relative z-10">{item.label}</span>
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
    </motion.aside>
  );
}
