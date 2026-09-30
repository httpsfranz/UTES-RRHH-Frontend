import { FileText, Hash, Shield } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function RolForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="RolCodigo" label="Código" icon={Hash} placeholder="Ej. ADMIN" />
        <Field form={form} setForm={setForm} errors={errors} name="RolNombre" label="Nombre" icon={Shield} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="RolDescripcion" label="Descripción" icon={FileText} />
    </>
  );
}
