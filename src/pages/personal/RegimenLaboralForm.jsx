import { FileText, Hash, Scale, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function RegimenLaboralForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="RegimenLaboralCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. DL276"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="RegimenLaboralNombre"
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
        name="RegimenLaboralBaseLegal"
        label="Base legal"
        icon={Scale}
        maxLength={150}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="RegimenLaboralDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
    </>
  );
}
