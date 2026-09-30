import { AlignLeft, FileText, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function ParametroSistemaForm({
  form,
  setForm,
  errors,
}) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="codigo"
        label="Código"
        icon={Hash}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="valor"
        label="Valor"
        icon={AlignLeft}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="descripcion"
        label="Descripción"
        icon={FileText}
      />
    </>
  );
}