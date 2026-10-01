import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useLista } from './listaContext';
import ViewToggle from './ViewToggle';

const SELECT =
  'w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10';

function Filtro({ label, value, onChange, children }) {
  return (
    <label className="block min-w-[130px] text-[11px] font-medium text-slate-500">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className={`${SELECT} mt-1`}>
        {children}
      </select>
    </label>
  );
}

// BARRA DE FILTROS UNICA de todas las pages (tarjeta blanca):
//   - buscador en vivo (sin boton): al escribir, o al vaciarlo, vuelve a consultar solo tras una
//     pausa corta (`onSubmit` es el mismo `crud.cargar()` de siempre);
//   - Estado y selects derivados de las columnas del listado (los registra EntityList);
//   - selector de vista Tabla / Tarjetas.
const ESPERA_MS = 300;

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar por nombre o código…',
}) {
  const lista = useLista();
  const setBusqueda = lista?.setBusqueda;

  // `onSubmit` se guarda en un ref para que la consulta diferida use siempre el cierre mas reciente
  // (el que ya ve el texto actual de busqueda).
  const alEnviar = useRef(onSubmit);
  useEffect(() => {
    alEnviar.current = onSubmit;
  });

  const primera = useRef(true);
  useEffect(() => {
    setBusqueda?.(value);
    if (primera.current) {
      primera.current = false; // la carga inicial ya la hace la Page
      return undefined;
    }
    const temporizador = setTimeout(() => alEnviar.current?.(), ESPERA_MS);
    return () => clearTimeout(temporizador);
  }, [value, setBusqueda]);

  const meta = lista?.meta;

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]"
    >
      <label className="flex min-w-[220px] flex-1 items-center gap-2.5 rounded-xl border border-line bg-page/60 px-3.5 py-2.5 transition-colors focus-within:border-brand focus-within:bg-surface focus-within:ring-4 focus-within:ring-brand/10 lg:max-w-md">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-transparent text-sm text-heading outline-none placeholder:text-muted"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Borrar búsqueda"
            className="shrink-0 rounded-md p-0.5 text-muted transition-colors hover:text-heading"
          >
            <X size={15} />
          </button>
        )}
      </label>

      {meta?.conEstado && (
        <Filtro label="Estado" value={lista.estado} onChange={lista.setEstado}>
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </Filtro>
      )}

      {meta?.defs.map((def) => (
        <Filtro
          key={def.key}
          label={def.label}
          value={lista.valores[def.key] ?? ''}
          onChange={(valor) => lista.setValores((actuales) => ({ ...actuales, [def.key]: valor }))}
        >
          <option value="">Todos</option>
          {def.options.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </Filtro>
      ))}

      {meta && !meta.soloTabla && (
        <div className="ml-auto">
          <ViewToggle value={lista.vista} onChange={lista.setVista} />
        </div>
      )}
    </form>
  );
}
