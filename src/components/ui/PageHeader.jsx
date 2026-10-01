import ModuleIcon from './ModuleIcon';
import PageBreadcrumb from './PageBreadcrumb';
import { useModuleMeta } from '../../nav/moduleIcons';

// Los subtitulos de los modulos CRUD tienen la forma "Modulo · Entidad" (duplicaria el breadcrumb);
// en ese caso se muestra una descripcion generica derivada del titulo. Cualquier otro texto se respeta.
function descripcion(subtitle, title, groupLabel) {
  if (groupLabel && subtitle?.startsWith(`${groupLabel} ·`)) {
    return `Consulta y administra ${title.toLowerCase()} del módulo ${groupLabel}.`;
  }
  return subtitle;
}

// [icono del modulo] + titulo + descripcion, y la accion principal (children) a la derecha.
// El icono sale del registro central (nav/moduleIcons.js) segun la ruta; `icon` permite forzarlo.
export default function PageHeader({ title, subtitle, icon, children }) {
  const meta = useModuleMeta();

  return (
    <div className="order-[-3] space-y-4">
    <PageBreadcrumb />
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <ModuleIcon icon={icon ?? meta.icon} tone={meta.tone} size="lg" solid />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-heading">{title}</h1>
          <p className="mt-0.5 text-sm text-muted">{descripcion(subtitle, title, meta.groupLabel)}</p>
        </div>
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </header>
    </div>
  );
}
