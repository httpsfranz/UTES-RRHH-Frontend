import { Building2, FileText, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function TipoEstablecimientoForm({ form, setForm, errors }) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoEstablecimientoCodigo"
        label="Código"
        icon={Hash}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoEstablecimientoNombre"
        label="Nombre"
        icon={Building2}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoEstablecimientoDescripcion"
        label="Descripción"
        icon={FileText}
      />
    </>
  );
}
