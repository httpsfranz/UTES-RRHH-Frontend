import Table from './Table';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

// Tabla de solo lectura dentro de un modal (con alto maximo y desplazamiento propio).
export default function TablaEnModal({ columns, rows, cargando, vacio = 'No hay registros.', getRowKey }) {
  if (cargando) return <LoadingState message="Cargando…" />;
  if (!rows?.length) return <EmptyState message={vacio} />;
  return (
    <div className="max-h-[50vh] overflow-auto rounded-2xl border border-line">
      <Table columns={columns} rows={rows} getRowKey={getRowKey} numbered />
    </div>
  );
}
