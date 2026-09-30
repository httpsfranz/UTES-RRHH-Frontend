import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoCompensacionForm({
  form,
  setForm,
  errors,
}) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="codigo"
          label="Código"
          icon={Hash}
        />

        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="nombre"
          label="Nombre"
          icon={Tag}
        />
      </FormGrid>

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="descripcion"
        label="Descripción"
        icon={FileText}
      />
    </>
  );
}