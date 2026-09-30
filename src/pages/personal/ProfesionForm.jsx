import { FileText, GraduationCap, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

export default function ProfesionForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ProfesionCodigo" label="Código" icon={Hash} />
        <Field form={form} setForm={setForm} errors={errors} name="ProfesionNombre" label="Nombre" icon={GraduationCap} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="ProfesionDescripcion" label="Descripción" icon={FileText} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="ProfesionRequiereColegiatura" label="Requiere colegiatura" />
    </>
  );
}
