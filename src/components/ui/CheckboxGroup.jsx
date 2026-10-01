// Grupo de casillas con titulo y "seleccionar todo": para asignar varios elementos a la vez
// (permisos de un rol, agrupados por modulo).
//   options   [{ value, label, description? }]
//   selected  array de values marcados
//   onToggle(value)        marca/desmarca uno
//   onToggleAll(values, marcar)   marca o desmarca todos los del grupo
export default function CheckboxGroup({ title, options, selected, onToggle, onToggleAll }) {
  const marcados = options.filter((option) => selected.includes(option.value)).length;
  const todos = marcados === options.length;

  return (
    <fieldset className="rounded-xl border border-line p-3">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">{title}</legend>

      <label className="mb-2 flex cursor-pointer items-center gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={todos}
          onChange={() => onToggleAll(options.map((option) => option.value), !todos)}
          className="h-4 w-4 rounded border-line accent-brand"
        />
        Seleccionar todo ({marcados}/{options.length})
      </label>

      <div className="space-y-1.5">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-start gap-2 text-sm text-heading">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              className="mt-0.5 h-4 w-4 rounded border-line accent-brand"
            />
            <span>
              {option.label}
              {option.description && <span className="block text-xs text-muted">{option.description}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
