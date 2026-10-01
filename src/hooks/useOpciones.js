import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { traerTodo } from '../api/paginado';

const etiquetaPorDefecto = (item) => (item.activo === false ? `${item.nombre} (inactivo)` : item.nombre);

/**
 * Opciones de un <Select> cargadas desde la API (catalogo relacionado: profesiones, establecimientos...).
 * Devuelve [{ value, label }] ordenadas como las entrega el backend.
 *
 *   sinOpcion  agrega una primera opcion vacia ("Sin profesion", "Toda la Red") para relaciones opcionales
 *   actual     id que el formulario ya tiene seleccionado. Solo se ofrecen registros ACTIVOS (el backend
 *              rechaza asignar uno dado de baja), pero si el registro que se edita ya apunta a uno inactivo
 *              se agrega ese unico, marcado "(inactivo)", para que el select muestre su valor y no quede en blanco.
 *   params     filtros extra del listado
 *
 * `filas` son los registros completos de la API, por si el formulario necesita otros datos del catalogo
 * (p. ej. el codigo del tipo de documento para validar el numero).
 */
export function useOpciones(endpoint, { etiqueta = etiquetaPorDefecto, params = { estado: 1 }, sinOpcion, actual } = {}) {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);
  const [extra, setExtra] = useState(null);

  const clave = JSON.stringify(params);

  useEffect(() => {
    let vigente = true;
    traerTodo(endpoint, params)
      .then((datos) => vigente && setFilas(datos))
      .catch(() => vigente && setFallo(true))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, clave]);

  // El registro actual puede estar inactivo y por eso no venir en la lista de activos.
  const falta = cargando || !actual ? false : !filas.some((fila) => String(fila.id) === String(actual));

  useEffect(() => {
    if (!falta) return undefined;
    let vigente = true;
    api
      .get(`${endpoint}/${actual}`)
      .then(({ data }) => vigente && setExtra(data.data))
      .catch(() => vigente && setExtra(null));
    return () => {
      vigente = false;
    };
  }, [falta, endpoint, actual]);

  const todas = falta && extra && String(extra.id) === String(actual) ? [...filas, { ...extra, activo: false }] : filas;

  const opciones = [
    ...(sinOpcion ? [{ value: '', label: sinOpcion }] : []),
    ...todas.map((item) => ({ value: item.id, label: etiqueta(item) })),
  ];

  return { opciones, filas: todas, cargando, fallo };
}
