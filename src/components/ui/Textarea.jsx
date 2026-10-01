import FieldShell from './FieldShell';

export default function Textarea({
  form,
  setForm,
  errors = {},
  name,
  label,
  icon,
  placeholder,
  rows = 3,
  required,
  maxLength,
}) {
  const value = form[name] ?? '';
  const error = errors[name]?.[0];

  return (
    <FieldShell name={name} label={label} icon={icon} iconPosition="top" required={required} error={error}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => setForm((f) => ({ ...f, [name]: event.target.value }))}
        className={`w-full resize-none rounded-xl border bg-surface py-2.5 ${error ? 'border-rose-400' : 'border-line'} ${
          icon ? 'pl-9' : 'pl-3'
        } pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10`}
      />
    </FieldShell>
  );
}
