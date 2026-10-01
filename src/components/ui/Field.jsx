import FieldShell from './FieldShell';
import { aplicarFiltro } from '../../utils/filtros';

// Recibe el estado del formulario completo (form/setForm/errors) en vez de
// value/onChange/error sueltos: en las paginas CRUD el formulario siempre viene
// de un useState({...}) + los errores 422 de Laravel ({campo: ['mensaje']}), asi
// que cada <Field> solo necesita saber su "name" para leerse y actualizarse solo.
//
// Props de validacion de usuario (el backend valida igual):
//   required   marca el campo con * (la regla en si va en validate de la Page)
//   maxLength  largo maximo de la columna: el navegador no deja escribir mas
//   filter     limpia lo escrito mientras se escribe: 'digitos' | 'codigo' | 'ip'
//   inputMode  teclado movil: 'numeric' | 'tel' | 'decimal' | 'email'...
export default function Field({
  form,
  setForm,
  errors = {},
  name,
  label,
  icon,
  placeholder,
  type = 'text',
  required,
  maxLength,
  filter,
  inputMode,
}) {
  const value = form[name] ?? '';
  const error = errors[name]?.[0];

  return (
    <FieldShell name={name} label={label} icon={icon} required={required} error={error}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode ?? (filter === 'digitos' ? 'numeric' : undefined)}
        autoComplete="off"
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => {
          const nuevo = filter ? aplicarFiltro(filter, event.target.value) : event.target.value;
          setForm((f) => ({ ...f, [name]: nuevo }));
        }}
        className={`w-full rounded-xl border bg-surface py-2.5 ${error ? 'border-rose-400' : 'border-line'} ${
          icon ? 'pl-9' : 'pl-3'
        } pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10`}
      />
    </FieldShell>
  );
}
