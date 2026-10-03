import { CalendarClock, CalendarDays, FileText, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function AsignacionHorarioForm({ form, setForm, errors }) {
  const vinculos = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const horarios = useOpciones('/horarios', {
    actual: form.HorarioId,
    etiqueta: (h) => `${h.nombre}${h.eess ? ` — ${h.eess.nombre}` : ' — toda la Red'}${h.activo === false ? ' (inactivo)' : ''}`,
  });

  // Un horario propio de un establecimiento solo se ofrece a quien trabaja en ese establecimiento.
  const vinculo = vinculos.filas.find((fila) => String(fila.id) === String(form.VinculoLaboralId));
  const opcionesHorario = horarios.filas
    .filter((h) => !vinculo || !h.eess_id || h.eess_id === vinculo.eess_id || String(h.id) === String(form.HorarioId))
    .map((h) => ({ value: h.id, label: horarios.opciones.find((o) => String(o.value) === String(h.id))?.label ?? h.nombre }));

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos.opciones} required />
      <Select form={form} setForm={setForm} errors={errors} name="HorarioId" label="Horario" icon={CalendarClock} options={opcionesHorario} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="AsignacionHorarioFechaInicio" label="Vigente desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="AsignacionHorarioFechaFin" label="Vigente hasta" icon={CalendarDays} type="date" />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="AsignacionHorarioObservacion" label="Observación" icon={FileText} maxLength={500} />
      <HelpText>
        Un trabajador tiene un solo horario vigente. Para cambiarlo, cierra la asignación actual con su fecha de fin y crea la nueva a
        continuación: así se conserva el historial.
      </HelpText>
    </>
  );
}
