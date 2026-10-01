import { usePermisosDeRol } from '../../hooks/usePermisosDeRol';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import CheckboxGroup from '../../components/ui/CheckboxGroup';
import HelpText from '../../components/ui/HelpText';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

// Agrupa los permisos por modulo (los que no tienen modulo van a "General").
function porModulo(permisos) {
  const grupos = new Map();
  for (const permiso of permisos) {
    const modulo = permiso.modulo ?? 'General';
    grupos.set(modulo, [...(grupos.get(modulo) ?? []), permiso]);
  }
  return [...grupos.entries()];
}

/**
 * Asignacion de permisos de un rol (tabla puente Seguridad.RolPermiso), dentro de la pantalla de Roles.
 * `rol` null = cerrado. Al guardar reemplaza el conjunto completo de permisos del rol.
 */
export default function RolPermisosModal({ rol, onClose, onGuardado }) {
  const permisosDelRol = usePermisosDeRol(rol, {
    alGuardar: () => {
      onGuardado?.();
      onClose();
    },
  });
  const { permisos, seleccionados, cargando, guardando, error, alternar, alternarGrupo, guardar } = permisosDelRol;

  return (
    <Modal open={Boolean(rol)} onClose={onClose} title={rol ? `Permisos del rol "${rol.nombre}"` : ''}>
      <Form onSubmit={guardar} generalError={error}>
        {cargando ? (
          <LoadingState message="Cargando permisos…" />
        ) : permisos.length === 0 ? (
          <EmptyState message="No hay permisos activos para asignar." />
        ) : (
          <>
            <HelpText>
              {seleccionados.length} de {permisos.length} permisos seleccionados. Los cambios se aplican al guardar.
            </HelpText>
            {porModulo(permisos).map(([modulo, lista]) => (
              <CheckboxGroup
                key={modulo}
                title={modulo}
                options={lista.map((permiso) => ({ value: permiso.id, label: permiso.nombre, description: permiso.codigo }))}
                selected={seleccionados}
                onToggle={alternar}
                onToggleAll={alternarGrupo}
              />
            ))}
          </>
        )}
        <FormActions onCancel={onClose} submitting={guardando} />
      </Form>
    </Modal>
  );
}
