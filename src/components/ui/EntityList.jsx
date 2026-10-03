import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CircleCheck, CirclePause, Layers } from 'lucide-react';
import { TONES } from '../../nav/moduleIcons';
import CardGrid, { ALTO_TARJETA, ANCHO_TARJETA, GAP_TARJETAS } from './CardGrid';
import EmptyState from './EmptyState';
import EntityCard from './EntityCard';
import LoadingState from './LoadingState';
import StatusBadge from './StatusBadge';
import Table, { ALTO_ENCABEZADO, ALTO_FILA } from './Table';
import ActionButtons from './ActionButtons';
import Pagination from './Pagination';
import StatCard from './StatCard';
import StatGrid from './StatGrid';
import { useLista } from './listaContext';

// Con hasta LIMITE_TARJETAS registros la vista "Automática" muestra tarjetas; con mas, una tabla.
// El usuario puede forzar cualquiera de las dos con el selector de vista (en la barra de filtros).
const LIMITE_TARJETAS = 8;
const MIN_FILAS = 3;
const MAX_OPCIONES_FILTRO = 8; // una columna con mas valores distintos no es "categoria": no genera filtro

/**
 * Listado de un modulo de catalogo. TODAS las pages lo usan, asi que todas comparten:
 * estadisticas, filtros (Estado + selects derivados de las columnas), tarjetas o tabla, y
 * paginacion. Cada Page declara UNA sola vez como se ve un registro en cada vista:
 *
 *   columns  [{ key, header, render? }]     la vista de tabla
 *   card     (item) => ({ icon | initial, title, meta: [...], footer })    la vista de tarjetas (opcional)
 *
 * El badge de Estado y los botones (editar, desactivar/reactivar, eliminar) se agregan solos
 * en ambas vistas; `acciones` suma botones propios del modulo ([{ icon, label, onClick(item), visible?(item) }]).
 * Si el modulo no tiene baja logica (no existe `activo`), no hay badge ni filtro de Estado.
 * `etiquetas` ({ activo, inactivo, desactivar }) renombra el estado y la baja cuando "activo/inactivo" no es lo
 * que significan (ocurrencias: Vigente / Anulada, boton Anular).
 * `puedeEditar(item)` / `puedeAlternar(item)` ocultan esos botones en los registros que ya no admiten
 * el cambio (p. ej. una ocurrencia anulada no se edita ni se reactiva).
 *
 * SIN SCROLL DE PAGINA: el listado ocupa el alto restante de la pantalla y, con "Registros por
 * pagina = Auto", muestra solo las filas/tarjetas que caben; el resto esta en las demas paginas.
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
  acciones = [],
  puedeEditar = () => true,
  puedeAlternar = () => true,
  etiquetas = {},
  getKey = (item) => item.id,
  threshold = LIMITE_TARJETAS,
}) {
  const lista = useLista();
  const setMeta = lista?.setMeta;
  const estadoFiltro = lista?.estado ?? 'todos';
  const valores = lista?.valores;
  const vista = lista?.vista ?? 'auto';
  const busqueda = lista?.busqueda ?? '';

  const [porPagina, setPorPagina] = useState('auto');
  const [paginaElegida, setPaginaElegida] = useState({ n: 1, firma: '' });
  const [caja, setCaja] = useState({ w: 0, h: 0 });
  const cuerpo = useRef(null);

  const conEstado = items.length > 0 && isActive(items[0]) !== undefined;
  // Sin `card` (auditoria, logs) el listado es siempre una tabla y no hay selector de vista.
  const soloTabla = !card;

  // Selects derivados de las columnas: las que muestran "Sí/No" o pocas categorias de texto.
  const defs = useMemo(() => {
    if (items.length === 0) return [];
    return columns
      .map((column) => {
        const textos = items.map((item) => {
          const valor = column.render ? column.render(item) : item[column.key];
          return typeof valor === 'string' ? valor : null;
        });
        if (textos.some((texto) => texto === null || texto === '')) return null;
        const options = [...new Set(textos)].sort((a, b) => a.localeCompare(b, 'es'));
        const esSiNo = options.every((o) => o === 'Sí' || o === 'No');
        const seleccionado = Boolean(valores?.[column.key]);
        const esCategoria = options.length >= 2 && options.length <= MAX_OPCIONES_FILTRO && options.length < items.length;
        return esSiNo || esCategoria || seleccionado ? { key: column.key, label: column.header, options } : null;
      })
      .filter(Boolean)
      .slice(0, 3);
  }, [items, columns, valores]);

  // Publica al contexto que filtros existen (la barra de filtros los dibuja). No se actualiza con
  // listas vacias para que los filtros no desaparezcan mientras una busqueda no devuelve nada.
  const firmaMeta = JSON.stringify({ conEstado, soloTabla, defs });
  useEffect(() => {
    if (items.length === 0) return;
    // Sincroniza el contexto compartido (que filtros ofrece este listado) con los datos cargados.
    setMeta?.(JSON.parse(firmaMeta));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmaMeta, setMeta]);

  const filtrados = useMemo(
    () =>
      items.filter((item) => {
        if (estadoFiltro !== 'todos' && Boolean(isActive(item)) !== (estadoFiltro === 'activos')) return false;
        return defs.every((def) => {
          const elegido = valores?.[def.key];
          if (!elegido) return true;
          const column = columns.find((c) => c.key === def.key);
          const valor = column.render ? column.render(item) : item[column.key];
          return valor === elegido;
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, estadoFiltro, defs, valores, columns],
  );

  const automatica = items.length > threshold ? 'tabla' : 'tarjetas';
  const efectiva = soloTabla ? 'tabla' : vista === 'auto' ? automatica : vista;
  const hayDatos = items.length > 0;
  const sinFiltrados = filtrados.length === 0;

  // Mide el area del listado para saber cuantas filas/tarjetas caben sin hacer scroll.
  useLayoutEffect(() => {
    const el = cuerpo.current;
    if (!el) return undefined;
    const observador = new ResizeObserver(([entrada]) => {
      const { width, height } = entrada.contentRect;
      setCaja((actual) => (actual.w === width && actual.h === height ? actual : { w: width, h: height }));
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, [hayDatos, efectiva, sinFiltrados]);

  let capacidad;
  if (efectiva === 'tabla') {
    capacidad = Math.max(MIN_FILAS, Math.floor((caja.h - ALTO_ENCABEZADO) / ALTO_FILA));
  } else {
    const columnasVisibles = Math.max(1, Math.floor((caja.w + GAP_TARJETAS) / (ANCHO_TARJETA + GAP_TARJETAS)));
    const filasVisibles = Math.max(1, Math.floor((caja.h + GAP_TARJETAS) / (ALTO_TARJETA + GAP_TARJETAS)));
    capacidad = columnasVisibles * filasVisibles;
  }
  const tamano = porPagina === 'auto' ? capacidad : porPagina;

  // La pagina vuelve a 1 cuando cambia cualquier filtro, la busqueda, la vista o el tamaño.
  const firma = JSON.stringify([estadoFiltro, valores, busqueda, efectiva, porPagina]);
  const paginas = Math.max(1, Math.ceil(filtrados.length / tamano));
  const pagina = Math.min(paginaElegida.firma === firma ? paginaElegida.n : 1, paginas);
  const desde = (pagina - 1) * tamano;
  const visibles = filtrados.slice(desde, desde + tamano);

  if (loading && items.length === 0) return <LoadingState message={loadingMessage} />;
  if (items.length === 0) {
    return <EmptyState icon={emptyIcon} message={busqueda ? 'No se encontraron resultados para la búsqueda.' : emptyMessage} />;
  }

  const hayAcciones = onEdit || onToggle || onDelete || acciones.length > 0;
  // Acciones propias del modulo: [{ icon, label, onClick(item) }]; cada una recibe el registro de su fila/tarjeta.
  const extrasDe = (item) =>
    acciones.filter((a) => !a.visible || a.visible(item)).map((a) => ({ ...a, onClick: () => a.onClick(item) }));

  const columnasTabla = [
    ...columns,
    ...(conEstado
      ? [{ key: '_estado', header: 'Estado', render: (item) => <StatusBadge active={isActive(item)} label={isActive(item) ? etiquetas.activo : etiquetas.inactivo} /> }]
      : []),
    ...(hayAcciones
      ? [
          {
            key: '_acciones',
            header: 'Acciones',
            render: (item) => (
              <ActionButtons
                active={conEstado ? isActive(item) : undefined}
                extras={extrasDe(item)}
                labelDesactivar={etiquetas.desactivar}
                onEdit={onEdit && puedeEditar(item) ? () => onEdit(item) : undefined}
                onToggle={onToggle && puedeAlternar(item) ? () => onToggle(item) : undefined}
                onDelete={onDelete && (() => onDelete(item))}
              />
            ),
          },
        ]
      : []),
  ];

  const totalReal = Math.max(total ?? 0, items.length);
  const activos = conEstado ? items.filter((item) => isActive(item)).length : 0;
  const porcentaje = (parte) => (items.length ? Math.round((parte / items.length) * 100) : 0);

  return (
    <>
      {/* Estadisticas derivadas de los registros cargados (nada inventado). `order-[-2]` las sube
          justo debajo de la cabecera aunque la Page declare primero el buscador. */}
      <StatGrid columns={3} className="order-[-2]">
        <StatCard label="Total de registros" value={totalReal} icon={Layers} tone={TONES.blue} />
        {conEstado && (
          <>
            <StatCard
              label="Activos"
              value={activos}
              icon={CircleCheck}
              tone={TONES.green}
              progress={porcentaje(activos)}
            />
            <StatCard
              label="Inactivos"
              value={items.length - activos}
              icon={CirclePause}
              tone={TONES.red}
              progress={porcentaje(items.length - activos)}
            />
          </>
        )}
      </StatGrid>

      {/* Listado: ocupa el alto restante; sin scroll de pagina (el scroll interno es solo de respaldo). */}
      <section
        className={`flex min-h-[260px] flex-1 flex-col overflow-hidden rounded-2xl ${
          efectiva === 'tabla' ? 'border border-line bg-surface shadow-[var(--shadow-card)]' : ''
        } ${loading ? 'opacity-60 transition-opacity' : ''}`}
      >
        <div ref={cuerpo} className="min-h-0 flex-1 overflow-auto">
          {sinFiltrados ? (
            <EmptyState icon={emptyIcon} message="Ningún registro coincide con los filtros seleccionados." />
          ) : efectiva === 'tabla' ? (
            <Table columns={columnasTabla} rows={visibles} getRowKey={getKey} numbered offset={desde} />
          ) : (
            <CardGrid>
              {visibles.map((item) => (
                <EntityCard
                  key={getKey(item)}
                  {...card(item)}
                  active={conEstado ? isActive(item) : undefined}
                  extras={extrasDe(item)}
                  etiquetas={etiquetas}
                  onEdit={onEdit && puedeEditar(item) ? () => onEdit(item) : undefined}
                  onToggle={onToggle && puedeAlternar(item) ? () => onToggle(item) : undefined}
                  onDelete={onDelete && (() => onDelete(item))}
                />
              ))}
            </CardGrid>
          )}
        </div>

        <div className={efectiva === 'tabla' ? '' : 'mt-3 rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]'}>
          <Pagination
            total={filtrados.length}
            pagina={pagina}
            paginas={paginas}
            desde={desde}
            cantidad={visibles.length}
            porPagina={porPagina}
            onPagina={(n) => setPaginaElegida({ n, firma })}
            onPorPagina={setPorPagina}
          />
        </div>
      </section>
    </>
  );
}
