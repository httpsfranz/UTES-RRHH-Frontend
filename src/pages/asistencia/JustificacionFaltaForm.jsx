import { CalendarDays, FileText, Hash, ListChecks, UserCog, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function JustificacionFaltaForm({ form, setForm, errors }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const conceptos = useOpciones('/conceptos-justificacion', { actual: form.ConceptoJustificacionId });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioRegistroId, etiqueta: (usuario) => usuario.nombre });

  const concepto = conceptos.filas.find((fila) => String(fila.id) === String(form.ConceptoJustificacionId));

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <Select form={form} setForm={setForm} errors={errors} name="ConceptoJustificacionId" label="Concepto" icon={ListChecks} options={conceptos.opciones} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="JustificacionFaltaFechaInicio" label="Desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="JustificacionFaltaFechaFin" label="Hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="DocumentoSustentoId"
          label="Documento de sustento"
          icon={FileText}
          options={documentos}
          required={Boolean(concepto?.requiere_documento)}
        />
        <Field form={form} setForm={setForm} errors={errors} name="JustificacionFaltaDocumentoNumero" label="N.º de documento" icon={Hash} maxLength={60} />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="UsuarioRegistroId" label="Registrado por" icon={UserCog} options={usuarios} required />
      <Textarea form={form} setForm={setForm} errors={errors} name="JustificacionFaltaObservacion" label="Observación" icon={FileText} maxLength={1000} />
      <HelpText>
        La justificación nace pendiente y se aprueba o rechaza desde el listado. Al aprobarla, las faltas injustificadas de esos días
        pasan a "Falta justificada". Un día admite una sola justificación.
      </HelpText>
    </>
  );
}
