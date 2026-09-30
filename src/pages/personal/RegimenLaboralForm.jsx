import { FileText, Hash, Tag, Scale } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function RegimenLaboralForm({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="RegimenLaboralCodigo"
          label="Código"
          icon={Hash}
        />

        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="RegimenLaboralNombre"
          label="Nombre"
          icon={Tag}
        />
      </div>

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="RegimenLaboralBaseLegal"
        label="Base legal"
        icon={Scale}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="RegimenLaboralDescripcion"
        label="Descripción"
        icon={FileText}
      />
    </>
  );
}