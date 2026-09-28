import { Fingerprint, FileText, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function MetodoMarcacionForm({ form, setForm, errors }) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="codigo"
        label="Código"
        icon={Hash}
        placeholder="Ej. HUELLA"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="nombre"
        label="Nombre"
        icon={Fingerprint}
        placeholder="Ej. Huella dactilar"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="descripcion"
        label="Descripción"
        icon={FileText}
        placeholder="Descripción del método"
      />
    </>
  );
}
