import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError } from '../api/paginado';

/** Resumen de la pantalla de inicio (GET /dashboard), ya limitado por el backend al alcance del usuario. */
export function useResumenDeInicio() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    api
      .get('/dashboard')
      .then(({ data }) => vigente && setResumen(data))
      .catch((err) => vigente && setError(err.response ? (mensajeDeError(err) ?? 'No se pudo cargar el resumen.') : 'No se pudo conectar con el backend.'));
    return () => {
      vigente = false;
    };
  }, []);

  return { resumen, error };
}
