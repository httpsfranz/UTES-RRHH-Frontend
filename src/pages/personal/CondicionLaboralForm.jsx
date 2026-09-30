import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function CondicionLaboralForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="CondicionLaboralCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. NOMBRADO"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="CondicionLaboralNombre"
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
        name="CondicionLaboralDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CondicionLaboralEsPermanente" label="Es permanente" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CondicionLaboralRequiereAirhsp" label="Requiere registro AIRHSP" />
    </>
  );
}
