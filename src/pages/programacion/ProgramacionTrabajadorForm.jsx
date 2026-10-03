import { CalendarRange, FileText, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaVinculo, formatoFecha } from '../../utils/formato';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import HelpText from '../../components/ui/HelpText';

const etiquetaPeriodo = (periodo) =>
  `${periodo.eess?.nombre ?? 'Establecimiento'} · ${periodo.tipo_periodo?.nombre ?? ''} · ${formatoFecha(periodo.fecha_inicio)} – ${formatoFecha(periodo.fecha_fin)}`;

export default function ProgramacionTrabajadorForm({ form, setForm, errors }) {
  // Solo se programa en una programacion en borrador: publicada, ya no se modifica (RIT, Art. 16).
  const periodos = useOpciones('/programaciones-periodo', { params: { estado: 'BORRADOR' }, actual: form.ProgramacionPeriodoId, etiqueta: etiquetaPeriodo });
  const vinculos = useOpciones('/vinculos-laborales', { actual: form.VinculoLaboralId, etiqueta: etiquetaVinculo });

  // El trabajador se programa en su propio establecimiento: al elegir la programacion se acota la lista.
  const periodo = periodos.filas.find((fila) => String(fila.id) === String(form.ProgramacionPeriodoId));
  const delEstablecimiento = periodo
    ? vinculos.filas.filter((vinculo) => vinculo.eess_id === periodo.eess_id || String(vinculo.id) === String(form.VinculoLaboralId))
    : vinculos.filas;
  const opcionesVinculo = vinculos.opciones.filter((opcion) => delEstablecimiento.some((vinculo) => String(vinculo.id) === String(opcion.value)));

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="ProgramacionPeriodoId" label="Programación del período" icon={CalendarRange} options={periodos.opciones} required />
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="VinculoLaboralId" label="Trabajador (vínculo)" icon={UserRound} options={opcionesVinculo} required />
      <Textarea form={form} setForm={setForm} errors={errors} name="ProgramacionTrabajadorObservacion" label="Observación" icon={FileText} maxLength={500} />
      <HelpText>
        RIT, Art. 16: remitida la programación, queda prohibida cualquier modificación de los turnos; por eso solo se agrega personal a una
        programación en borrador. Las horas programadas las calcula el sistema con los turnos del trabajador.
      </HelpText>
    </>
  );
}
