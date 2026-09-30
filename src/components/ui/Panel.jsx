// Caja con borde para agrupar contenido (titulo opcional).
export default function Panel({ title, children }) {
  return (
    <div className="mt-6 rounded-xl border border-line bg-surface p-6 shadow-sm">
      {title && <h2 className="text-sm font-semibold text-heading">{title}</h2>}
      <div className="mt-2 text-sm text-muted">{children}</div>
    </div>
  );
}
