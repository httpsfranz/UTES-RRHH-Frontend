import { CalendarCheck, Hourglass, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { MESES, ESTADOS_CONSOLIDADO } from '../../utils/opciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function ConsolidadoAsistenciaForm({ form, setForm, errors, editando }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const { opciones: periodos } = useOpciones('/periodos-asistencia', {
    params: {},
    actual: form.PeriodoAsistenciaId,
    etiqueta: (p) => `${MESES.find((m) => m.value === String(p.mes))?.label ?? p.mes} ${p.anio} (${p.estado})`,
  });

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="PeriodoAsistenciaId" label="Período de asistencia" icon={CalendarCheck} options={periodos} required />
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ConsolidadoAsistenciaDiasTrabajados" label="Días trabajados" icon={CalendarCheck} maxLength={5} filter="decimal" inputMode="decimal" />
        <Field form={form} setForm={setForm} errors={errors} name="ConsolidadoAsistenciaDiasFalta" label="Días de falta" icon={CalendarCheck} maxLength={5} filter="decimal" inputMode="decimal" />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="ConsolidadoAsistenciaDiasFaltaJustificada" label="Días de falta justificada" icon={CalendarCheck} maxLength={5} filter="decimal" inputMode="decimal" />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ConsolidadoAsistenciaMinutosTardanza" label="Minutos de tardanza" icon={Hourglass} maxLength={5} filter="digitos" />
        <Field form={form} setForm={setForm} errors={errors} name="ConsolidadoAsistenciaMinutosExtra" label="Minutos de sobretiempo" icon={Hourglass} maxLength={5} filter="digitos" />
      </FormGrid>
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="ConsolidadoAsistenciaEstado" label="Estado" icon={ListChecks} options={ESTADOS_CONSOLIDADO} required />
      )}
      <HelpText>
        Lo habitual es usar &quot;Generar consolidado&quot;, que calcula estos valores desde la asistencia diaria. Aquí se corrigen a mano mientras el
        período no esté cerrado; un consolidado conforme o cerrado ya no se modifica.
      </HelpText>
    </>
  );
}
