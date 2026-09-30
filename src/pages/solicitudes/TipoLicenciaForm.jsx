import { Clock, FileBadge, FileText, Hash, Scale } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

export default function TipoLicenciaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaNombre" label="Nombre" icon={FileBadge} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaDescripcion" label="Descripción" icon={FileText} />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaMaximoDias" label="Máximo de días" icon={Clock} type="number" />
        <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaBaseLegal" label="Base legal" icon={Scale} />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoLicenciaConGoce" label="Con goce de haber" />
    </>
  );
}
