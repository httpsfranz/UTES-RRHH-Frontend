import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function EstadoAsistenciaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="EstadoAsistenciaCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. TARDANZA"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="EstadoAsistenciaNombre"
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
        name="EstadoAsistenciaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="EstadoAsistenciaEsFalta" label="Es una falta (justificable)" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="EstadoAsistenciaEsDescontable" label="Es descontable" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="EstadoAsistenciaEsLaborable" label="Es día laborable" />
    </>
  );
}
