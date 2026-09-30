import { AlertTriangle, FileText, Hash, Scale, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function TipoFaltaDisciplinariaForm({
  form,
  setForm,
  errors,
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
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
          name="nombre"
          label="Nombre"
          icon={Tag}
        />
      </div>

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="gravedad"
        label="Gravedad"
        icon={AlertTriangle}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="baseLegal"
        label="Base legal"
        icon={Scale}
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