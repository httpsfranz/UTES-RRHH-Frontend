import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError, traerTodo } from '../api/paginado';

/**
 * Filas hijas de un registro (el detalle diario de un consolidado, las lineas de una liquidacion): se listan, crean,
 * editan y quitan contra su propio endpoint, filtradas por el padre. `params` null = modal cerrado: no se hace
 * ninguna peticion.
 *
 *   const detalle = useDetalleDeRegistro('/detalles-liquidacion', liquidacion && { liquidacion_descuento_id: liquidacion.id }, { alCambiar });
 *   detalle.guardar(id | null, datos)   // POST o PATCH; devuelve { ok, errores } (errores en el formato de los 422)
 *   detalle.eliminar(fila)              // DELETE; devuelve true si salio bien
 */
export function useDetalleDeRegistro(endpoint, params, { alCambiar, idKey = 'id' } = {}) {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const clave = params ? JSON.stringify(params) : null;

  const cargar = useCallback(async () => {
    if (!clave) return;
    setError('');
    try {
      setFilas(await traerTodo(endpoint, JSON.parse(clave)));
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo cargar el detalle.');
    } finally {
      setCargando(false);
    }
  }, [endpoint, clave]);

  useEffect(() => {
    if (!clave) return;
    // Al abrir (o cambiar de registro) se trae el detalle del backend.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    cargar();
  }, [clave, cargar]);

  async function guardar(id, datos) {
    setError('');
    try {
      if (id) await api.patch(`${endpoint}/${id}`, datos);
      else await api.post(endpoint, datos);
      await cargar();
      await alCambiar?.();
      return { ok: true, errores: {} };
    } catch (err) {
      const errores = err.response?.status === 422 ? (err.response.data.errors ?? { general: [err.response.data.message] }) : { general: [mensajeDeError(err) ?? 'No se pudo guardar.'] };
      return { ok: false, errores };
    }
  }

  async function eliminar(fila) {
    setError('');
    try {
      await api.delete(`${endpoint}/${fila[idKey]}`);
      await cargar();
      await alCambiar?.();
      return true;
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo eliminar.');
      return false;
    }
  }

  return { filas, cargando, error, cargar, guardar, eliminar };
}
