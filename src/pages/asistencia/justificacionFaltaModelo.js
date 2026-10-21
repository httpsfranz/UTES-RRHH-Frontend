// Formulario de la justificacion de faltas: lo comparten su listado y el control de asistencia (que la abre desde la
// celda del dia con falta, con el trabajador y la fecha ya puestos).
import { formModel } from '../../hooks/useCrudResource';
import { fecha, noAnteriorA, requerido, requeridoSi, validador } from '../../utils/validaciones';

export const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  ConceptoJustificacionId: 'concepto_justificacion_id',
  DocumentoSustentoId: 'documento_sustento_id',
  JustificacionFaltaFechaInicio: 'fecha_inicio',
  JustificacionFaltaFechaFin: 'fecha_fin',
  JustificacionFaltaDocumentoNumero: 'documento_numero',
  JustificacionFaltaObservacion: 'observacion',
});

/** `conceptos` = filas del catalogo de conceptos: el documento es obligatorio solo si el concepto elegido lo exige. */
export const validarJustificacion = (conceptos) =>
  validador({
    VinculoLaboralId: [requerido],
    ConceptoJustificacionId: [requerido],
    DocumentoSustentoId: [
      requeridoSi((form) => Boolean(conceptos.find((fila) => String(fila.id) === String(form.ConceptoJustificacionId))?.requiere_documento), 'Este concepto exige adjuntar el documento de sustento.'),
    ],
    JustificacionFaltaFechaInicio: [requerido, fecha],
    JustificacionFaltaFechaFin: [requerido, fecha, noAnteriorA('JustificacionFaltaFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
  });
