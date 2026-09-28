import FieldShell from './FieldShell';

// Recibe el estado del formulario completo (form/setForm/errors) en vez de
// value/onChange/error sueltos: en las paginas CRUD el formulario siempre viene
// de un useState({...}) + los errores 422 de Laravel ({campo: ['mensaje']}), asi
// que cada <Field> solo necesita saber su "name" para leerse y actualizarse solo.
export default function Field({ form, setForm, errors = {}, name, label, icon, placeholder, type = 'text' }) {
  const value = form[name] ?? '';
  const error = errors[name]?.[0];

  return (
    <FieldShell name={name} label={label} icon={icon} error={error}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => setForm((f) => ({ ...f, [name]: event.target.value }))}
        className={`w-full rounded-xl border border-line bg-surface py-2 ${
          icon ? 'pl-9' : 'pl-3'
        } pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10`}
      />
    </FieldShell>
  );
}
