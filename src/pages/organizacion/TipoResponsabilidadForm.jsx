import { FileText, Hash, UserCheck } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoResponsabilidadForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoResponsabilidadCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="TipoResponsabilidadNombre" label="Nombre" icon={UserCheck} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TipoResponsabilidadDescripcion" label="Descripción" icon={FileText} />
    </>
  );
}
