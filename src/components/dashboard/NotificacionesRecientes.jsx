import { Link } from 'react-router-dom';
import { formatoFechaHora } from '../../utils/formato';
import Panel from '../ui/Panel';

// Los avisos mas recientes del usuario (los que generan las aprobaciones y los procesos automaticos).
export default function NotificacionesRecientes({ notificaciones }) {
  return (
    <Panel title="Avisos recientes">
      {notificaciones.length === 0 ? (
        <p>No tienes avisos.</p>
      ) : (
        <ul className="divide-y divide-line-soft">
          {notificaciones.map((aviso) => (
            <li key={aviso.id} className="py-2.5">
              <div className="flex items-start justify-between gap-3">
                <p className={`text-sm ${aviso.leida ? 'text-muted' : 'font-semibold text-heading'}`}>
                  {aviso.enlace ? (
                    <Link to={aviso.enlace} className="hover:text-brand-dark">
                      {aviso.titulo}
                    </Link>
                  ) : (
                    aviso.titulo
                  )}
                </p>
                <span className="shrink-0 text-xs text-muted">{formatoFechaHora(aviso.fecha)}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted">{aviso.mensaje}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
