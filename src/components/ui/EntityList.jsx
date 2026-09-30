import { useState } from 'react';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import EntityCard from './EntityCard';
import LoadingState from './LoadingState';
import StatusBadge from './StatusBadge';
import Table from './Table';
import ActionButtons from './ActionButtons';
import ViewToggle from './ViewToggle';

// Con hasta LIMITE_TARJETAS registros se muestran tarjetas; con mas, una tabla.
// 8 = dos filas completas de la grilla de tarjetas en pantalla ancha (xl: 4 columnas). Por encima,
// las tarjetas (altas, una por registro) obligan a desplazarse mucho y no se pueden comparar
// valores entre registros, que es justo lo que hace bien una tabla. El usuario puede forzar
// cualquiera de las dos vistas con el selector.
const LIMITE_TARJETAS = 8;

/**
 * Listado de un modulo de catalogo: estados de carga / vacio y, segun la cantidad de registros,
 * tarjetas o tabla. Cada Page declara UNA sola vez como se ve un registro en cada vista:
 *
 *   columns  [{ key, header, render? }]     la vista de tabla
 *   card     (item) => ({ icon | initial, title, meta: [...], footer })    la vista de tarjetas (opcional)
 *
 * El badge de Estado y los botones (editar, desactivar/reactivar, eliminar) se agregan solos
 * en ambas vistas. Si el modulo no tiene baja logica (no existe `activo`), no hay badge.
 */
export default function EntityList({
  items,
  total,
  loading,
  loadingMessage = 'Cargando…',
  emptyIcon,
  emptyMessage = 'No hay registros todavía.',
  columns,
  card,
  isActive = (item) => item.activo,
  onEdit,
  onToggle,
  onDelete,
  getKey = (item) => item.id,
  threshold = LIMITE_TARJETAS,
}) {
  const [vista, setVista] = useState('auto');

  if (loading) return <LoadingState message={loadingMessage} />;
  if (items.length === 0) return <EmptyState icon={emptyIcon} message={emptyMessage} />;

  const conEstado = isActive(items[0]) !== undefined;
  // Sin `card` (auditoria, logs) el listado es siempre una tabla y no hay selector de vista.
  const soloTabla = !card;
  const automatica = items.length > threshold ? 'tabla' : 'tarjetas';
  const efectiva = soloTabla ? 'tabla' : vista === 'auto' ? automatica : vista;
  const hayAcciones = onEdit || onToggle || onDelete;

  const columnasTabla = [
    ...columns,
    ...(conEstado
      ? [{ key: '_estado', header: 'Estado', render: (item) => <StatusBadge active={isActive(item)} /> }]
      : []),
    ...(hayAcciones
      ? [
          {
            key: '_acciones',
            header: '',
            render: (item) => (
              <ActionButtons
                active={conEstado ? isActive(item) : undefined}
                onEdit={onEdit && (() => onEdit(item))}
                onToggle={onToggle && (() => onToggle(item))}
                onDelete={onDelete && (() => onDelete(item))}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          {total > items.length
            ? `Mostrando ${items.length} de ${total} registros`
            : `${items.length} ${items.length === 1 ? 'registro' : 'registros'}`}
        </p>
        {!soloTabla && <ViewToggle value={vista} onChange={setVista} />}
      </div>

      {efectiva === 'tabla' ? (
        <Table columns={columnasTabla} rows={items} getRowKey={getKey} />
      ) : (
        <CardGrid>
          {items.map((item) => (
            <EntityCard
              key={getKey(item)}
              {...card(item)}
              active={conEstado ? isActive(item) : undefined}
              onEdit={onEdit && (() => onEdit(item))}
              onToggle={onToggle && (() => onToggle(item))}
              onDelete={onDelete && (() => onDelete(item))}
            />
          ))}
        </CardGrid>
      )}
    </>
  );
}
