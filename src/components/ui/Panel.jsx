// Tarjeta blanca para agrupar contenido (titulo opcional).
export default function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
      {title && <h2 className="text-sm font-semibold text-heading">{title}</h2>}
      <div className="mt-2 text-sm text-muted">{children}</div>
    </section>
  );
}
