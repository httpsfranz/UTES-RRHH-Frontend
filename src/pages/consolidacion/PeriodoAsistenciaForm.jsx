import { CalendarDays, CalendarRange, Hash, LockKeyhole } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function PeriodoAsistenciaForm({
  form,
  setForm,
  errors,
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="anio"
          label="Año"
          icon={Hash}
        />

        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="mes"
          label="Mes"
          icon={CalendarRange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="fechaInicio"
          label="Fecha de inicio"
          icon={CalendarDays}
          type="date"
        />

        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="fechaFin"
          label="Fecha de fin"
          icon={CalendarDays}
          type="date"
        />
      </div>

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="estado"
        label="Estado"
        icon={LockKeyhole}
      />
    </>
  );
}