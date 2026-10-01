import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Cargando…' }) {
  return (
    <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-line bg-surface px-6 py-12 text-sm text-muted shadow-[var(--shadow-card)]">
      <Loader2 size={16} className="animate-spin text-brand" />
      {message}
    </div>
  );
}
