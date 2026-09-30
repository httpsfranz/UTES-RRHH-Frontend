import { CalendarDays, FileText, MapPin, Scale, Tag } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import { TIPOS_DIA_NO_LABORABLE } from '../../utils/opciones';

export default function CalendarioNoLaborableForm({ form, setForm, errors }) {
  const { opciones: opcionesMicrored } = useOpciones('/microredes', { sinOpcion: 'Toda la Red' });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="CalendarioNoLaborableFecha"
          label="Fecha"
          icon={CalendarDays}
          type="date"
          required
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="CalendarioNoLaborableTipo"
          label="Tipo"
          icon={Tag}
          options={TIPOS_DIA_NO_LABORABLE}
          required
        />
      </FormGrid>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="MicroredId"
        label="Alcance (microred)"
        icon={MapPin}
        options={opcionesMicrored}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="CalendarioNoLaborableDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="CalendarioNoLaborableNormaSustento"
        label="Norma de sustento"
        icon={Scale}
        maxLength={200}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CalendarioNoLaborableCompensable" label="Compensable" />
    </>
  );
}
