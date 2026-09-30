import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoPapeletaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoPapeletaCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. PERM_PARTIC"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoPapeletaNombre"
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
        name="TipoPapeletaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaEsDescontable" label="Es descontable" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaRequiereSustento" label="Requiere sustento" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaAfectaJornada" label="Afecta la jornada" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaEsCompensable" label="Es compensable" />
    </>
  );
}
