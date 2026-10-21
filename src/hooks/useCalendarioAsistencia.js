import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError } from '../api/paginado';

/**
 * Calendario mensual de asistencia de un establecimiento (GET /asistencia-diaria/calendario) y su exportacion a PDF
 * (GET /asistencia-diaria/calendario/pdf). Pantalla y PDF usan los mismos parametros y la misma respuesta del backend.
 *
 *   filtros  { eessId, anio, mes, buscar }  sin establecimiento no se consulta
 *   papel    'a4' | 'a3' (solo afecta al PDF)
 */
export function useCalendarioAsistencia({ eessId, anio, mes, vista, fecha, buscar, endpoint = '/asistencia-diaria/calendario' }) {
  const [calendario, setCalendario] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exportando, setExportando] = useState(false);
  const ultimaConsulta = useRef(0);

  // Con `vista` (dia | semana | mes) + `fecha` se pide ese rango; sin ella, el mes `anio`/`mes` (calendarios de programacion).
  const params = { eess_id: eessId, ...(vista ? { vista, fecha } : { anio, mes }), ...(buscar ? { buscar } : {}) };
  const clave = JSON.stringify(params);

  const cargar = useCallback(async () => {
    if (!eessId) {
      setCalendario(null);
      return;
    }
    const consulta = ++ultimaConsulta.current;
    setCargando(true);
    setError('');
    try {
      const { data } = await api.get(endpoint, { params: JSON.parse(clave) });
      if (consulta === ultimaConsulta.current) setCalendario(data);
    } catch (err) {
      if (consulta === ultimaConsulta.current) {
        setCalendario(null);
        setError(err.response ? (mensajeDeError(err) ?? 'No se pudo cargar el calendario.') : 'No se pudo conectar con el backend. ¿Está corriendo "php artisan serve"?');
      }
    } finally {
      if (consulta === ultimaConsulta.current) setCargando(false);
    }
  }, [clave, eessId, endpoint]);

  useEffect(() => {
    // Sincroniza el calendario con el backend cuando cambia el establecimiento, el mes o la busqueda.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
  }, [cargar]);

  // Descarga el PDF del calendario que se esta viendo: mismo EESS, mes y busqueda.
  async function exportarPdf(papel = 'a4') {
    if (!eessId) return;
    setExportando(true);
    setError('');
    try {
      const { data, headers } = await api.get(`${endpoint}/pdf`, { params: { ...params, papel }, responseType: 'blob' });
      const respaldo = `Asistencia_${calendario?.eess?.codigo ?? eessId}_${vista ? fecha : `${anio}-${String(mes).padStart(2, '0')}`}.pdf`;
      const nombre = /filename="?([^";]+)"?/.exec(headers['content-disposition'] ?? '')?.[1] ?? respaldo;
      const url = URL.createObjectURL(data);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = nombre;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // Con responseType blob el cuerpo del error tambien llega como blob: se intenta leer su mensaje.
      const mensaje = await err.response?.data
        ?.text()
        .then((texto) => JSON.parse(texto)?.message)
        .catch(() => null);
      setError(mensaje ?? 'No se pudo generar el PDF.');
    } finally {
      setExportando(false);
    }
  }

  return { calendario, cargando, error, recargar: cargar, exportarPdf, exportando };
}
