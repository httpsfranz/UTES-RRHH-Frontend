import { Search } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Buscar por nombre o código…',
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="mb-5"
    >
      <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
        <Search size={16} className="text-muted" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full text-sm text-heading outline-none placeholder:text-muted"
        />
      </div>
    </form>
  );
}
