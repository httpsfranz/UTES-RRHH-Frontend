import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Cargando…' }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <Loader2 size={16} className="animate-spin" />
      {message}
    </div>
  );
}
