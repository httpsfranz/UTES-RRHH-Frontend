export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-heading">{title}</h1>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
