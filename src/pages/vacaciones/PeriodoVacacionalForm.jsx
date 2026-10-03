import { CalendarDays, ListChecks, Palmtree, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ESTADOS_PERIODO_VACACIONAL } from '../../utils/opciones';
import { etiquetaVinculo } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

export default function PeriodoVacacionalForm({ form, setForm, errors, editando }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <Field form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalAnio" label="Año del récord" icon={CalendarDays} required maxLength={4} filter="digitos" />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalFechaInicio" label="Récord desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalFechaFin" label="Récord hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalDiasGanados" label="Días ganados" icon={Palmtree} maxLength={5} filter="decimal" inputMode="decimal" placeholder="30" />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="PeriodoVacacionalDiasDisponibles"
          label="Días disponibles"
          icon={Palmtree}
          maxLength={5}
          filter="decimal"
          inputMode="decimal"
          placeholder="Igual a los ganados"
        />
      </FormGrid>
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalEstado" label="Estado" icon={ListChecks} options={ESTADOS_PERIODO_VACACIONAL.filter((e) => e.value !== 'ANULADO')} required />
      )}
      <HelpText>
        El servidor tiene derecho a 30 días calendario de descanso remunerado por cada año completo de servicios (RIT, Art. 68). Los días
        disponibles son los ganados menos los gozados; si no los indicas, se toman todos los ganados.
      </HelpText>
    </>
  );
}
