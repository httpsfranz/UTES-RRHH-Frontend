import { CalendarDays, ListChecks, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { ESTADOS_PERIODO_VACACIONAL } from '../../utils/opciones';
import { etiquetaVinculo, formatoFecha } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import HelpText from '../../components/ui/HelpText';
import { finDelRecord } from '../../utils/vacaciones';

// El record solo pide desde cuando corre: el fin (un año despues), el año del record y los 30 dias los pone el sistema.
export default function PeriodoVacacionalForm({ form, setForm, errors, editando }) {
  const { opciones: vinculos } = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });
  const fin = finDelRecord(form.PeriodoVacacionalFechaInicio);

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={vinculos} required />
      <Field form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalFechaInicio" label="El récord empieza el" icon={CalendarDays} type="date" required />
      {editando && (
        <Select form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalEstado" label="Estado" icon={ListChecks} options={ESTADOS_PERIODO_VACACIONAL.filter((e) => e.value !== 'ANULADO')} required />
      )}
      <HelpText>
        {fin ? `El récord va del ${formatoFecha(form.PeriodoVacacionalFechaInicio)} al ${formatoFecha(fin)} y es el récord ${fin.slice(0, 4)}. ` : ''}
        Cada año completo de servicios da derecho a 30 días calendario de descanso (RIT, Art. 68); los días disponibles se descuentan solos
        al aprobar cada goce.
      </HelpText>
    </>
  );
}
