import { CalendarDays, FileText, Hash, Stethoscope, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function DescansoMedicoForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="DescansoMedicoFechaInicio" label="Desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="DescansoMedicoFechaFin" label="Hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="DescansoMedicoNumeroCitt" label="N.º de CITT" icon={Hash} maxLength={60} placeholder="Ej. CITT-4471" />
        <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Certificado o CITT escaneado" icon={FileText} options={documentos} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="DescansoMedicoDiagnostico" label="Diagnóstico" icon={Stethoscope} maxLength={300} />
      <Textarea form={form} setForm={setForm} errors={errors} name="DescansoMedicoObservacion" label="Observación" icon={FileText} maxLength={1000} />
      <HelpText>
        El descanso médico nace de un CITT o certificado y no se aprueba sin ninguno de los dos. Al registrarlo, Recursos Humanos puede
        disponer la constatación domiciliaria (RIT, Art. 23).
      </HelpText>
    </>
  );
}
