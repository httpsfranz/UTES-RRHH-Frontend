import { CalendarClock, FileText, Hospital, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import { ESTADOS_OCURRENCIA, TIPOS_OCURRENCIA } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function OcurrenciaPorteriaForm({ form, setForm, errors, editando }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', {
    actual: form.VinculoLaboralId,
    etiqueta: etiquetaVinculo,
    sinOpcion: 'Sin persona involucrada',
  });
  const esOtro = form.OcurrenciaPorteriaTipo === 'OTRO';

  return (
    <>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} required />
        <Select form={form} setForm={setForm} errors={errors} name="OcurrenciaPorteriaTipo" label="Tipo de ocurrencia" icon={ListChecks} options={TIPOS_OCURRENCIA} required />
      </FormGrid>
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="VinculoLaboralId"
        label="Persona involucrada"
        icon={UserRound}
        options={vinculos}
        required={!esOtro}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="OcurrenciaPorteriaFechaHora"
        label="Fecha y hora"
        icon={CalendarClock}
        type="datetime-local"
        required
      />
      <Textarea
        form={form}
        setForm={setForm}
        errors={errors}
        name="OcurrenciaPorteriaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={1000}
        required={esOtro}
      />
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="OcurrenciaPorteriaEstado" label="Estado" options={ESTADOS_OCURRENCIA.filter((estado) => estado.value !== 'ANULADO')} required />
      )}
      <HelpText>
        Cuaderno de ocurrencias de portería (RIT, Art. 21). Una ocurrencia no se elimina: se anula, y una vez anulada ya no se modifica.
      </HelpText>
    </>
  );
}
