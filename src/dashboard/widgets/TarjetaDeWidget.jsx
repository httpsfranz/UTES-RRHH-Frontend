// Marco comun de los widgets del panel: titulo, subtitulo opcional y contenido.
export default function TarjetaDeWidget({ titulo, subtitulo, derecha, children }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-heading">{titulo}</h2>
          {subtitulo && <p className="mt-0.5 text-xs text-muted">{subtitulo}</p>}
        </div>
        {derecha}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function SinDatos({ mensaje = 'Sin datos en el período.' }) {
  return <p className="flex h-full min-h-24 items-center justify-center text-center text-sm text-muted">{mensaje}</p>;
}
