import { FileText, Fingerprint } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function MetodoMarcacionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="MetodoMarcacionNombre"
          label="Nombre"
          icon={Fingerprint}
          required
          maxLength={100}
          placeholder="Ej. Huella dactilar"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MetodoMarcacionDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
    </>
  );
}
