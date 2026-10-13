import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError } from '../api/paginado';

/**
 * Panel de inicio (GET /dashboard): el backend arma los widgets segun el rol y el filtro. Mientras llega una consulta nueva
 * se siguen mostrando los datos anteriores (`cargando` avisa), asi el panel no parpadea al cambiar de mes o de
 * establecimiento.
 */
export function useDashboard(filtros) {
  const clave = JSON.stringify(filtros);
  const [estado, setEstado] = useState({ clave: null, datos: null, error: '' });

  useEffect(() => {
    let vigente = true;
    api
      .get('/dashboard', { params: JSON.parse(clave) })
      .then(({ data }) => vigente && setEstado({ clave, datos: data, error: '' }))
      .catch((err) => vigente && setEstado((previo) => ({ ...previo, clave, error: err.response ? (mensajeDeError(err) ?? 'No se pudo cargar el panel.') : 'No se pudo conectar con el backend.' })));
    return () => {
      vigente = false;
    };
  }, [clave]);

  return { datos: estado.datos, error: estado.error, cargando: estado.clave !== clave };
}
