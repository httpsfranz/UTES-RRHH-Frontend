import { useEffect } from 'react';
import { empezarActividad, terminarActividad } from '../../api/actividad';
import LoadingState from './LoadingState';

// Fallback de Suspense: mientras se descarga la pantalla pedida, la barra de progreso se mantiene activa.
export default function ProgresoDePantalla({ message = 'Cargando…' }) {
  useEffect(() => {
    empezarActividad();
    return terminarActividad;
  }, []);
  return <LoadingState message={message} />;
}
