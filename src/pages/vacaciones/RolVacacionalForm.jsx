import { CalendarDays, Palmtree } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { finDelDescanso, formatoFecha } from '../../utils/formato';
import Field from '../../components/ui/Field';
import SelectBuscable from '../../components/ui/SelectBuscable';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

const etiquetaPeriodo = (periodo) =>
  `${periodo.trabajador?.nombre_completo ?? 'Trabajador'} · récord ${periodo.anio} · ${periodo.dias_disponibles} de ${periodo.dias_ganados} días disponibles`;

export default function RolVacacionalForm({ form, setForm, errors }) {
  // Solo se programa el goce de un periodo vacacional abierto.
  const periodos = useOpciones('/periodos-vacacionales', { params: { estado: 'ABIERTO' }, actual: form.PeriodoVacacionalId, etiqueta: etiquetaPeriodo });
  const fin = finDelDescanso(form.RolVacacionalFechaProgramada, form.RolVacacionalDias);

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="PeriodoVacacionalId" label="Período vacacional" icon={Palmtree} options={periodos.opciones} required />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="RolVacacionalFechaProgramada" label="Inicio del descanso" icon={CalendarDays} type="date" required />
        <Field form={form} setForm={setForm} errors={errors} name="RolVacacionalDias" label="Días calendario" icon={Palmtree} required maxLength={2} filter="digitos" placeholder="1 a 30" />
      </FormGrid>
      <HelpText>
        {fin ? `El descanso termina el ${formatoFecha(fin)}. ` : ''}
        RIT, Art. 68 a 74: 30 días calendario por año completo de servicios. El descanso es preferentemente continuo; puede fraccionarse en
        tramos de 7 días o más, y hasta 7 días en tramos menores. El trabajador no puede tener dos descansos a la vez.
      </HelpText>
    </>
  );
}
