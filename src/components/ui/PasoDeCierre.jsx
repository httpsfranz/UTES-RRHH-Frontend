import { Check, Lock } from 'lucide-react';

const ESTILOS = {
  hecho: { circulo: 'bg-emerald-500 text-white', borde: 'border-emerald-200', etiqueta: 'text-emerald-700', texto: 'Listo' },
  pendiente: { circulo: 'bg-amber-400 text-white', borde: 'border-amber-300', etiqueta: 'text-amber-700', texto: 'Pendiente' },
  bloqueado: { circulo: 'bg-slate-200 text-slate-500', borde: 'border-line', etiqueta: 'text-muted', texto: 'Aún no' },
};

/**
 * Un paso de un proceso con estado (p. ej. el cierre del mes): numero, titulo, si ya esta hecho, que falta y sus
 * acciones (children) a la derecha.
 *
 *   estado   'hecho' | 'pendiente' | 'bloqueado'
 */
export default function PasoDeCierre({ numero, titulo, estado, resumen, children }) {
  const estilo = ESTILOS[estado] ?? ESTILOS.bloqueado;
  return (
    <li className={`flex flex-wrap items-center gap-4 rounded-2xl border-2 bg-surface p-4 shadow-[var(--shadow-card)] ${estilo.borde}`}>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${estilo.circulo}`}>
        {estado === 'hecho' ? <Check size={18} /> : estado === 'bloqueado' ? <Lock size={15} /> : numero}
      </span>
      <div className="min-w-0 flex-1 basis-64">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-[15px] font-semibold text-heading">{titulo}</h3>
          <span className={`text-xs font-semibold uppercase tracking-wide ${estilo.etiqueta}`}>{estilo.texto}</span>
        </div>
        <p className="mt-0.5 text-sm text-muted">{resumen}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </li>
  );
}
