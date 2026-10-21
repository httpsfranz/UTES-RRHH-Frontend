import { useState } from 'react';
import { OTRO } from '../../utils/textosEstandar';
import FieldShell from './FieldShell';

const BASE = 'w-full rounded-xl border bg-surface py-2.5 pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10';

/**
 * Campo de detalle (motivo, observacion, resultado) con opciones estandarizadas: se elige de la lista y solo con "Otro"
 * aparece el cuadro para escribirlo a mano. Guarda el texto en form[name], igual que un Textarea, asi que el Request y
 * los errores de la API no cambian. Un valor guardado que no esta en la lista (registros antiguos) se muestra como "Otro".
 *
 *   opciones    lista de textos (ver utils/textosEstandar)
 *   variante    'lista' (combobox, por defecto) | 'radios' (pocas opciones a la vista: p. ej. el motivo de una baja)
 *   required    sin el, la lista ofrece "Sin especificar" (valor vacio)
 */
export default function TextoEstandar({ form, setForm, errors = {}, name, label, opciones, required, maxLength = 500, variante = 'lista', placeholder }) {
  const valor = form[name] ?? '';
  const error = errors[name]?.[0];
  const [eligioOtro, setEligioOtro] = useState(false);
  const enOtro = eligioOtro || (valor !== '' && !opciones.includes(valor));
  const seleccion = enOtro ? OTRO : valor;
  const poner = (texto) => setForm((f) => ({ ...f, [name]: texto }));

  function elegir(opcion) {
    setEligioOtro(opcion === OTRO);
    poner(opcion === OTRO ? '' : opcion);
  }

  const libre = enOtro && (
    <textarea
      id={`${name}-otro`}
      name={name}
      rows={2}
      value={valor}
      maxLength={maxLength}
      autoFocus={eligioOtro}
      placeholder={placeholder ?? 'Escribe el detalle'}
      aria-label={`${label}: detalle`}
      aria-invalid={error ? true : undefined}
      onChange={(event) => poner(event.target.value)}
      className={`${BASE} mt-2 resize-none pl-3 ${error ? 'border-rose-400' : 'border-line'}`}
    />
  );

  if (variante === 'radios') {
    return (
      <FieldShell name={`${name}-0`} label={label} required={required} error={error}>
        <div role="radiogroup" aria-label={label} className="flex flex-col gap-1.5">
          {[...opciones, OTRO].map((opcion, i) => (
            <label
              key={opcion}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                seleccion === opcion ? 'border-brand bg-brand-soft text-heading' : 'border-line text-heading hover:border-brand/50'
              }`}
            >
              <input
                type="radio"
                id={`${name}-${i}`}
                name={`${name}-opcion`}
                checked={seleccion === opcion}
                onChange={() => elegir(opcion)}
                className="h-4 w-4 accent-brand"
              />
              {opcion === OTRO ? 'Otro (especificar)' : opcion}
            </label>
          ))}
        </div>
        {libre}
      </FieldShell>
    );
  }

  return (
    <FieldShell name={name} label={label} required={required} error={error}>
      <select
        id={name}
        value={seleccion}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => elegir(event.target.value)}
        className={`${BASE} pl-3 ${error ? 'border-rose-400' : 'border-line'}`}
      >
        <option value="" disabled={required} hidden={required}>
          {required ? 'Selecciona…' : 'Sin especificar'}
        </option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
        <option value={OTRO}>Otro (especificar)</option>
      </select>
      {libre}
    </FieldShell>
  );
}
