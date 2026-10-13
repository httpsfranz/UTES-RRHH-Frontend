import { Pencil, Plus, Trash2 } from 'lucide-react';
import { formatoFecha } from '../../utils/formato';
import Modal from '../../components/Modal';
import Button from '../../components/ui/Button';
import DatosDeRegistro from '../../components/ui/DatosDeRegistro';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import HelpText from '../../components/ui/HelpText';

const ORIGENES = { CALCULADO: 'Calculada por el sistema', MANUAL: 'Registrada o corregida a mano' };

/**
 * Detalle de un dia del calendario de asistencia. Con registro permite editarlo o eliminarlo; sin registro, registrarlo.
 * `seleccion` = { trabajador, dia, celda } de la celda pulsada (null = cerrado).
 */
export default function CeldaAsistenciaModal({ seleccion, onClose, onEditar, onEliminar, onRegistrar }) {
  const { trabajador, dia, celda } = seleccion ?? {};
  const registrada = Boolean(celda?.asistencia_id);

  return (
    <Modal open={Boolean(seleccion)} onClose={onClose} title={seleccion ? `${trabajador.nombre} · ${formatoFecha(dia.fecha)}` : ''}>
      {seleccion && (
        <>
          <DatosDeRegistro
            items={[
              { label: 'DNI', value: trabajador.dni },
              { label: 'Cargo', value: `${trabajador.cargo} · ${trabajador.condicion}` },
              { label: 'Día', value: dia.no_laborable ? `${dia.dia_semana} (${dia.no_laborable.descripcion ?? dia.no_laborable.tipo})` : dia.dia_semana },
              { label: 'Turno', value: celda.turno },
              { label: 'Estado', value: celda.vacia ? 'Sin turno ni registro' : (celda.estado_nombre ?? 'Turno programado, sin registro de asistencia') },
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
          {celda.origen === 'CALCULADO' && <HelpText>Si la corriges a mano, el cálculo automático ya no la vuelve a sobrescribir.</HelpText>}
          <AccionesDeModal>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            {registrada ? (
              <>
                <Button variant="secondary" icon={Trash2} onClick={() => onEliminar(seleccion)}>
                  Eliminar
                </Button>
                <Button icon={Pencil} onClick={() => onEditar(seleccion)}>
                  Editar
                </Button>
              </>
            ) : (
              <Button icon={Plus} onClick={() => onRegistrar(seleccion)}>
                Registrar asistencia
              </Button>
            )}
          </AccionesDeModal>
        </>
      )}
    </Modal>
  );
}
