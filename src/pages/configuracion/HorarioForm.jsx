import { Clock, FileText, Hash, Hospital, Tag } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function HorarioForm({ form, setForm, errors }) {
  const { opciones: opcionesJornada } = useOpciones('/tipos-jornada', { actual: form.TipoJornadaId });
  const { opciones: opcionesEess } = useOpciones('/establecimientos', { actual: form.EessId, sinOpcion: 'Toda la Red (institucional)' });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="HorarioCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. HOR-ADM-LV"
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoJornadaId"
          label="Tipo de jornada"
          icon={Clock}
          options={opcionesJornada}
          required
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="HorarioNombre"
        label="Nombre"
        icon={Tag}
        required
        maxLength={150}
      />
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessId"
        label="Establecimiento"
        icon={Hospital}
        options={opcionesEess}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="HorarioDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="HorarioEsRotativo" label="Es rotativo" />
    </>
  );
}
