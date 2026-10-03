import { CalendarClock, FileSpreadsheet, FileText, Fingerprint, ListChecks, MapPin, Monitor, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import { TIPOS_MARCACION } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function MarcacionForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: metodos } = useOpciones('/metodos-marcacion', { actual: form.MetodoMarcacionId });
  const { opciones: dispositivos } = useOpciones('/dispositivos-marcacion', { actual: form.DispositivoMarcacionId, sinOpcion: 'Sin dispositivo' });
  const { opciones: cargas } = useOpciones('/cargas-asistencia-manual', {
    params: {},
    actual: form.CargaAsistenciaManualId,
    sinOpcion: 'No viene de un parte diario',
    etiqueta: (carga) => `${carga.nombre_archivo ?? `Carga ${carga.id}`} (${carga.estado})`,
  });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="MarcacionTipo" label="Tipo de marcación" icon={ListChecks} options={TIPOS_MARCACION} required />
        <Field form={form} setForm={setForm} errors={errors} name="MarcacionFechaHora" label="Fecha y hora" icon={CalendarClock} type="datetime-local" required />
      </FormGrid>
      <FormGrid>
        <Select form={form} setForm={setForm} errors={errors} name="MetodoMarcacionId" label="Método" icon={Fingerprint} options={metodos} required />
        <Select form={form} setForm={setForm} errors={errors} name="DispositivoMarcacionId" label="Dispositivo" icon={Monitor} options={dispositivos} />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="CargaAsistenciaManualId" label="Parte diario cargado" icon={FileSpreadsheet} options={cargas} />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="MarcacionGeolocalizacion"
        label="Geolocalización"
        icon={MapPin}
        maxLength={100}
        placeholder="Latitud,longitud. Ej. -8.1116,-79.0288"
      />
      <Field form={form} setForm={setForm} errors={errors} name="MarcacionObservacion" label="Observación" icon={FileText} maxLength={500} />
      <HelpText>
        El RIT (Art. 21) establece el reconocimiento facial como única forma de registro: otro método requiere una autorización vigente del
        trabajador o, si el establecimiento no tiene equipo, un parte diario cargado (método Registro manual).
      </HelpText>
    </>
  );
}
