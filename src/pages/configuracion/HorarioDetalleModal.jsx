import { useDetalleDeHorario } from '../../hooks/useDetalleDeHorario';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import MatrizSemanal from '../../components/ui/MatrizSemanal';
import HelpText from '../../components/ui/HelpText';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

const detalleDeTurno = (turno) =>
  `${turno.hora_entrada} – ${turno.hora_salida}${turno.activo === false ? ' (inactivo)' : ''}`;

/**
 * Detalle semanal de un horario (tabla Configuracion.HorarioDetalle), dentro de la pantalla de Horarios.
 * `horario` null = cerrado. Al guardar reemplaza la grilla completa del horario.
 */
export default function HorarioDetalleModal({ horario, onClose, onGuardado }) {
  const detalle = useDetalleDeHorario(horario, {
    alGuardar: () => {
      onGuardado?.();
      onClose();
    },
  });
  const { turnos, valorDe, cambiar, total, cargando, guardando, error, guardar } = detalle;

  return (
    <Modal open={Boolean(horario)} onClose={onClose} title={horario ? `Detalle semanal de "${horario.nombre}"` : ''} size="lg">
      <Form onSubmit={guardar} generalError={error}>
        {cargando ? (
          <LoadingState message="Cargando detalle del horario…" />
        ) : turnos.length === 0 ? (
          <EmptyState message="No hay turnos activos para asignar. Registra turnos primero." />
        ) : (
          <>
            <HelpText>
              Haz clic en una celda para alternar entre: sin asignar, trabaja y descanso. {total} celda{total === 1 ? '' : 's'} asignada
              {total === 1 ? '' : 's'}. Los cambios se aplican al guardar.
            </HelpText>
            <MatrizSemanal
              filas={turnos.map((turno) => ({ id: turno.id, titulo: turno.nombre, detalle: detalleDeTurno(turno) }))}
              valorDe={valorDe}
              onCambiar={cambiar}
            />
          </>
        )}
        <FormActions onCancel={onClose} submitting={guardando} />
      </Form>
    </Modal>
  );
}
