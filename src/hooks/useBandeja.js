import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

const CADA_MS = 60_000;

/**
 * Bandeja de notificaciones del usuario de la sesion (GET /notificaciones/bandeja): las ultimas y cuantas no leyo.
 * Se refresca sola cada minuto; marcar una o todas como leidas actualiza el contador al momento.
 */
export function useBandeja() {
  const [bandeja, setBandeja] = useState({ no_leidas: 0, data: [] });

  const cargar = useCallback(async () => {
    try {
      const { data } = await api.get('/notificaciones/bandeja');
      setBandeja(data);
    } catch {
      // sin conexion: se conserva lo ultimo que se mostro
    }
  }, []);

  useEffect(() => {
    // Primera carga y refresco periodico de la campana.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar();
    const id = setInterval(cargar, CADA_MS);
    return () => clearInterval(id);
  }, [cargar]);

  async function leer(notificacion) {
    if (!notificacion.leida) {
      await api.post(`/notificaciones/${notificacion.id}/leer`).catch(() => null);
      await cargar();
    }
  }

  async function leerTodas() {
    await api.post('/notificaciones/leer-todas').catch(() => null);
    await cargar();
  }

  return { ...bandeja, cargar, leer, leerTodas };
}
