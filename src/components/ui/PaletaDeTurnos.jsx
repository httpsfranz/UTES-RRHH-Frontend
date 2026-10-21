import { Eraser } from 'lucide-react';
import { colorDeTurno } from './coloresDeTurno';

/**
 * Paleta para "pintar" la grilla: un boton por turno (codigo y horario) y "Libre" para vaciar la celda. El elegido
 * queda resaltado. `pincel` = id del turno | 'libre' | null.
 */
export default function PaletaDeTurnos({ turnos, pincel, onElegir, deshabilitada }) {
  const base = 'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-all disabled:cursor-not-allowed disabled:opacity-50';
  const activo = 'border-brand ring-4 ring-brand/15';
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Turno a asignar">
      {turnos.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={pincel === t.id}
          disabled={deshabilitada}
          onClick={() => onElegir(t.id)}
          className={`${base} bg-surface ${pincel === t.id ? activo : 'border-line hover:border-brand/50'}`}
          title={t.nombre}
        >
          <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${colorDeTurno(turnos, t.id)}`}>{t.codigo}</span>
          <span className="text-muted">
            {t.entrada}–{t.salida}
            {t.es_guardia ? ' · guardia' : ''}
          </span>
        </button>
      ))}
      <button
        type="button"
        role="radio"
        aria-checked={pincel === 'libre'}
        disabled={deshabilitada}
        onClick={() => onElegir('libre')}
        className={`${base} bg-surface ${pincel === 'libre' ? activo : 'border-line hover:border-brand/50'}`}
      >
        <Eraser size={14} className="text-muted" />
        <span className="font-medium text-heading">Libre</span>
      </button>
    </div>
  );
}
