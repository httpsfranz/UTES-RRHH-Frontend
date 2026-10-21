import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError } from '../api/paginado';

/**
 * Estado biometrico de cada trabajador (GET /autorizaciones-metodo/resumen): metodo con el que marca (facial o manual
 * autorizado), plantilla facial y consentimiento. Tambien las acciones que lo cambian: cada una escribe en su tabla
 * (autorizaciones-metodo, consentimientos-biometricos, plantillas-biometricas) y vuelve a cargar el resumen.
 */
export function useResumenBiometrico() {
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');

  const cargar = useCallback(async (texto = '') => {
    setCargando(true);
    setError('');
    try {
      const { data } = await api.get('/autorizaciones-metodo/resumen', { params: texto ? { buscar: texto } : {} });
      setFilas(data.data);
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo cargar la información biométrica.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Carga inicial del resumen.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar('');
  }, [cargar]);

  async function ejecutar(peticion) {
    setError('');
    try {
      await peticion();
      await cargar(buscar);
      return null;
    } catch (err) {
      const errores = err.response?.data?.errors;
      return errores ? Object.values(errores).flat()[0] : (mensajeDeError(err) ?? 'No se pudo guardar.');
    }
  }

  return { filas, cargando, error, setError, buscar, setBuscar, cargar, ejecutar };
}
