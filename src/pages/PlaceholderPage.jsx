// Pagina generica: por ahora cada item del menu usa esta misma pantalla, con su propio
// titulo. Cuando construyas un modulo de verdad, creas su archivo en src/pages y lo
// conectas en src/routes.jsx en lugar de PlaceholderPage.
export default function PlaceholderPage({ title }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
      <p className="mt-2 text-slate-500">
        Esta pantalla todavía no tiene contenido. Aquí irá el listado / formulario de{' '}
        <span className="font-medium text-slate-600">{title.toLowerCase()}</span>.
      </p>
    </div>
  );
}
