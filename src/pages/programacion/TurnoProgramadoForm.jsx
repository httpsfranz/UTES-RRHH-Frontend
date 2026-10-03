import { CalendarDays, Clock, FileText, UsersRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { formatoFecha } from '../../utils/formato';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import Textarea from '../../components/ui/Textarea';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

const etiquetaProgramacion = (item) =>
  `${item.trabajador?.nombre_completo ?? 'Trabajador'} · ${item.periodo ? `${formatoFecha(item.periodo.fecha_inicio)} – ${formatoFecha(item.periodo.fecha_fin)}` : ''}`;

const etiquetaTurno = (turno) => `${turno.nombre} (${turno.hora_entrada} – ${turno.hora_salida})${turno.activo === false ? ' (inactivo)' : ''}`;

export default function TurnoProgramadoForm({ form, setForm, errors }) {
  // Solo se programan turnos en una programacion en borrador (RIT, Art. 16).
  const programaciones = useOpciones('/programaciones-trabajador', { params: { estado: 'BORRADOR' }, actual: form.ProgramacionTrabajadorId, etiqueta: etiquetaProgramacion });
  const turnos = useOpciones('/turnos', { actual: form.TurnoId, etiqueta: etiquetaTurno });

  const programacion = programaciones.filas.find((fila) => String(fila.id) === String(form.ProgramacionTrabajadorId));
  const turno = turnos.filas.find((fila) => String(fila.id) === String(form.TurnoId));

  // Un turno de guardia es siempre una guardia: al elegirlo se marca solo.
  const elegirTurno = (actualizar) =>
    setForm((anterior) => {
      const nuevo = typeof actualizar === 'function' ? actualizar(anterior) : actualizar;
      return turnos.filas.find((fila) => String(fila.id) === String(nuevo.TurnoId))?.es_guardia ? { ...nuevo, TurnoProgramadoEsGuardia: true } : nuevo;
    });

  return (
    <>
      <SelectBuscable form={form} setForm={setForm} errors={errors} name="ProgramacionTrabajadorId" label="Trabajador programado" icon={UsersRound} options={programaciones.opciones} required />
      <Select form={form} setForm={elegirTurno} errors={errors} name="TurnoId" label="Turno" icon={Clock} options={turnos.opciones} required />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TurnoProgramadoFecha"
        label="Fecha"
        icon={CalendarDays}
        type="date"
        required
      />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TurnoProgramadoHoraEntrada" label="Entrada propia (opcional)" icon={Clock} type="time" />
        <Field form={form} setForm={setForm} errors={errors} name="TurnoProgramadoHoraSalida" label="Salida propia (opcional)" icon={Clock} type="time" />
      </FormGrid>
      <Checkbox
        form={form}
        setForm={setForm}
        errors={errors}
        name="TurnoProgramadoEsGuardia"
        label={turno?.es_guardia ? 'Es una guardia (el turno elegido lo es)' : 'Es una guardia'}
      />
      <Textarea form={form} setForm={setForm} errors={errors} name="TurnoProgramadoObservacion" label="Observación" icon={FileText} maxLength={500} />
      <HelpText>
        {programacion?.periodo
          ? `La fecha debe estar entre el ${formatoFecha(programacion.periodo.fecha_inicio)} y el ${formatoFecha(programacion.periodo.fecha_fin)}. `
          : ''}
        Sin horas propias se usan las del turno. Un turno dura como máximo 12 horas, el trabajador no puede estar en dos turnos a la vez ni
        acumular 24 horas continuas, y la guardia la hace solo el personal D.L. 276 y el SERUMS (RIT, Art. 20).
      </HelpText>
    </>
  );
}
