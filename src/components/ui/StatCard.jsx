// Indicador del dashboard: etiqueta + valor grande.
export default function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-heading">{value}</p>
    </div>
  );
}
