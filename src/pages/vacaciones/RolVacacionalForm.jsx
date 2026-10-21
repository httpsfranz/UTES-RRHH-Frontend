import { CalendarDays, Palmtree } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { diasCalendario } from '../../utils/formato';
import Field from '../../components/ui/Field';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

const etiquetaPeriodo = (periodo) =>
  `${periodo.trabajador?.nombre_completo ?? 'Trabajador'} · récord ${periodo.anio} · ${periodo.dias_disponibles} de ${periodo.dias_ganados} días disponibles`;

// Se elige el descanso con sus fechas (desde - hasta): los dias calendario se calculan solos.
export default function RolVacacionalForm({ form, setForm, errors }) {
  // Solo se programa el goce de un periodo vacacional abierto.
  const periodos = useOpciones('/periodos-vacacionales', { params: { estado: 'ABIERTO' }, actual: form.PeriodoVacacionalId, etiqueta: etiquetaPeriodo });
  const dias = diasCalendario(form.RolVacacionalFechaProgramada, form.RolVacacionalFechaFinProgramada);

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalId" label="Récord vacacional del trabajador" icon={Palmtree} options={periodos.opciones} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="RolVacacionalFechaProgramada" label="Descanso desde" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="RolVacacionalFechaFinProgramada" label="Descanso hasta" icon={CalendarDays} type="date" required />
      </FormGrid>
      <HelpText>
        {dias ? `Son ${dias} día${dias === 1 ? '' : 's'} calendario. ` : ''}
        RIT, Art. 68 a 74: 30 días por año completo de servicios, preferentemente continuos; pueden fraccionarse en tramos de 7 días o más, y
        hasta 7 días en tramos menores. El rol del año siguiente se aprueba en noviembre (Art. 71).
      </HelpText>
    </>
  );
}
