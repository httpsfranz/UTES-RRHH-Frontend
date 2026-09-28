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
  placeholder = 'Selecciona…',
}) {
  const value = form[name] ?? '';
  const error = errors[name]?.[0];

  return (
    <FieldShell name={name} label={label} icon={icon} error={error}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => setForm((f) => ({ ...f, [name]: event.target.value }))}
        className={`w-full rounded-xl border border-line bg-surface py-2 ${
          icon ? 'pl-9' : 'pl-3'
        } pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
