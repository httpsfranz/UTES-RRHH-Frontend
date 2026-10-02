import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

const EASE_OUT = [0.16, 1, 0.3, 1];

// Sigue usando position:absolute (no fixed): el contenedor se posiciona respecto
// al <main> mas cercano con position:relative (ver MainLayout), nunca respecto a
// toda la ventana. Por eso el desenfoque no puede tapar el sidebar ni el navbar.
const ANCHOS = { md: 'max-w-lg', lg: 'max-w-3xl' };

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy/25 backdrop-blur-[3px]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className={`relative z-10 w-full ${ANCHOS[size] ?? ANCHOS.md} rounded-3xl border border-line bg-surface shadow-[var(--shadow-pop)]`}
          >
            <div className="flex items-center justify-between border-b border-line-soft px-6 py-5">
              <h2 className="text-[17px] font-semibold tracking-tight text-heading">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-muted transition-colors hover:bg-page hover:text-heading"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
