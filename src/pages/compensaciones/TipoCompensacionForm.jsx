import { FileText, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoCompensacionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoCompensacionNombre"
          label="Nombre"
          icon={Tag}
          required
          maxLength={150}
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoCompensacionDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
