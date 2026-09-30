import { Hash, Tag, Type } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoDocumentoIdentidadForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoDocumentoIdentidadCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={20}
          filter="codigo"
          placeholder="Ej. DNI"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoDocumentoIdentidadNombre"
          label="Nombre"
          icon={Tag}
          required
          maxLength={100}
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoDocumentoIdentidadAbreviatura"
          label="Abreviatura"
          icon={Type}
          maxLength={20}
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoDocumentoIdentidadLongitud"
          label="Longitud del número"
          icon={Hash}
          maxLength={2}
          filter="digitos"
          placeholder="Ej. 8"
        />
      </FormGrid>
    </>
  );
}
