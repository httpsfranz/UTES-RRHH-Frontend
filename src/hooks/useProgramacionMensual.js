import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError } from '../api/paginado';

const SIN_CONEXION = 'No se pudo conectar con el backend. ¿Está corriendo "php artisan serve"?';
const mensaje = (err, respaldo) => (err.response ? (mensajeDeError(err) ?? respaldo) : SIN_CONEXION);

/**
 * Programacion mensual en grilla de un establecimiento (GET /programacion-mensual): trabajadores x dias con sus turnos,
 * los turnos disponibles y la cobertura por dia. pintar() deja los turnos de una celda; copiar() trae el mes anterior;
 * publicar() publica la programacion del mes. Cada cambio devuelve la grilla ya recalculada.
 */
export function useProgramacionMensual({ eessId, anio, mes }) {
  const [grilla, setGrilla] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [ocupada, setOcupada] = useState(null); // "vinculo|fecha" de la celda que se esta guardando
  const [trabajando, setTrabajando] = useState(false); // copiar / publicar
  const ultimaConsulta = useRef(0);

  const cargar = useCallback(async () => {
    if (!eessId) {
      setGrilla(null);
      return;
    }
    const consulta = ++ultimaConsulta.current;
    setCargando(true);
    setError('');
    try {
      const { data } = await api.get('/programacion-mensual', { params: { eess_id: eessId, anio, mes } });
      if (consulta === ultimaConsulta.current) setGrilla(data);
    } catch (err) {
      if (consulta === ultimaConsulta.current) {
        setGrilla(null);
        setError(mensaje(err, 'No se pudo cargar la programación.'));
      }
    } finally {
      if (consulta === ultimaConsulta.current) setCargando(false);
    }
  }, [eessId, anio, mes]);

  useEffect(() => {
    // Sincroniza la grilla con el backend al cambiar de establecimiento o de mes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  async function pintar(vinculoId, fecha, turnoIds) {
    setOcupada(`${vinculoId}|${fecha}`);
    setError('');
    try {
      const { data } = await api.put('/programacion-mensual/celda', { eess_id: eessId, VinculoLaboralId: vinculoId, Fecha: fecha, TurnoIds: turnoIds });
      setGrilla(data);
    } catch (err) {
      setError(mensaje(err, 'No se pudo asignar el turno.'));
    } finally {
      setOcupada(null);
    }
  }

  /** @returns {Promise<{ creados: number, omitidos: string[] } | null>} */
  async function copiar() {
    setTrabajando(true);
    setError('');
    try {
      const { data } = await api.post('/programacion-mensual/copiar', { eess_id: eessId, anio, mes });
      setGrilla(data.grilla);
      return { creados: data.creados, omitidos: data.omitidos };
    } catch (err) {
      setError(mensaje(err, 'No se pudo copiar el mes anterior.'));
      return null;
    } finally {
      setTrabajando(false);
    }
  }

  async function publicar() {
    if (!grilla?.programacion) return false;
    setTrabajando(true);
    setError('');
    try {
      await api.post(`/programaciones-periodo/${grilla.programacion.id}/publicar`);
      await cargar();
      return true;
    } catch (err) {
      setError(mensaje(err, 'No se pudo publicar la programación.'));
      return false;
    } finally {
      setTrabajando(false);
    }
  }

  return { grilla, cargando, error, setError, ocupada, trabajando, pintar, copiar, publicar, recargar: cargar };
}
