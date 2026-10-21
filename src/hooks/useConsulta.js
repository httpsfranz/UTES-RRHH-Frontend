import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError, traerHasta } from '../api/paginado';

const ESPERA_MS = 300;

/**
 * GET de un recurso de solo lectura con parametros (reportes, resumenes): vuelve a consultar cuando cambian los
 * parametros y expone `recargar`. Con `activo` en false no consulta (p. ej. falta elegir el establecimiento). Con `hasta`
 * (listados largos, como la auditoria) junta las primeras `hasta` filas de varias paginas: datos = { data, meta: { total } }.
 */
export function useConsulta(endpoint, params, { activo = true, hasta } = {}) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const ultima = useRef(0);
  const clave = JSON.stringify(params);

  const recargar = useCallback(async () => {
    if (!activo) return;
    const consulta = ++ultima.current;
    setCargando(true);
    setError('');
    try {
      let data;
      if (hasta) {
        const { filas, total } = await traerHasta(endpoint, JSON.parse(clave), hasta);
        data = { data: filas, meta: { total } };
      } else {
        ({ data } = await api.get(endpoint, { params: JSON.parse(clave) }));
      }
      if (consulta === ultima.current) setDatos(data);
    } catch (err) {
      if (consulta === ultima.current) setError(mensajeDeError(err) ?? 'No se pudo cargar la información.');
    } finally {
      if (consulta === ultima.current) setCargando(false);
    }
  }, [endpoint, clave, activo, hasta]);

  // Los filtros de texto cambian con cada tecla: se consulta tras una pausa corta (la primera vez, de inmediato).
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      recargar();
      return undefined;
    }
    const id = setTimeout(recargar, ESPERA_MS);
    return () => clearTimeout(id);
  }, [recargar]);

  return { datos, cargando, error, recargar };
}
