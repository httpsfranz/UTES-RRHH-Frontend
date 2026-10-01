// Boton de accion. variant="primary" (turquesa, "Nuevo X" de cabecera) | "secondary" (blanco con borde).
// Cancelar/Guardar del formulario viven en FormActions porque su combinacion es propia de ese contexto.
const VARIANTES = {
  primary:
    'bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-dark hover:shadow-md hover:shadow-brand/25',
  secondary: 'border border-line bg-surface text-heading shadow-sm hover:bg-page',
};

export default function Button({ icon: Icon, variant = 'primary', children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTES[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
