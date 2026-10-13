import { FileText, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function RolForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="RolNombre"
          label="Nombre"
          icon={Tag}
          required
          maxLength={100}
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="RolDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
