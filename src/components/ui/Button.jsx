// Botón primario (solido, color brand). Cancelar/Guardar del formulario viven en
// FormActions porque su combinacion de estilos es propia de ese contexto; este
// Button es el que se repite para las acciones principales de cabecera ("Nuevo X").
export default function Button({ icon: Icon, children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60 ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
