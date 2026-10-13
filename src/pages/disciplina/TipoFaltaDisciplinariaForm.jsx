import { AlertTriangle, FileText, Scale, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import { GRAVEDADES } from '../../utils/opciones';

export default function TipoFaltaDisciplinariaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoFaltaDisciplinariaGravedad"
          label="Gravedad"
          icon={AlertTriangle}
          options={[{ value: '', label: 'Sin clasificar' }, ...GRAVEDADES]}
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoFaltaDisciplinariaNombre"
        label="Nombre"
        icon={Tag}
        required
        maxLength={150}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoFaltaDisciplinariaBaseLegal"
        label="Base legal"
        icon={Scale}
        maxLength={200}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoFaltaDisciplinariaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
