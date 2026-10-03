import { useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError } from '../api/paginado';

/**
 * Acciones sobre un registro que no son crear/editar/eliminar: aprobar una justificacion, marcar una notificacion
 * como leida, publicar una programacion... Cada una es una llamada a la API; si sale bien se recarga el listado.
 *
 *   const acciones = useAccionDeRegistro('/justificaciones-falta', { alTerminar: crud.cargar });
 *   acciones.ejecutar(item, { accion: 'aprobar', cuerpo: { UsuarioId: 1 } })       // POST /justificaciones-falta/ID/aprobar
 *   acciones.ejecutar(item, { metodo: 'patch', cuerpo: { NotificacionLeida: true } }) // PATCH /notificaciones/ID
 *   `enModal: true` cuando la llamada sale de un modal que ya muestra el error.
 *
 * `ejecutar` devuelve { ok, datos, errores }: `errores` es el formato de los 422 de Laravel ({ campo: [mensaje] }).
 */
export function useAccionDeRegistro(endpoint, { alTerminar, idKey = 'id' } = {}) {
  const [error, setError] = useState('');
  const [ejecutando, setEjecutando] = useState(false);

  async function ejecutar(item, { accion, metodo = 'post', cuerpo = {}, enModal = false } = {}) {
    setError('');
    setEjecutando(true);
    try {
      const ruta = `${endpoint}/${item[idKey]}${accion ? `/${accion}` : ''}`;
      const { data } = await api[metodo](ruta, cuerpo);
      await alTerminar?.();
      return { ok: true, datos: data, errores: {} };
    } catch (err) {
      const errores = err.response?.status === 422 ? (err.response.data.errors ?? {}) : {};
      const mensaje = mensajeDeError(err) ?? 'No se pudo completar la acción.';
      // Si la accion se hizo desde un modal, el error se muestra ahi y no tambien como aviso de la pagina.
      if (Object.keys(errores).length === 0 && !enModal) setError(mensaje);
      return { ok: false, datos: null, errores: Object.keys(errores).length ? errores : { general: [mensaje] } };
    } finally {
      setEjecutando(false);
    }
  }

  return { ejecutar, ejecutando, error, limpiarError: () => setError('') };
}
