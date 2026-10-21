import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ModuleIcon from './ModuleIcon';

/**
 * Tarjeta que se despliega al pulsarla (p. ej. una microred que muestra sus establecimientos).
 *
 *   datos      textos cortos bajo el titulo ("4 establecimientos", "Distrito ...")
 *   acciones   botones a la derecha (no despliegan la tarjeta)
 *   inactivo   la muestra atenuada
 */
export default function GrupoPlegable({ icono, tono, titulo, datos = [], abierto, onAlternar, acciones, inactivo, children }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] ${inactivo ? 'opacity-70' : ''}`}>
      <div className="flex items-center gap-3 p-4">
        <button type="button" onClick={onAlternar} aria-expanded={abierto} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <ModuleIcon icon={icono} tone={tono} size="md" />
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-heading">{titulo}</span>
            <span className="mt-0.5 block text-xs text-muted">{datos.filter(Boolean).join(' · ')}</span>
          </span>
          <ChevronDown size={18} className={`shrink-0 text-muted transition-transform ${abierto ? 'rotate-180' : ''}`} />
        </button>
        {acciones && <div className="flex shrink-0 items-center gap-1">{acciones}</div>}
      </div>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-line-soft p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
