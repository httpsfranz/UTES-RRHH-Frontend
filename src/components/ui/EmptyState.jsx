export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-8 text-center">
      {Icon && <Icon size={32} className="mx-auto mb-3 text-muted" />}
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}
