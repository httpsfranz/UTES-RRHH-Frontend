import { CalendarDays, FileText, Gavel, Hash, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ESTADOS_PAD, SIGUIENTES_PAD } from '../../utils/opciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function ExpedientePadForm({ form, setForm, errors, estadoActual }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: tipos } = useOpciones('/tipos-falta-disciplinaria', {
    actual: form.TipoFaltaDisciplinariaId,
    etiqueta: (tipo) => `${tipo.nombre}${tipo.gravedad ? ` (${tipo.gravedad.toLowerCase().replace('_', ' ')})` : ''}`,
  });
  const { opciones: documentos } = useOpciones('/documentos-sustento', {
    params: {},
    sinOpcion: 'Sin documento adjunto',
    etiqueta: (documento) => documento.nombre,
  });

  // El procedimiento avanza: desde la etapa actual solo se ofrecen las siguientes permitidas.
  const siguientes = estadoActual ? SIGUIENTES_PAD[estadoActual] : null;
  const etapas = siguientes ? ESTADOS_PAD.filter((e) => siguientes.includes(e.value)) : null;
  const resolviendo = form.ExpedientePadEstado === 'RESUELTO';
  const terminando = resolviendo || form.ExpedientePadEstado === 'ARCHIVADO';

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Servidor (vínculo)" icon={UserRound} options={vinculos} required />
      <Select form={form} setForm={setForm} errors={errors} name="TipoFaltaDisciplinariaId" label="Falta imputada" icon={Gavel} options={tipos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ExpedientePadNumero" label="N.º de expediente" icon={Hash} maxLength={50} placeholder="Ej. PAD-2026-005" />
        <Select form={form} setForm={setForm} errors={errors} name="DocumentoSustentoId" label="Documento de inicio" icon={FileText} options={documentos} />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ExpedientePadFechaInicio" label="Inicio del procedimiento" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="ExpedientePadFechaFin" label="Fin del procedimiento" icon={CalendarDays} type="date" required={terminando} />
      </FormGrid>
      {etapas && <Select form={form} setForm={setForm} errors={errors} name="ExpedientePadEstado" label="Etapa" icon={ListChecks} options={etapas} required />}
      {(resolviendo || form.ExpedientePadSancion) && (
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="ExpedientePadSancion"
          label="Sanción"
          icon={Gavel}
          required={resolviendo}
          maxLength={300}
          placeholder="Ej. Suspensión sin goce de remuneraciones por 15 días"
        />
      )}
      <Textarea form={form} setForm={setForm} errors={errors} name="ExpedientePadDescripcion" label="Descripción de los hechos" icon={FileText} maxLength={1500} />
      <HelpText>
        Procedimiento de la Ley 30057 (RIT, Art. 100 a 107). Avanza de iniciado a en proceso y termina resuelto (con una sanción: amonestación
        escrita, suspensión sin goce de remuneraciones o destitución) o archivado. Terminado, el expediente ya no se modifica.
      </HelpText>
    </>
  );
}
