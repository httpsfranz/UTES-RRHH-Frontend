import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError, traerTodo } from '../api/paginado';

// Cada celda recorre los estados en orden al hacer clic: sin asignar -> trabaja -> descanso -> sin asignar.
const ESTADOS_CELDA = ['', 'trabaja', 'descanso'];

const clave = (turnoId, dia) => `${turnoId}-${dia}`;

/**
 * Detalle semanal de un horario (tabla Configuracion.HorarioDetalle): que turno se trabaja o es descanso cada
 * dia de la semana. Carga los turnos activos y la grilla actual, deja cambiar celda por celda y guarda la
 * grilla completa con una sola llamada (PUT /horarios/{id}/detalle), que el backend aplica en una transaccion.
 *
 * `horario` es el registro del horario o null (modal cerrado: no se hace ninguna peticion).
 */
export function useDetalleDeHorario(horario, { alGuardar } = {}) {
  const [turnos, setTurnos] = useState([]);
  const [celdas, setCeldas] = useState({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const horarioId = horario?.id;

  useEffect(() => {
    if (!horarioId) return undefined;
    let vigente = true;
    /* eslint-disable react-hooks/set-state-in-effect */
    setCargando(true);
    setError('');
    /* eslint-enable react-hooks/set-state-in-effect */
    Promise.all([traerTodo('/turnos', { estado: 1 }), api.get(`/horarios/${horarioId}/detalle`)])
      .then(([activos, detalle]) => {
        if (!vigente) return;
        const filas = detalle.data.data ?? [];
        // Un turno dado de baja que el horario aun usa se sigue mostrando (y se puede quitar).
        const usados = filas
          .filter((fila) => !activos.some((turno) => turno.id === fila.turno_id))
          .map((fila) => ({ ...fila.turno, activo: false }));
        setTurnos([...activos, ...usados]);
        setCeldas(Object.fromEntries(filas.map((fila) => [clave(fila.turno_id, fila.dia), fila.es_descanso ? 'descanso' : 'trabaja'])));
      })
      .catch((err) => vigente && setError(mensajeDeError(err) ?? 'No se pudo cargar el detalle del horario.'))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [horarioId]);

  const valorDe = (turnoId, dia) => celdas[clave(turnoId, dia)] ?? '';

  const cambiar = (turnoId, dia) =>
    setCeldas((actuales) => {
      const actual = actuales[clave(turnoId, dia)] ?? '';
      const siguiente = ESTADOS_CELDA[(ESTADOS_CELDA.indexOf(actual) + 1) % ESTADOS_CELDA.length];
      const nuevas = { ...actuales };
      if (siguiente) nuevas[clave(turnoId, dia)] = siguiente;
      else delete nuevas[clave(turnoId, dia)];
      return nuevas;
    });

  const total = Object.keys(celdas).length;

  async function guardar(event) {
    event.preventDefault();
    setGuardando(true);
    setError('');
    const Detalle = Object.entries(celdas).map(([llave, estado]) => {
      const [turnoId, dia] = llave.split('-').map(Number);
      return { TurnoId: turnoId, HorarioDetalleDia: dia, HorarioDetalleEsDescanso: estado === 'descanso' };
    });
    try {
      await api.put(`/horarios/${horarioId}/detalle`, { Detalle });
      alGuardar?.();
    } catch (err) {
      const errores = err.response?.status === 422 ? Object.values(err.response.data.errors ?? {}).flat() : [];
      setError(errores[0] ?? mensajeDeError(err) ?? 'No se pudo guardar el detalle del horario.');
    } finally {
      setGuardando(false);
    }
  }

  return { turnos, valorDe, cambiar, total, cargando, guardando, error, guardar };
}
