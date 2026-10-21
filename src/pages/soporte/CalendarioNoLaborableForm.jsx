import { CalendarDays, MapPin, Scale, Tag } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import HelpText from '../../components/ui/HelpText';
import FormGrid from '../../components/ui/FormGrid';
import { TIPOS_DIA_NO_LABORABLE } from '../../utils/opciones';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

export default function CalendarioNoLaborableForm({ form, setForm, errors }) {
  const { opciones: opcionesMicrored } = useOpciones('/microredes', { actual: form.MicroredId, sinOpcion: 'Toda la Red' });

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
      <Select form={form} setForm={setForm} errors={errors} name="MicroredId" label="Alcance (microred)" icon={MapPin} options={opcionesMicrored} />
      <TextoEstandar
        form={form}
        setForm={setForm}
        errors={errors}
        name="CalendarioNoLaborableDescripcion"
        opciones={TEXTOS.feriado}
        label="Descripción"
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
      <Checkbox
        form={form}
        setForm={setForm}
        errors={errors}
        name="CalendarioNoLaborableCompensable"
        label="Compensable (se recupera extendiendo la salida, RIT Art. 18)"
      />
      <HelpText>
        Si no escribes la norma se completa sola según el tipo (feriado: D. Leg. N.° 713). Al guardar se recalcula la asistencia de ese día y se avisa
        a los establecimientos.
      </HelpText>
    </>
  );
}
