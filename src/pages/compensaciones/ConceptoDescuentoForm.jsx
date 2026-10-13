import { FileText, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function ConceptoDescuentoForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConceptoDescuentoNombre"
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
        name="ConceptoDescuentoDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
