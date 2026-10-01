import { FileBadge, FileText, Hash, Tag } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';

export default function MotivoPapeletaForm({ form, setForm, errors }) {
  const { opciones: opcionesTipo } = useOpciones('/tipos-papeleta', { actual: form.TipoPapeletaId });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="MotivoPapeletaCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. COM_REUNION"
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoPapeletaId"
          label="Tipo de papeleta"
          icon={FileBadge}
          options={opcionesTipo}
          required
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MotivoPapeletaNombre"
        label="Nombre"
        icon={Tag}
        required
        maxLength={150}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MotivoPapeletaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
