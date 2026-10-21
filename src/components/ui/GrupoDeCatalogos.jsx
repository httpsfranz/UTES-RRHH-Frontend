// Seccion de la pantalla de configuracion: un titulo (el area del sistema) y sus tarjetas en una grilla.
export default function GrupoDeCatalogos({ titulo, children }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{titulo}</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{children}</div>
    </section>
  );
}
