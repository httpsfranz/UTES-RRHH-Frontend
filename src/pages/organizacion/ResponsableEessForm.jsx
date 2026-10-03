import { CalendarDays, FileText, Hash, Hospital, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function ResponsableEessForm({ form, setForm, errors }) {
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId });
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: tipos } = useOpciones('/tipos-responsabilidad', { actual: form.TipoResponsabilidadId });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="EessId" label="Establecimiento" icon={Hospital} options={establecimientos} required />
      <Select form={form} setForm={setForm} errors={errors} name="TipoResponsabilidadId" label="Responsabilidad" icon={ListChecks} options={tipos} required />
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Responsable (vínculo)" icon={UserRound} options={vinculos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ResponsableEessFechaInicio" label="Desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="ResponsableEessFechaFin" label="Hasta" icon={CalendarDays} type="date" />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ResponsableEessDocumentoNumero" label="N.º de resolución o memorando" icon={Hash} maxLength={60} />
        <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento de designación" icon={FileText} options={documentos} />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="ResponsableEessObservacion" label="Observación" icon={FileText} maxLength={500} />
      <HelpText>
        Cada establecimiento tiene un solo responsable vigente por tipo de responsabilidad. Para cambiarlo, cierra la designación anterior con
        su fecha de fin y crea la nueva: así se conserva el historial.
      </HelpText>
    </>
  );
}
