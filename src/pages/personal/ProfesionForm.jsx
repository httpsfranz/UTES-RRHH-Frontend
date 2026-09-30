import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function ProfesionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ProfesionCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. ENFERMERIA"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ProfesionNombre"
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
        name="ProfesionDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="ProfesionRequiereColegiatura" label="Requiere colegiatura" />
    </>
  );
}
