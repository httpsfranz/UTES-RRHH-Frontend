// Franja que explica un proceso en pocos pasos numerados (p. ej. Vacaciones: record -> programacion -> goce).
//   pasos  [{ titulo, texto }]
export default function PasosDelProceso({ pasos }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {pasos.map((paso, i) => (
        <li key={paso.titulo} className="flex gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">{i + 1}</span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-heading">{paso.titulo}</span>
            <span className="block text-xs leading-snug text-muted">{paso.texto}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
