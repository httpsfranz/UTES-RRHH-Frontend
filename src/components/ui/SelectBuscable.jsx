import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import FieldShell from './FieldShell';

const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

// Select con buscador, para relaciones con muchos registros (trabajadores, vinculos): se escribe parte del
// nombre o del documento y la lista se filtra. Misma interfaz que Select (form/setForm/errors/name/options);
// el valor guardado en el formulario es el `value` de la opcion elegida.
//
// options: [{ value, label }]. Una opcion con value '' ("Sin ...") siempre se ofrece primero.
export default function SelectBuscable({
  form,
  setForm,
  errors = {},
  name,
  label,
  icon,
  options,
  required,
  disabled,
  placeholder = 'Escribe para buscar…',
}) {
  const listaId = useId();
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState(null); // null = no se esta escribiendo: se muestra la opcion elegida
  const [indice, setIndice] = useState(0);

  const value = form[name] ?? '';
  const error = errors[name]?.[0];
  const elegida = options.find((option) => String(option.value) === String(value) && option.value !== '');
  const mostrado = texto ?? elegida?.label ?? '';

  const consulta = normalizar(texto ?? '');
  const visibles = options.filter((option) => option.value === '' || normalizar(option.label).includes(consulta));

  function elegir(option) {
    setForm((f) => ({ ...f, [name]: option.value }));
    setTexto(null);
    setAbierto(false);
  }

  function alTeclear(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setAbierto(true);
      setIndice((i) => Math.min(i + 1, visibles.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIndice((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && abierto) {
      // Con la lista abierta, Enter elige la opcion resaltada en vez de enviar el formulario.
      event.preventDefault();
      if (visibles[indice]) elegir(visibles[indice]);
    } else if (event.key === 'Escape' && abierto) {
      event.stopPropagation();
      setAbierto(false);
      setTexto(null);
    }
  }

  return (
    <FieldShell name={name} label={label} icon={icon} required={required} error={error}>
      <input
        id={name}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={abierto}
        aria-controls={listaId}
        aria-autocomplete="list"
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        value={mostrado}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onFocus={() => setAbierto(true)}
        onClick={(event) => {
          setAbierto(true);
          // Con una opcion elegida, el primer clic selecciona su texto: lo que se escriba lo reemplaza en vez de pegarse a el.
          if (texto === null) event.target.select();
        }}
        onBlur={() => {
          setAbierto(false);
          setTexto(null);
        }}
        onChange={(event) => {
          setTexto(event.target.value);
          setIndice(0);
          setAbierto(true);
        }}
        onKeyDown={alTeclear}
        className={`w-full rounded-xl border bg-surface py-2.5 ${error ? 'border-rose-400' : 'border-line'} ${
          icon ? 'pl-9' : 'pl-3'
        } pr-9 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60`}
      />
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      {abierto && !disabled && (
        <ul
          id={listaId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-xl border border-line bg-surface py-1 shadow-[var(--shadow-pop)]"
        >
          {visibles.length === 0 && <li className="px-3 py-2 text-sm text-muted">Sin coincidencias.</li>}
          {visibles.map((option, posicion) => (
            <li
              key={option.value === '' ? 'vacio' : option.value}
              role="option"
              aria-selected={String(option.value) === String(value)}
              // onMouseDown (y no onClick): se ejecuta antes del blur del input, que cerraria la lista.
              onMouseDown={(event) => {
                event.preventDefault();
                elegir(option);
              }}
              onMouseEnter={() => setIndice(posicion)}
              className={`cursor-pointer px-3 py-2 text-sm text-heading ${posicion === indice ? 'bg-page' : ''} ${
                String(option.value) === String(value) ? 'font-semibold' : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </FieldShell>
  );
}
