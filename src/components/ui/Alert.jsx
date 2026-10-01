import { CircleAlert } from 'lucide-react';

// variant="banner": aviso de pagina (p.ej. "no se pudo conectar con el backend").
// variant="text": error general dentro de un formulario, sin caja ni borde.
export default function Alert({ variant = 'banner', children }) {
  if (!children) return null;

  if (variant === 'text') {
    return <p className="text-sm text-rose-600">{children}</p>;
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-rose-200/70 bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      <CircleAlert size={18} className="mt-px shrink-0" />
      <div>{children}</div>
    </div>
  );
}
