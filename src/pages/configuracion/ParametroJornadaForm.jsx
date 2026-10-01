import { CalendarDays, Clock, Hourglass } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';

export default function ParametroJornadaForm({ form, setForm, errors }) {
  const { opciones: opcionesJornada } = useOpciones('/tipos-jornada', { actual: form.TipoJornadaId });

  return (
    <>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoJornadaId"
        label="Tipo de jornada"
        icon={Clock}
        options={opcionesJornada}
        required
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ParametroJornadaVigenciaDesde"
          label="Vigente desde"
          icon={CalendarDays}
          type="date"
          required
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ParametroJornadaVigenciaHasta"
          label="Vigente hasta (opcional)"
          icon={CalendarDays}
          type="date"
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ParametroJornadaHorasDiarias"
          label="Horas diarias"
          icon={Hourglass}
          required
          maxLength={5}
          filter="decimal"
          inputMode="decimal"
          placeholder="Ej. 6"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ParametroJornadaHorasSemanales"
          label="Horas semanales"
          icon={Hourglass}
          maxLength={6}
          filter="decimal"
          inputMode="decimal"
          placeholder="Ej. 36"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ParametroJornadaHorasMensuales"
        label="Horas mensuales"
        icon={Hourglass}
        maxLength={6}
        filter="decimal"
        inputMode="decimal"
        placeholder="Ej. 150"
      />
    </>
  );
}
