import { ClipboardList, FileText, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

export default function TipoPapeletaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoPapeletaCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="TipoPapeletaNombre" label="Nombre" icon={ClipboardList} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="TipoPapeletaDescripcion" label="Descripción" icon={FileText} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaEsDescontable" label="Es descontable" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaRequiereSustento" label="Requiere sustento" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaAfectaJornada" label="Afecta la jornada" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoPapeletaEsCompensable" label="Es compensable" />
    </>
  );
}
