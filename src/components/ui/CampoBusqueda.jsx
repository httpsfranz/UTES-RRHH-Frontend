import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const ESPERA_MS = 300;

// Buscador en vivo para una barra de controles (sin tarjeta propia, a diferencia de SearchInput): llama a `onBuscar` tras
// una pausa corta al escribir o al vaciarlo. Mismo aspecto de campo que los selectores de la barra.
export default function CampoBusqueda({ value, onChange, onBuscar, placeholder = 'Buscar…' }) {
  const alBuscar = useRef(onBuscar);
  useEffect(() => {
    alBuscar.current = onBuscar;
  });

  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return undefined;
    }
    const temporizador = setTimeout(() => alBuscar.current?.(), ESPERA_MS);
    return () => clearTimeout(temporizador);
  }, [value]);

  return (
    <label className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 transition-colors focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
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
        <button type="button" onClick={() => onChange('')} aria-label="Borrar búsqueda" className="shrink-0 rounded-md p-0.5 text-muted transition-colors hover:text-heading">
          <X size={15} />
        </button>
      )}
    </label>
  );
}
