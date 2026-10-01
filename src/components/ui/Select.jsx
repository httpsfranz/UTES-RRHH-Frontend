import FieldShell from './FieldShell';

// options: [{ value, label }]. Igual que Field, opera sobre form/setForm/errors
// completos para no repetir el onChange en cada Page.
export default function Select({
  form,
  setForm,
  errors = {},
  name,
  label,
  icon,
  options,
  required,
  disabled,
  placeholder = 'Selecciona…',
}) {
  const value = form[name] ?? '';
  const error = errors[name]?.[0];
  // Si ya existe una opcion "vacia" propia ("Todas las microredes") no se agrega el placeholder.
  const tieneOpcionVacia = options.some((option) => option.value === '');

  return (
    <FieldShell name={name} label={label} icon={icon} required={required} error={error}>
      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => setForm((f) => ({ ...f, [name]: event.target.value }))}
        className={`w-full rounded-xl border bg-surface py-2.5 ${error ? 'border-rose-400' : 'border-line'} ${
          icon ? 'pl-9' : 'pl-3'
        } pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10 disabled:opacity-60`}
      >
        {!tieneOpcionVacia && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
