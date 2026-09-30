import { FileText, Hash, Layers } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function GrupoOcupacionalForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="GrupoOcupacionalCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="GrupoOcupacionalNombre" label="Nombre" icon={Layers} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="GrupoOcupacionalDescripcion" label="Descripción" icon={FileText} />
    </>
  );
}
