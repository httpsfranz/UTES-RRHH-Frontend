import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/client';

const CADA_MS = 60_000;

/**
 * Lo que espera al usuario en cada entrada del menu (GET /menu-pendientes): { '/solicitudes/bandeja': 12, ... }.
 * Se refresca cada minuto y al cambiar de pantalla (despues de aprobar algo, el numero baja al volver al menu).
 */
export function useContadoresDelMenu() {
  const { pathname } = useLocation();
  const [contadores, setContadores] = useState({});

  const cargar = useCallback(async () => {
    try {
      const { data } = await api.get('/menu-pendientes');
      setContadores(data ?? {});
    } catch {
      // sin conexion: se conserva lo ultimo que se mostro
    }
  }, []);

  useEffect(() => {
    // Primera carga, recarga al navegar y refresco periodico.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
    const id = setInterval(cargar, CADA_MS);
    return () => clearInterval(id);
  }, [cargar, pathname]);

  return contadores;
}
