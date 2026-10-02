import { CalendarDays, Fingerprint, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function AutorizacionMetodoForm({ form, setForm, errors }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { actual: form.TrabajadorId, etiqueta: etiquetaTrabajador });
  const { opciones: metodos } = useOpciones('/metodos-marcacion', { actual: form.MetodoMarcacionId });

  return (
    <>
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="TrabajadorId"
        label="Trabajador"
        icon={UserRound}
        options={trabajadores}
        required
      />
      <Select form={form} setForm={setForm} errors={errors} name="MetodoMarcacionId" label="Método de marcación" icon={Fingerprint} options={metodos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="AutorizacionMetodoFechaInicio" label="Vigente desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="AutorizacionMetodoFechaFin" label="Vigente hasta" icon={CalendarDays} type="date" />
      </FormGrid>
      <HelpText>
        El RIT (Art. 21) establece el reconocimiento facial como única forma de marcar; cualquier otro método requiere esta autorización
        expresa. Deja la fecha final vacía si no tiene vencimiento.
      </HelpText>
    </>
  );
}
