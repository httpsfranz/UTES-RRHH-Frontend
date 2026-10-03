import { CalendarDays, Clock, FileText, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function InformeGuardiaComunitariaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <Field form={form} setForm={setForm} errors={errors} name="InformeGuardiaComunitariaFecha" label="Fecha de la guardia" icon={CalendarDays} type="date" required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="InformeGuardiaComunitariaHoraInicio" label="Hora de inicio" icon={Clock} type="time" />
        <Field form={form} setForm={setForm} errors={errors} name="InformeGuardiaComunitariaHoraFin" label="Hora de fin" icon={Clock} type="time" />
      </FormGrid>
      <Textarea
        form={form}
        setForm={setForm}
        errors={errors}
        name="InformeGuardiaComunitariaDescripcion"
        label="Actividades realizadas"
        icon={FileText}
        maxLength={1000}
        required
      />
      <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Informe visado (escaneado)" icon={FileText} options={documentos} />
      <HelpText>
        La guardia comunitaria la realiza el personal del D.L. 276 y el SERUMS; dura hasta 12 horas. El informe se entrega de forma personal,
        visado por el jefe del establecimiento, hasta el día 05 de cada mes (RIT, Art. 20).
      </HelpText>
    </>
  );
}
