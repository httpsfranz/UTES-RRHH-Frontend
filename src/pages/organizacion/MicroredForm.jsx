import { Building2, FileText, Hash, MapPin, Phone } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function MicroredForm({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Field form={form} setForm={setForm} errors={errors} name="MicroredCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="MicroredUbigeo" label="Ubigeo" icon={MapPin} />
      </div>
      <Field form={form} setForm={setForm} errors={errors} name="MicroredNombre" label="Nombre" icon={Building2} />
      <div className="grid grid-cols-2 gap-4">
        <Field form={form} setForm={setForm} errors={errors} name="MicroredDistrito" label="Distrito" icon={MapPin} />
        <Field form={form} setForm={setForm} errors={errors} name="MicroredTelefono" label="Teléfono" icon={Phone} />
      </div>
      <Field form={form} setForm={setForm} errors={errors} name="MicroredDireccion" label="Dirección" icon={MapPin} />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MicroredDescripcion"
        label="Descripción"
        icon={FileText}
      />
    </>
  );
}
