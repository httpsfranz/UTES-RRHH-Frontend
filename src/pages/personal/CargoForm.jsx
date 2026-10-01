import { Briefcase, FileText, Hash, Users } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function CargoForm({ form, setForm, errors }) {
  const { opciones: opcionesGrupo } = useOpciones('/grupos-ocupacionales', { actual: form.GrupoOcupacionalId });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="CargoCodigo"
          label="Código (opcional)"
          icon={Hash}
          maxLength={30}
          filter="codigo"
          placeholder="Ej. CG-010"
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="GrupoOcupacionalId"
          label="Grupo ocupacional"
          icon={Users}
          options={opcionesGrupo}
          required
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="CargoNombre"
        label="Nombre del cargo"
        icon={Briefcase}
        required
        maxLength={150}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="CargoDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CargoEsJefatura" label="Es un cargo de jefatura" />
    </>
  );
}
