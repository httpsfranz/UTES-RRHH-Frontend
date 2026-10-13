// Formulario de la asistencia diaria: lo comparten la vista de lista y la de calendario (cada una con su propio
// useCrudResource, pero con el mismo modelo, validacion y textos).
import { formModel } from '../../hooks/useCrudResource';
import { entero, fecha, noFutura, requerido, validador } from '../../utils/validaciones';
import { aCampoFecha, formatoFecha } from '../../utils/formato';

const modelo = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  EstadoAsistenciaId: 'estado_asistencia_id',
  AsistenciaDiariaFecha: 'fecha',
  AsistenciaDiariaHoraEntrada: 'hora_entrada',
  AsistenciaDiariaHoraSalida: 'hora_salida',
  AsistenciaDiariaMinutosTardanza: ['minutos_tardanza', 0],
  AsistenciaDiariaMinutosFalta: ['minutos_falta', 0],
  AsistenciaDiariaMinutosExtra: ['minutos_extra', 0],
  // Vacio = el backend lo calcula (salida - entrada). Al editar tambien arranca vacio para recalcularse.
  AsistenciaDiariaMinutosTrabajados: 'minutos_trabajados_manual',
  AsistenciaDiariaObservacion: 'observacion',
});

export const emptyForm = modelo.emptyForm;

export const mapToForm = (item) => ({
  ...modelo.mapToForm(item),
  AsistenciaDiariaHoraEntrada: aCampoFecha(item.hora_entrada),
  AsistenciaDiariaHoraSalida: aCampoFecha(item.hora_salida),
  AsistenciaDiariaMinutosTardanza: String(item.minutos_tardanza ?? 0),
  AsistenciaDiariaMinutosFalta: String(item.minutos_falta ?? 0),
  AsistenciaDiariaMinutosExtra: String(item.minutos_extra ?? 0),
});

const minutos = entero({ min: 0, max: 1440 });

export const validate = validador({
  VinculoLaboralId: [requerido],
  EstadoAsistenciaId: [requerido],
  AsistenciaDiariaFecha: [requerido, fecha, noFutura('La asistencia no puede registrarse para una fecha futura.')],
  AsistenciaDiariaHoraSalida: [(valor, form) => (form.AsistenciaDiariaHoraEntrada && valor < form.AsistenciaDiariaHoraEntrada ? 'La salida no puede ser anterior a la entrada.' : null)],
  AsistenciaDiariaMinutosTardanza: [minutos],
  AsistenciaDiariaMinutosFalta: [minutos],
  AsistenciaDiariaMinutosExtra: [minutos],
  AsistenciaDiariaMinutosTrabajados: [minutos],
});

export const buildConfirmMessage = (item) => `¿Eliminar la asistencia de ${item.trabajador?.nombre_completo ?? ''} del ${formatoFecha(item.fecha)}?`;

export const deactivateErrorMessage = 'No se pudo eliminar la asistencia.';
