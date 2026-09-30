import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoPeriodoProgramacionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoPeriodoProgramacionCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. MENSUAL"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoPeriodoProgramacionNombre"
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
        name="TipoPeriodoProgramacionDias"
        label="Días (referencial)"
        icon={Hash}
        maxLength={3}
        filter="digitos"
        placeholder="Ej. 30"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoPeriodoProgramacionDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
    </>
  );
}
