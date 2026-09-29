import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function ConceptoDescuentoForm({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConceptoDescuentoCodigo"
          label="Código"
          icon={Hash}
        />

        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConceptoDescuentoNombre"
          label="Nombre"
          icon={Tag}
        />
      </div>

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ConceptoDescuentoDescripcion"
        label="Descripción"
        icon={FileText}
      />
    </>
  );
}