// Franja de una sola linea sobre el calendario: el titulo del reporte a la izquierda ("ASISTENCIA - EESS", mes y total) y,
// a su lado, los hijos (la leyenda). Reemplaza al encabezado centrado y a la leyenda de varias lineas, que le quitaban
// alto al calendario.
export default function BarraDeCalendario({ titulo, subtitulo, children }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-line bg-surface px-4 py-2.5 shadow-[var(--shadow-card)]">
      <div className="min-w-0 shrink-0">
        <h2 className="truncate text-sm font-semibold uppercase tracking-tight text-heading">{titulo}</h2>
        <p className="text-xs text-muted">{subtitulo}</p>
      </div>
      {children}
    </div>
  );
}
