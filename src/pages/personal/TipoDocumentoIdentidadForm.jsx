import { Hash, IdCard, Ruler, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

export default function TipoDocumentoIdentidadForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoDocumentoIdentidadCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="TipoDocumentoIdentidadNombre" label="Nombre" icon={IdCard} />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoDocumentoIdentidadAbreviatura" label="Abreviatura" icon={Tag} />
        <Field form={form} setForm={setForm} errors={errors} name="TipoDocumentoIdentidadLongitud" label="Longitud" icon={Ruler} type="number" />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoDocumentoIdentidadEstado" label="Estado activo" />
    </>
  );
}
