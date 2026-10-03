import { CalendarDays, CalendarClock, FileText, Hourglass, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function AsistenciaDiariaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: estados } = useOpciones('/estados-asistencia', { actual: form.EstadoAsistenciaId });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaFecha" label="Fecha" icon={CalendarDays} type="date" required />
        <Select form={form} setForm={setForm} errors={errors} name="EstadoAsistenciaId" label="Estado de asistencia" icon={ListChecks} options={estados} required />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaHoraEntrada" label="Hora de entrada" icon={CalendarClock} type="datetime-local" />
        <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaHoraSalida" label="Hora de salida" icon={CalendarClock} type="datetime-local" />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaMinutosTardanza" label="Minutos de tardanza" icon={Hourglass} maxLength={4} filter="digitos" />
        <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaMinutosFalta" label="Minutos de falta" icon={Hourglass} maxLength={4} filter="digitos" />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaMinutosExtra" label="Minutos extra" icon={Hourglass} maxLength={4} filter="digitos" />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="AsistenciaDiariaMinutosTrabajados"
          label="Minutos trabajados"
          icon={Hourglass}
          maxLength={4}
          filter="digitos"
          placeholder="Automático (salida − entrada)"
        />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="AsistenciaDiariaObservacion" label="Observación" icon={FileText} maxLength={1000} />
      <HelpText>
        Una fila por trabajador y fecha. La salida puede ser del día siguiente (guardia nocturna). Los períodos de asistencia cerrados no
        admiten cambios. Para justificar una falta usa la pantalla de Justificación de faltas.
      </HelpText>
    </>
  );
}
