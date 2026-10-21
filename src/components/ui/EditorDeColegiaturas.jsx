import { Award, CalendarDays, Hash, Plus, Trash2 } from 'lucide-react';
import Field from './Field';
import Select from './Select';
import Checkbox from './Checkbox';
import HelpText from './HelpText';

import { OTRO } from '../../utils/colegiaturas';

const filaVacia = () => ({ ColegiaturaId: '', ColegiaturaTipoId: '', ColegiaturaTipoNuevo: '', ColegiaturaNumero: '', ColegiaturaFechaColegiatura: '', ColegiaturaFechaVencimiento: '', ColegiaturaEsPrincipal: false });

/**
 * Colegiaturas del trabajador DENTRO de su formulario: colegio (o "Otro" para escribir uno que aun no existe y que se
 * crea al guardar), numero, fechas y si es la principal. `filas` vive en form.Colegiaturas.
 *
 *   opciones   [{ value, label }] colegios activos (se agrega "Otro")
 *   errores    errores del backend: { 'Colegiaturas.0.ColegiaturaNumero': [...], Colegiaturas: [...] }
 */
export default function EditorDeColegiaturas({ filas = [], onChange, opciones, errores = {} }) {
  const cambiar = (i, actualizar) => onChange(filas.map((fila, j) => (j === i ? actualizar(fila) : fila)));
  const erroresDe = (i) =>
    Object.fromEntries(
      Object.entries(errores)
        .filter(([clave]) => clave.startsWith(`Colegiaturas.${i}.`))
        .map(([clave, mensajes]) => [clave.split('.').pop(), mensajes]),
    );

  return (
    <fieldset className="space-y-3 rounded-2xl border border-line-soft p-4">
      <legend className="px-1 text-sm font-semibold text-heading">Colegiaturas</legend>
      {filas.length === 0 && <HelpText>Sin colegiaturas. Agrega una si la profesión exige colegiatura (CMP, CEP, COP…).</HelpText>}
      {filas.map((fila, i) => {
        const esOtro = fila.ColegiaturaTipoId === OTRO;
        const setFila = (fn) => cambiar(i, (f) => (typeof fn === 'function' ? fn(f) : fn));
        const errs = erroresDe(i);
        return (
          <div key={fila.ColegiaturaId || `nueva-${i}`} className="space-y-3 rounded-xl bg-page/60 p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Select form={fila} setForm={setFila} errors={errs} name="ColegiaturaTipoId" label="Colegio profesional" icon={Award} options={[...opciones, { value: OTRO, label: 'Otro (escribir)…' }]} required />
              {esOtro ? (
                <Field form={fila} setForm={setFila} errors={errs} name="ColegiaturaTipoNuevo" label="Nombre del colegio" icon={Award} maxLength={150} required placeholder="Ej. Colegio de Biólogos del Perú" />
              ) : (
                <Field form={fila} setForm={setFila} errors={errs} name="ColegiaturaNumero" label="N° de colegiatura" icon={Hash} maxLength={30} filter="codigo" required />
              )}
            </div>
            {esOtro && <Field form={fila} setForm={setFila} errors={errs} name="ColegiaturaNumero" label="N° de colegiatura" icon={Hash} maxLength={30} filter="codigo" required />}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field form={fila} setForm={setFila} errors={errs} name="ColegiaturaFechaColegiatura" label="Fecha de colegiatura" icon={CalendarDays} type="date" />
              <Field form={fila} setForm={setFila} errors={errs} name="ColegiaturaFechaVencimiento" label="Vence (habilitación)" icon={CalendarDays} type="date" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Checkbox form={fila} setForm={setFila} errors={errs} name="ColegiaturaEsPrincipal" label="Es la colegiatura principal" />
              <button type="button" onClick={() => onChange(filas.filter((_, j) => j !== i))} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50">
                <Trash2 size={14} /> Quitar
              </button>
            </div>
          </div>
        );
      })}
      {errores.Colegiaturas && <p className="text-xs text-rose-600">{errores.Colegiaturas[0]}</p>}
      <button type="button" onClick={() => onChange([...filas, filaVacia()])} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand/10">
        <Plus size={15} /> Agregar colegiatura
      </button>
    </fieldset>
  );
}

