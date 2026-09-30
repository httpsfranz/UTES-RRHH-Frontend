import { Building2, FileText, Hash, MapPin, Phone } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function MicroredForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="MicroredCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="MicroredUbigeo" label="Ubigeo" icon={MapPin} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="MicroredNombre" label="Nombre" icon={Building2} />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="MicroredDistrito" label="Distrito" icon={MapPin} />
        <Field form={form} setForm={setForm} errors={errors} name="MicroredTelefono" label="Teléfono" icon={Phone} />
      </FormGrid>
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
