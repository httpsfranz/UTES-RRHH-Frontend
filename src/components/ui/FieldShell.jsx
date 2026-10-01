import { AnimatePresence, motion } from 'motion/react';

// Bloque interno compartido por Field/Select/Textarea: label + contenedor
// relativo para el icono + mensaje de error animado. No se usa directo desde
// una Page; cada input concreto lo envuelve y solo aporta su <input>/<select>/
// <textarea> como children.
export default function FieldShell({ name, label, icon: Icon, iconPosition = 'center', required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-heading" htmlFor={name}>
        {label}
        {required && (
          <span className="ml-0.5 text-rose-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className={`pointer-events-none absolute left-3 text-muted ${
              iconPosition === 'top' ? 'top-3' : 'top-1/2 -translate-y-1/2'
            }`}
          />
        )}
        {children}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${name}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-rose-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
