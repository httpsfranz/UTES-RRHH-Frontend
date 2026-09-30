import { CalendarDays, CalendarRange, Hash, LockKeyhole } from 'lucide-react';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import { ESTADOS_PERIODO, MESES } from '../../utils/opciones';

export default function PeriodoAsistenciaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="PeriodoAsistenciaAnio"
          label="Año"
          icon={Hash}
          required
          maxLength={4}
          filter="digitos"
          placeholder="Ej. 2026"
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="PeriodoAsistenciaMes"
          label="Mes"
          icon={CalendarRange}
          options={MESES}
          required
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="PeriodoAsistenciaFechaInicio"
          label="Fecha de inicio"
          icon={CalendarDays}
          type="date"
          required
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="PeriodoAsistenciaFechaFin"
          label="Fecha de fin"
          icon={CalendarDays}
          type="date"
          required
        />
      </FormGrid>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="PeriodoAsistenciaEstado"
        label="Estado"
        icon={LockKeyhole}
        options={ESTADOS_PERIODO}
        required
      />
    </>
  );
}
