import { Link } from 'react-router-dom';
import Panel from '../ui/Panel';

const ETIQUETAS = {
  papeletas: { texto: 'Papeletas', ruta: '/solicitudes/papeletas' },
  licencias: { texto: 'Licencias', ruta: '/solicitudes/licencias' },
  descansos_medicos: { texto: 'Descansos médicos', ruta: '/solicitudes/descansos-medicos' },
  justificaciones: { texto: 'Justificaciones de falta', ruta: '/asistencia/justificacion-faltas' },
  cambios_turno: { texto: 'Cambios de turno', ruta: '/programacion/cambios-turno' },
  vacaciones: { texto: 'Goce de vacaciones', ruta: '/vacaciones/goce' },
};

// Solicitudes que esperan una resolucion, por tipo. Cada fila lleva a su pantalla (si la sesion puede abrirla, el
// menu y la ruta lo deciden; aqui solo se enlaza).
export default function PendientesPorTipo({ pendientes }) {
  const filas = Object.entries(ETIQUETAS).map(([clave, datos]) => ({ clave, ...datos, cantidad: pendientes?.[clave] ?? 0 }));

  return (
    <Panel title="Solicitudes por resolver">
      <ul className="divide-y divide-line-soft">
        {filas.map((fila) => (
          <li key={fila.clave}>
            <Link to={fila.ruta} className="flex items-center justify-between py-2 text-sm text-heading transition-colors hover:text-brand-dark">
              <span>{fila.texto}</span>
              <span className={`min-w-8 rounded-full px-2 py-0.5 text-center text-xs font-semibold ${fila.cantidad > 0 ? 'bg-amber-100 text-amber-800' : 'bg-line-soft text-muted'}`}>{fila.cantidad}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
