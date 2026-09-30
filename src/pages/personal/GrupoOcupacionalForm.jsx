import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function GrupoOcupacionalForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="GrupoOcupacionalCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. TECNICO"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="GrupoOcupacionalNombre"
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
        name="GrupoOcupacionalDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
    </>
  );
}
