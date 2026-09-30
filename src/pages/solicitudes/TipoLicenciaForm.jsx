import { FileText, Hash, Scale, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoLicenciaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. MATERNIDAD"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaNombre"
          label="Nombre"
          icon={Tag}
          required
          maxLength={150}
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoLicenciaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaMaximoDias"
          label="Máximo de días"
          icon={Hash}
          maxLength={4}
          filter="digitos"
          placeholder="Vacío = sin límite"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaBaseLegal"
          label="Base legal"
          icon={Scale}
          maxLength={200}
        />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoLicenciaConGoce" label="Con goce de haber" />
    </>
  );
}
