import { Briefcase, FileText, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

export default function CondicionLaboralForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="CondicionLaboralCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="CondicionLaboralNombre" label="Nombre" icon={Briefcase} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="CondicionLaboralDescripcion" label="Descripción" icon={FileText} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CondicionLaboralEsPermanente" label="Es permanente" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CondicionLaboralRequiereAirhsp" label="Requiere AIRHSP" />
    </>
  );
}
