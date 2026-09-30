import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function ConceptoJustificacionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConceptoJustificacionCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. DESCANSO_MED"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ConceptoJustificacionNombre"
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
        name="ConceptoJustificacionDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="ConceptoJustificacionRequiereDocumento" label="Requiere documento de sustento" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="ConceptoJustificacionEsRemunerado" label="Es remunerado" />
    </>
  );
}
