import { useEffect, useState, useSyncExternalStore } from 'react';
import { hayActividad, suscribirActividad } from '../../api/actividad';

/**
 * Barra fina en el borde superior de la ventana que avanza mientras el sistema carga datos o una pantalla y se completa al
 * terminar. Si todo carga en menos de ~120 ms no aparece (evita parpadeos). Se alimenta de api/actividad.js.
 */
export default function BarraDeProgreso() {
  const activo = useSyncExternalStore(suscribirActividad, hayActividad);
  const [visible, setVisible] = useState(false);
  const [avance, setAvance] = useState(0);

  useEffect(() => {
    if (activo) {
      const inicio = setTimeout(() => {
        setVisible(true);
        setAvance(12);
      }, 120);
      // Avanza cada vez menos, sin llegar nunca al final: el 100 % lo marca el fin real de la carga.
      const goteo = setInterval(() => setAvance((a) => (a > 0 && a < 90 ? a + (92 - a) * 0.1 : a)), 220);
      return () => {
        clearTimeout(inicio);
        clearInterval(goteo);
      };
    }
    const completar = setTimeout(() => setAvance((a) => (a > 0 ? 100 : 0)), 0);
    const ocultar = setTimeout(() => {
      setVisible(false);
      setAvance(0);
    }, 380);
    return () => {
      clearTimeout(completar);
      clearTimeout(ocultar);
    };
  }, [activo]);

  return (
    <div
      role="progressbar"
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(avance)}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-brand via-cyan-400 to-sky-300 shadow-[0_0_10px_rgba(34,211,238,0.7)] transition-[width] duration-300 ease-out"
        style={{ width: `${avance}%` }}
      />
    </div>
  );
}
