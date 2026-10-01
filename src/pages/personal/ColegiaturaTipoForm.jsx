import { Building, FileText, GraduationCap, Hash, IdCard } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';

export default function ColegiaturaTipoForm({ form, setForm, errors }) {
  const { opciones: opcionesProfesion } = useOpciones('/profesiones', { actual: form.ProfesionId, sinOpcion: 'Sin profesión asociada' });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ColegiaturaTipoCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={20}
          filter="codigo"
          placeholder="Ej. CMP"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ColegiaturaTipoNombre"
          label="Nombre"
          icon={IdCard}
          required
          maxLength={150}
        />
      </FormGrid>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="ProfesionId"
        label="Profesión"
        icon={GraduationCap}
        options={opcionesProfesion}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ColegiaturaTipoEntidad"
        label="Entidad"
        icon={Building}
        maxLength={200}
        placeholder="Ej. Colegio Médico del Perú"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ColegiaturaTipoDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
