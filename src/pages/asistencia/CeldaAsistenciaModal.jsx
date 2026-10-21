import { FileCheck, LogIn, LogOut, PenLine } from 'lucide-react';
import { formatoFecha } from '../../utils/formato';
import { estadoDelDia } from '../../utils/marcacion';
import Modal from '../../components/Modal';
import Button from '../../components/ui/Button';
import DatosDeRegistro from '../../components/ui/DatosDeRegistro';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import HelpText from '../../components/ui/HelpText';

const ORIGENES = { CALCULADO: 'Calculada por el sistema', MANUAL: 'Registrada o corregida a mano' };

/**
 * Detalle de un dia del calendario de asistencia (celda personal - dia). Si el dia es HOY y el usuario puede marcar,
 * ofrece "Marcar entrada" o "Marcar salida": la hora la registra el servidor al pulsar, no se escribe. El resultado de un
 * dia ya calculado no se edita a mano: se corrige por las vias del RIT, que pasan por aprobacion:
 *   - Justificar falta (falta, omision de marcacion, guardia no realizada): abre la justificacion con trabajador y fecha.
 *   - Solicitar ajuste de marcacion (el dia tiene marcas): abre el ajuste limitado a las marcas de ese dia.
 * onJustificar / onAjustar llegan en null si la sesion no tiene permiso para registrarlos.
 * `seleccion` = { trabajador, dia, celda, puedeMarcar } de la celda pulsada (null = cerrado).
 */
export default function CeldaAsistenciaModal({ seleccion, marcando, onClose, onMarcar, onJustificar, onAjustar }) {
  const { trabajador, dia, celda, puedeMarcar } = seleccion ?? {};
  const registrada = Boolean(celda?.asistencia_id);
  const estado = seleccion && puedeMarcar ? estadoDelDia(trabajador, celda) : null;
  const marcas = puedeMarcar ? (trabajador?.marcas ?? []) : [];
  const justificable = celda?.categoria === 'falta' && onJustificar;
  const ajustable = Boolean(celda?.hora_entrada || celda?.hora_salida) && onAjustar;

  return (
    <Modal open={Boolean(seleccion)} onClose={onClose} title={seleccion ? `${trabajador.nombre} · ${formatoFecha(dia.fecha)}` : ''}>
      {seleccion && (
        <>
          <DatosDeRegistro
            items={[
              { label: 'DNI', value: trabajador.dni },
              { label: 'Cargo', value: `${trabajador.cargo} · ${trabajador.condicion}` },
              { label: 'Día', value: dia.no_laborable ? `${dia.dia_semana} (${dia.no_laborable.descripcion ?? dia.no_laborable.tipo})` : dia.dia_semana },
              { label: 'Horario', value: celda.horario ?? celda.turno },
              { label: 'Estado', value: estado?.etiqueta ?? (celda.vacia ? 'Sin turno ni registro' : (celda.estado_nombre ?? 'Turno programado, sin registro de asistencia')) },
              { label: 'Marcas de hoy', value: marcas.length ? marcas.map((m) => `${m.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} ${m.hora}`).join(' · ') : null },
              { label: 'Entrada', value: celda.hora_entrada },
              { label: 'Salida', value: celda.hora_entrada ? (celda.hora_salida ?? 'sin salida') : null },
              { label: 'Tardanza', value: celda.minutos_tardanza ? `${celda.minutos_tardanza} min (descuento)` : null },
              { label: 'Falta', value: celda.minutos_falta ? `${celda.minutos_falta} min` : null },
              { label: 'Sobretiempo', value: celda.minutos_extra ? `${celda.minutos_extra} min` : null },
              { label: 'Trabajados', value: registrada ? `${celda.minutos_trabajados} min` : null },
              { label: 'Origen', value: ORIGENES[celda.origen] },
              { label: 'Observación', value: celda.observacion },
            ]}
          />
          {estado?.accion && <HelpText>La marca se registra con la hora del sistema en el momento en que la pulsas.</HelpText>}
          {!estado?.accion && (justificable || ajustable) && (
            <HelpText>La justificación y el ajuste quedan pendientes hasta que los aprueba el jefe o RRHH; al aprobarse, el día se recalcula solo.</HelpText>
          )}
          <AccionesDeModal>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            {estado?.accion ? (
              <Button icon={estado.accion === 'SALIDA' ? LogOut : LogIn} disabled={marcando === trabajador.vinculo_id} onClick={() => onMarcar(trabajador, estado.accion)}>
                {estado.accion === 'SALIDA' ? 'Marcar salida' : 'Marcar entrada'}
              </Button>
            ) : (
              <>
                {ajustable && (
                  <Button variant="secondary" icon={PenLine} onClick={() => onAjustar(seleccion)}>
                    Solicitar ajuste
                  </Button>
                )}
                {justificable && (
                  <Button icon={FileCheck} onClick={() => onJustificar(seleccion)}>
                    Justificar falta
                  </Button>
                )}
              </>
            )}
          </AccionesDeModal>
        </>
      )}
    </Modal>
  );
}
