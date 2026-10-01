import { Link } from 'react-router-dom';
import { ChevronRight, House } from 'lucide-react';
import { useModuleMeta } from '../../nav/moduleIcons';

// Inicio > Modulo > Pantalla, derivado de la ruta actual y del menu (sin props).
export default function PageBreadcrumb() {
  const { groupLabel, label } = useModuleMeta();

  return (
    <nav aria-label="Ruta de navegación" className="flex min-w-0 items-center gap-1.5 text-[13px] text-muted">
      <Link to="/" className="flex items-center gap-1.5 rounded-md transition-colors hover:text-heading">
        <House size={14} />
        <span className="hidden sm:inline">Inicio</span>
      </Link>
      {groupLabel && (
        <>
          <ChevronRight size={13} className="shrink-0 text-slate-300" />
          <span className="hidden truncate sm:inline">{groupLabel}</span>
        </>
      )}
      {label && (
        <>
          <ChevronRight size={13} className="hidden shrink-0 text-slate-300 sm:block" />
          <span className="truncate font-medium text-heading">{label}</span>
        </>
      )}
    </nav>
  );
}
