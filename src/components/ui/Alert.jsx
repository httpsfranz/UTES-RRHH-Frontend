// variant="banner": aviso de pagina (p.ej. "no se pudo conectar con el backend").
// variant="text": error general dentro de un formulario, sin caja ni borde.
export default function Alert({ variant = 'banner', children }) {
  if (!children) return null;

  if (variant === 'text') {
    return <p className="text-sm text-red-600">{children}</p>;
  }

  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {children}
    </div>
  );
}
