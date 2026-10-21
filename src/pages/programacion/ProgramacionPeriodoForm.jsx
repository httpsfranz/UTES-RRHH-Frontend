import { CalendarDays, Hospital, ListChecks } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

export default function ProgramacionPeriodoForm({ form, setForm, errors }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const tipos = useOpciones('/tipos-periodo-programacion', { actual: form.TipoPeriodoProgramacionId });

  return (
    <>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessId"
        label="Establecimiento"
        icon={Hospital}
        options={establecimientos}
        required
      />
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoPeriodoProgramacionId"
        label="Tipo de período"
        icon={ListChecks}
        options={tipos.opciones}
        required
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ProgramacionPeriodoFechaInicio"
          label="Desde"
          icon={CalendarDays}
          type="date"
          required
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ProgramacionPeriodoFechaFin"
          label="Hasta"
          icon={CalendarDays}
          type="date"
          required
        />
      </FormGrid>
      <TextoEstandar
        form={form}
        setForm={setForm}
        errors={errors}
        name="ProgramacionPeriodoObservacion"
        opciones={TEXTOS.observacionProgramacion}
        label="Observación"
        maxLength={1000}
      />
      <HelpText>
        Mensual: el mes completo. Quincenal: del 1 al 15 o del 16 al fin de mes. Semanal: hasta 7 días dentro del mes. El año, el mes y el número de
        quincena o semana se toman de la fecha de inicio. Una vez publicada, la programación ya no se modifica (RIT, Art. 16).
      </HelpText>
    </>
  );
}
