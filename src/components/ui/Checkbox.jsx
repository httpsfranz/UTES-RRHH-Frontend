// Igual que Field/Select: opera sobre form/setForm/errors completos. El valor es booleano.
export default function Checkbox({ form, setForm, errors = {}, name, label }) {
  const error = errors[name]?.[0];

  return (
    <div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-heading" htmlFor={name}>
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={Boolean(form[name])}
          onChange={(event) => setForm((f) => ({ ...f, [name]: event.target.checked }))}
          className="h-4 w-4 rounded border-line accent-brand"
        />
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
