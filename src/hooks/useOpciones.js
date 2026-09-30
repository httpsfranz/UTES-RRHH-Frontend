import { useEffect, useState } from 'react';
import { traerTodo } from '../api/paginado';

/**
 * Opciones de un <Select> cargadas desde la API (catalogo relacionado: profesiones, establecimientos...).
 * Devuelve [{ value, label }] ordenadas como las entrega el backend; `sinOpcion` agrega una primera
 * opcion vacia ("Sin profesion", "Todas las microredes") para las relaciones opcionales.
 * Por defecto trae tambien los registros inactivos (marcados), para que al editar un registro que
 * apunta a uno dado de baja el select muestre su valor en vez de quedar en blanco.
 */
export function useOpciones(
  endpoint,
  { etiqueta = (item) => (item.activo === false ? `${item.nombre} (inactivo)` : item.nombre), params = {}, sinOpcion } = {}
) {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState(false);

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

  const opciones = [
    ...(sinOpcion ? [{ value: '', label: sinOpcion }] : []),
    ...filas.map((item) => ({ value: item.id, label: etiqueta(item) })),
  ];

  return { opciones, cargando, fallo };
}
