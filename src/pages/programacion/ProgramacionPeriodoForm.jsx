import { CalendarDays, FileText, Hash, Hospital, ListChecks, UserCog } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { MESES } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function ProgramacionPeriodoForm({ form, setForm, errors }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const tipos = useOpciones('/tipos-periodo-programacion', { actual: form.TipoPeriodoProgramacionId });
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioRegistroId, etiqueta: (usuario) => usuario.nombre });

  const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoPeriodoProgramacionId))?.codigo;
  const conMes = ['MENSUAL', 'QUINCENAL', 'SEMANAL'].includes(tipo);
  const conNumero = tipo === 'QUINCENAL' || tipo === 'SEMANAL';
  const numeros = tipo === 'QUINCENAL' ? ['1', '2'] : ['1', '2', '3', '4', '5'];

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} required />
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="TipoPeriodoProgramacionId" label="Tipo de período" icon={ListChecks} options={tipos.opciones} required />
        <Field form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoCodigo" label="Código (opcional)" icon={Hash} maxLength={50} filter="codigo" placeholder="Ej. PGM-LE-2026-11" />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoAnio" label="Año" icon={CalendarDays} maxLength={4} filter="digitos" required />
        {conMes && (
          <Select form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoMes" label="Mes" icon={CalendarDays} options={MESES} required />
        )}
      </FormGrid>
      {conNumero && (
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="ProgramacionPeriodoNumero"
          label={tipo === 'QUINCENAL' ? 'Quincena' : 'Semana'}
          icon={Hash}
          options={numeros.map((n) => ({ value: n, label: n }))}
          required
        />
      )}
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoFechaInicio" label="Desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoFechaFin" label="Hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="UsuarioRegistroId" label="Elaborada por" icon={UserCog} options={usuarios} required />
      <Textarea form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoObservacion" label="Observación" icon={FileText} maxLength={1000} />
      <HelpText>
        Mensual: el mes completo. Quincenal: del 1 al 15 o del 16 al fin de mes. Semanal: hasta 7 días dentro del mes. Una vez publicada, la
        programación ya no se modifica (RIT, Art. 16).
      </HelpText>
    </>
  );
}
