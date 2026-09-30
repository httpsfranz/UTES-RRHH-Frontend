import { Building2, FileText, Hash, MapPin, Phone } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function MicroredForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="MicroredCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. MR-LE"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="MicroredUbigeo"
          label="Ubigeo"
          icon={MapPin}
          maxLength={6}
          filter="digitos"
          placeholder="6 dígitos, Ej. 130105"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MicroredNombre"
        label="Nombre"
        icon={Building2}
        required
        maxLength={150}
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="MicroredDistrito"
          label="Distrito"
          icon={MapPin}
          maxLength={100}
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="MicroredTelefono"
          label="Teléfono"
          icon={Phone}
          maxLength={9}
          filter="digitos"
          inputMode="tel"
          placeholder="9 dígitos, Ej. 987654321"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MicroredDireccion"
        label="Dirección"
        icon={MapPin}
        maxLength={300}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MicroredDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
