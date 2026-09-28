export default function StatusBadge({ active }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
        active ? 'bg-green-50 text-accent-green' : 'bg-gray-100 text-muted'
      }`}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
}
