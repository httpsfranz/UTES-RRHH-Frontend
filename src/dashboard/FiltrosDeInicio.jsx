import { Building2, CalendarDays, Network } from 'lucide-react';
import { MESES } from '../utils/opciones';
import Select from '../components/ui/Select';
import Toolbar, { ToolbarItem } from '../components/ui/Toolbar';

const anios = () => {
  const actual = new Date().getFullYear();
  return Array.from({ length: 4 }, (_, i) => ({ value: String(actual - 2 + i), label: String(actual - 2 + i) }));
};

/**
 * Barra del panel de inicio: pestañas de perfil (solo si el rol da mas de uno) y filtros de periodo y ambito. Los filtros
 * de microred y establecimiento solo aparecen en los perfiles de gestion y solo ofrecen lo que el rol puede ver.
 *
 *   datos     respuesta del panel (perfiles, filtros disponibles)
 *   filtros   { perfil, anio, mes, microred_id, eess_id } como cadenas
 *   cambiar   (cambios) => void  fusiona los cambios en los filtros
 */
export default function FiltrosDeInicio({ datos, filtros, cambiar }) {
  const gestion = datos.filtros.microredes.length > 0 || datos.filtros.establecimientos.length > 0;
  const microredes = [{ value: '', label: 'Todas las microredes' }, ...datos.filtros.microredes.map((m) => ({ value: String(m.id), label: m.nombre }))];
  const establecimientos = [
    { value: '', label: 'Todos los establecimientos' },
    ...datos.filtros.establecimientos.filter((e) => !filtros.microred_id || String(e.microred_id) === filtros.microred_id).map((e) => ({ value: String(e.id), label: e.nombre })),
  ];
  // Select trabaja con form/setForm: se adapta a "fusionar cambios".
  const setForm = (actualizar) => cambiar(typeof actualizar === 'function' ? actualizar(filtros) : actualizar);
  const form = { ...filtros, perfil: datos.perfil };

  return (
    <div className="space-y-3">
      {datos.perfiles.length > 1 && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow-card)]" role="tablist">
          {datos.perfiles.map((perfil) => (
            <button
              key={perfil.clave}
              type="button"
              role="tab"
              aria-selected={perfil.clave === datos.perfil}
              onClick={() => cambiar({ perfil: perfil.clave, microred_id: '', eess_id: '' })}
              className={`rounded-xl px-4 py-1.5 text-sm font-medium transition-colors ${perfil.clave === datos.perfil ? 'bg-navy text-white shadow-sm' : 'text-slate-600 hover:bg-page'}`}
            >
              {perfil.nombre}
            </button>
          ))}
        </div>
      )}
      <Toolbar>
        <ToolbarItem ancho="md">
          <Select form={form} setForm={setForm} name="mes" label="Mes" icon={CalendarDays} options={MESES} />
        </ToolbarItem>
        <ToolbarItem ancho="sm">
          <Select form={form} setForm={setForm} name="anio" label="Año" options={anios()} />
        </ToolbarItem>
        {gestion && datos.filtros.microredes.length > 1 && (
          <ToolbarItem ancho="lg">
            <Select form={form} setForm={(actualizar) => setForm((f) => ({ ...(typeof actualizar === 'function' ? actualizar(f) : actualizar), eess_id: '' }))} name="microred_id" label="Microred" icon={Network} options={microredes} />
          </ToolbarItem>
        )}
        {gestion && datos.filtros.establecimientos.length > 1 && (
          <ToolbarItem ancho="lg">
            <Select form={form} setForm={setForm} name="eess_id" label="Establecimiento de salud" icon={Building2} options={establecimientos} />
          </ToolbarItem>
        )}
        <p className="ml-auto self-center text-xs text-muted">
          {datos.alcance} · {datos.periodo.desde.split('-').reverse().join('/')} al {datos.periodo.hasta.split('-').reverse().join('/')}
        </p>
      </Toolbar>
    </div>
  );
}
