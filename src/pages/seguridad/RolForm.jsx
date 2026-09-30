import { FileText, Hash, Tag } from 'lucide-react';
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
          name="RolCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={50}
          filter="codigo"
          placeholder="Ej. ADMIN"
        />
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
