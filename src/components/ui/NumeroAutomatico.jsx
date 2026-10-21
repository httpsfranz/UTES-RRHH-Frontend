import FieldShell from './FieldShell';

// Numero o codigo que emite el sistema (correlativo por año: PAD-2026-0007, RL-2026-0012...): se muestra, no se escribe.
export default function NumeroAutomatico({ name, label, icon, valor }) {
  return (
    <FieldShell name={name} label={label} icon={icon}>
      <input
        id={name}
        value={valor || 'Se genera al guardar'}
        readOnly
        tabIndex={-1}
        className={`w-full cursor-default rounded-xl border border-line-soft bg-page/60 py-2.5 ${icon ? 'pl-9' : 'pl-3'} pr-3 text-sm ${valor ? 'font-medium text-heading' : 'italic text-muted'}`}
      />
    </FieldShell>
  );
}
