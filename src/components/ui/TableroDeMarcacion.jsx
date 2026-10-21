import { useState } from 'react';
import { Clock, LogIn, LogOut, UserRound } from 'lucide-react';
import { coincideFiltro, estadoDelDia, FILTROS_DEL_DIA } from '../../utils/marcacion';
import EmptyState from './EmptyState';

const TONOS = {
  por_marcar: { borde: 'border-amber-300', pill: 'bg-amber-50 text-amber-700' },
  en_turno: { borde: 'border-emerald-400', pill: 'bg-emerald-50 text-emerald-700' },
  salio: { borde: 'border-line', pill: 'bg-slate-100 text-slate-600' },
  cubierto: { borde: 'border-violet-200', pill: 'bg-violet-50 text-violet-700' },
  registrado: { borde: 'border-line', pill: 'bg-sky-50 text-sky-700' },
  sin_turno: { borde: 'border-line-soft', pill: 'bg-slate-50 text-muted' },
};

// Primero lo que requiere accion ahora: por marcar, en turno; al final quien ya salio, esta cubierto o no tiene turno.
const ORDEN = ['por_marcar', 'en_turno', 'registrado', 'salio', 'cubierto', 'sin_turno'];

// Con el turno ya cumplido o sin turno hoy aun se puede marcar (otra guardia, trabajo autorizado), pero no es lo esperado:
// el boton pasa a secundario y dice que marca.
const ETIQUETA_SECUNDARIA = { salio: 'Marcar otra entrada', sin_turno: 'Marcar entrada sin turno' };

function Tarjeta({ trabajador, celda, puedeMarcar, marcando, onMarcar, onAbrir }) {
  const estado = estadoDelDia(trabajador, celda);
  const tono = TONOS[estado.clave] ?? TONOS.sin_turno;
  const salida = estado.accion === 'SALIDA';
  const ocupado = marcando === trabajador.vinculo_id;
  const secundaria = ETIQUETA_SECUNDARIA[estado.clave];

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border-2 bg-surface p-4 shadow-[var(--shadow-card)] ${tono.borde}`}>
      <button type="button" onClick={onAbrir} className="flex items-start gap-3 text-left" title="Ver el detalle del día">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-page text-muted">
          <UserRound size={18} />
        </span>
        <span className="min-w-0">
          <span className="line-clamp-2 block text-sm font-semibold uppercase text-heading">{trabajador.nombre}</span>
          <span className="line-clamp-2 block text-xs text-muted">
            DNI {trabajador.dni} · {trabajador.cargo}
          </span>
        </span>
      </button>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-1 font-medium ${tono.pill}`}>{estado.etiqueta}</span>
        {estado.turno && (
          <span className="flex items-center gap-1 text-muted">
            <Clock size={13} /> {estado.turno}
          </span>
        )}
      </div>
      {puedeMarcar && estado.accion && (
        <button
          type="button"
          disabled={ocupado}
          onClick={() => onMarcar(trabajador, estado.accion)}
          className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:opacity-60 ${
            secundaria
              ? 'border border-line bg-surface py-2 text-muted hover:text-heading'
              : `py-2.5 text-white shadow-sm ${salida ? 'bg-navy hover:bg-navy/90' : 'bg-brand hover:bg-brand-dark'}`
          }`}
        >
          {salida ? <LogOut size={16} /> : <LogIn size={16} />}
          {ocupado ? 'Registrando…' : (secundaria ?? (salida ? 'Marcar salida' : 'Marcar entrada'))}
        </button>
      )}
    </div>
  );
}

/**
 * Vista "Dia" del control de asistencia: una tarjeta por trabajador con su estado de hoy (por marcar, en turno,
 * salio, cubierto por licencia...) y el boton de la marca que corresponde. La hora la pone el servidor al pulsar.
 *
 *   calendario   respuesta de GET /asistencia-diaria/calendario (vista dia)
 *   onMarcar     (trabajador, 'ENTRADA' | 'SALIDA') => void
 *   onAbrir      (trabajador, dia, celda) => void   detalle del dia
 */
export default function TableroDeMarcacion({ calendario, marcando, onMarcar, onAbrir }) {
  const [filtro, setFiltro] = useState('todos');
  const dia = calendario.periodo.dias[0];
  const filas = calendario.trabajadores
    .map((t) => ({ t, celda: t.celdas[dia.fecha], clave: estadoDelDia(t, t.celdas[dia.fecha]).clave }))
    .sort((a, b) => ORDEN.indexOf(a.clave) - ORDEN.indexOf(b.clave) || a.t.nombre.localeCompare(b.t.nombre, 'es'));
  const visibles = filas.filter((f) => coincideFiltro(filtro, f.clave));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {FILTROS_DEL_DIA.map(({ clave, etiqueta }) => {
          const cantidad = filas.filter((f) => coincideFiltro(clave, f.clave)).length;
          return (
            <button
              key={clave}
              type="button"
              onClick={() => setFiltro(clave)}
              aria-pressed={filtro === clave}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filtro === clave ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:text-heading'
              }`}
            >
              {etiqueta} <span className="opacity-80">({cantidad})</span>
            </button>
          );
        })}
      </div>
      {visibles.length === 0 ? (
        <EmptyState message="Ningún trabajador en este grupo." />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="grid gap-3 pb-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {visibles.map(({ t, celda }) => (
              <Tarjeta
                key={t.vinculo_id}
                trabajador={t}
                celda={celda}
                puedeMarcar={calendario.puede_marcar}
                marcando={marcando}
                onMarcar={onMarcar}
                onAbrir={() => onAbrir(t, dia, celda)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
