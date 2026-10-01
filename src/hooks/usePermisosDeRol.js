import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError, traerTodo } from '../api/paginado';

/**
 * Permisos de un rol (tabla puente Seguridad.RolPermiso): carga el catalogo de permisos activos y los
 * que el rol ya tiene, deja marcar/desmarcar y guarda el conjunto completo con una sola llamada
 * (PUT /roles/{id}/permisos), que el backend aplica en una transaccion.
 *
 * `rol` es el registro del rol o null (modal cerrado: no se hace ninguna peticion).
 */
export function usePermisosDeRol(rol, { alGuardar } = {}) {
  const [permisos, setPermisos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const rolId = rol?.id;

  useEffect(() => {
    if (!rolId) return undefined;
    let vigente = true;
    /* eslint-disable react-hooks/set-state-in-effect */
    setCargando(true);
    setError('');
    /* eslint-enable react-hooks/set-state-in-effect */
    Promise.all([traerTodo('/permisos', { estado: 1 }), api.get(`/roles/${rolId}/permisos`)])
      .then(([todos, asignados]) => {
        if (!vigente) return;
        setPermisos(todos);
        setSeleccionados((asignados.data.data ?? []).map((asignacion) => asignacion.permiso_id));
      })
      .catch((err) => vigente && setError(mensajeDeError(err) ?? 'No se pudieron cargar los permisos.'))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [rolId]);

  const alternar = (permisoId) =>
    setSeleccionados((actuales) =>
      actuales.includes(permisoId) ? actuales.filter((id) => id !== permisoId) : [...actuales, permisoId]
    );

  const alternarGrupo = (ids, marcar) =>
    setSeleccionados((actuales) => {
      const sinGrupo = actuales.filter((id) => !ids.includes(id));
      return marcar ? [...sinGrupo, ...ids] : sinGrupo;
    });

  async function guardar(event) {
    event.preventDefault();
    setGuardando(true);
    setError('');
    try {
      await api.put(`/roles/${rolId}/permisos`, { PermisoIds: seleccionados });
      alGuardar?.();
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudieron guardar los permisos.');
    } finally {
      setGuardando(false);
    }
  }

  return { permisos, seleccionados, cargando, guardando, error, alternar, alternarGrupo, guardar };
}
