import { Suspense, useState } from 'react';
import LoadingState from './LoadingState';
import { EmbebidoContext } from './embebido';

/**
 * Varias pantallas relacionadas en una sola, una por pestana (p. ej. Turnos | Horarios | Tipos de jornada). Cada
 * pestana muestra su Page embebida: con sus filtros, listado y formularios, pero sin cabecera propia.
 *
 *   pestanas  [{ id, etiqueta, icono?, pagina }]
 *   inicial   id de la pestana abierta al entrar
 */
export default function Pestanas({ pestanas, inicial }) {
  const [activa, setActiva] = useState(inicial ?? pestanas[0]?.id);
  const actual = pestanas.find((p) => p.id === activa) ?? pestanas[0];
  const Pagina = actual?.pagina;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div role="tablist" className="flex flex-wrap gap-1 rounded-2xl border border-line bg-surface p-1 shadow-[var(--shadow-card)]">
        {pestanas.map(({ id, etiqueta, icono: Icono }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={id === actual?.id}
            onClick={() => setActiva(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              id === actual?.id ? 'bg-brand text-white shadow-sm' : 'text-muted hover:bg-page hover:text-heading'
            }`}
          >
            {Icono && <Icono size={15} />}
            {etiqueta}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        <EmbebidoContext.Provider value>
          <Suspense fallback={<LoadingState message="Cargando…" />}>{Pagina && <Pagina key={actual.id} />}</Suspense>
        </EmbebidoContext.Provider>
      </div>
    </div>
  );
}
