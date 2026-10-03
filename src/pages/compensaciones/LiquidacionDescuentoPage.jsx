import { useState } from 'react';
import { BadgeDollarSign, CircleCheck, ListChecks, Plus, Send } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { ESTADOS_LIQUIDACION, MESES, etiquetaDe } from '../../utils/opciones';
import { formatoSoles } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import GenerarLiquidacionModal from './GenerarLiquidacionModal';
import LineasLiquidacionModal from './LineasLiquidacionModal';

const generada = (item) => item.estado === 'GENERADO';
const aprobada = (item) => item.estado === 'APROBADO';
const anulable = (item) => item.estado === 'GENERADO' || item.estado === 'APROBADO';
const periodo = (item) => (item.consolidado?.mes ? `${etiquetaDe(MESES, String(item.consolidado.mes))} ${item.consolidado.anio}` : '—');

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'periodo', header: 'Período', render: periodo },
  { key: 'descuentos', header: 'Descuentos', render: (item) => `${item.consolidado?.dias_falta ?? 0} falta(s), ${item.consolidado?.minutos_tardanza ?? 0} min` },
  { key: 'importe', header: 'Importe total', render: (item) => formatoSoles(item.importe_total) },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_LIQUIDACION, item.estado) },
];

const card = (item) => ({
  icon: BadgeDollarSign,
  title: item.trabajador?.nombre_completo ?? 'Liquidación de descuentos',
  meta: [periodo(item), `${item.consolidado?.dias_falta ?? 0} falta(s), ${item.consolidado?.minutos_tardanza ?? 0} min de tardanza`, `${item.lineas ?? 0} línea(s) · ${formatoSoles(item.importe_total)}`],
  footer: etiquetaDe(ESTADOS_LIQUIDACION, item.estado),
});

/**
 * Liquidacion de descuentos (RIT, Art. 25). No se edita: se genera desde un consolidado, se completan sus lineas, se
 * aprueba, se remite a la planilla unica de pagos o se anula.
 */
export default function LiquidacionDescuentoPage() {
  const crud = useCrudResource({
    endpoint: '/liquidaciones-descuento',
    emptyForm: {},
    buildConfirmMessage: (item) => `¿Anular la liquidación de ${item.trabajador?.nombre_completo ?? ''} (${periodo(item)})?`,
    deactivateErrorMessage: 'No se pudo anular la liquidación.',
  });
  const acciones = useAccionDeRegistro('/liquidaciones-descuento', { alTerminar: () => crud.cargar() });
  const [generando, setGenerando] = useState(false);
  const [lineas, setLineas] = useState(null);
  const confirmar = (accion, mensaje) => (item) => {
    if (window.confirm(mensaje(item))) acciones.ejecutar(item, { accion });
  };

  return (
    <PageContainer>
      <PageHeader title="Liquidaciones de descuento" subtitle="Compensaciones · Liquidaciones de descuento">
        <Button onClick={() => setGenerando(true)} icon={Plus}>
          Generar liquidación
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} placeholder="Buscar por trabajador o documento…" />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando liquidaciones…"
        emptyIcon={BadgeDollarSign}
        emptyMessage="No hay liquidaciones de descuento todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: ListChecks, label: 'Líneas', onClick: (item) => setLineas(item) },
          {
            icon: CircleCheck,
            label: 'Aprobar',
            visible: generada,
            onClick: confirmar('aprobar', (item) => `¿Aprobar la liquidación de ${item.trabajador?.nombre_completo ?? ''}? Cada línea necesita su importe.`),
          },
          {
            icon: Send,
            label: 'Remitir a planilla',
            visible: aprobada,
            onClick: confirmar('remitir', (item) => `¿Remitir a la planilla única de pagos la liquidación de ${item.trabajador?.nombre_completo ?? ''}? Ya no se podrá anular.`),
          },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={() => false}
        puedeAlternar={anulable}
        onToggle={crud.desactivar}
      />

      <GenerarLiquidacionModal abierto={generando} onClose={() => setGenerando(false)} onGenerada={() => crud.cargar()} />
      <LineasLiquidacionModal liquidacion={lineas} onClose={() => setLineas(null)} alCambiar={() => crud.cargar()} />
    </PageContainer>
  );
}
