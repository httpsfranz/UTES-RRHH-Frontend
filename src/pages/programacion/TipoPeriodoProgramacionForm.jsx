import { CalendarRange, FileText, Hash, Timer } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoPeriodoProgramacionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoPeriodoProgramacionCodigo" label="Código" icon={Hash} placeholder="Ej. MENSUAL" />
        <Field form={form} setForm={setForm} errors={errors} name="TipoPeriodoProgramacionNombre" label="Nombre" icon={CalendarRange} placeholder="Ej. Mensual" />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TipoPeriodoProgramacionDias" label="Días" icon={Timer} type="number" />
      <Field form={form} setForm={setForm} errors={errors} name="TipoPeriodoProgramacionDescripcion" label="Descripción" icon={FileText} />
    </>
  );
}
