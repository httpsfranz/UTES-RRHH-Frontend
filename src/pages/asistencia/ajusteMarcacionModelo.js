// Formulario de la solicitud de ajuste de marcacion: lo comparten su listado y el control de asistencia (que la abre
// desde la celda del dia, limitada a las marcas de ese trabajador ese dia).
import { formModel } from '../../hooks/useCrudResource';
import { fechaHoraNoFutura, requerido, validador } from '../../utils/validaciones';
import { aCampoFecha } from '../../utils/formato';

const modelo = formModel({
  MarcacionId: 'marcacion_id',
  DocumentoSustentoId: 'documento_sustento_id',
  AjusteMarcacionFechaHoraNueva: 'fecha_hora_nueva',
  AjusteMarcacionMotivo: 'motivo',
});

export const { emptyForm } = modelo;
export const mapToForm = (item) => ({ ...modelo.mapToForm(item), AjusteMarcacionFechaHoraNueva: aCampoFecha(item.fecha_hora_nueva) });

export const validarAjuste = validador({
  MarcacionId: [requerido],
  AjusteMarcacionMotivo: [requerido],
  AjusteMarcacionFechaHoraNueva: [(valor) => fechaHoraNoFutura(valor)?.replace('La ocurrencia', 'La marcación')],
});
