import { useState } from 'react';
import { BarChart3, Calculator, ListTree, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { entero, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_CONSOLIDADO, MESES, etiquetaDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ConsolidadoAsistenciaForm from './ConsolidadoAsistenciaForm';
import GenerarConsolidadoModal from './GenerarConsolidadoModal';
import DetalleConsolidadoModal from './DetalleConsolidadoModal';

const { emptyForm, mapToForm } = formModel({
  PeriodoAsistenciaId: 'periodo_asistencia_id',
  VinculoLaboralId: 'vinculo_laboral_id',
  ConsolidadoAsistenciaDiasTrabajados: ['dias_trabajados', 0],
  ConsolidadoAsistenciaDiasFalta: ['dias_falta', 0],
  ConsolidadoAsistenciaDiasFaltaJustificada: ['dias_falta_justificada', 0],
  ConsolidadoAsistenciaMinutosTardanza: ['minutos_tardanza', 0],
  ConsolidadoAsistenciaMinutosExtra: ['minutos_extra', 0],
  ConsolidadoAsistenciaEstado: ['estado', 'GENERADO'],
});

const dias = () => (valor) => (/^\d+(\.\d{1,2})?$/.test(String(valor)) && Number(valor) <= 31 ? null : 'Debe ser un número de 0 a 31, con hasta 2 decimales.');
const periodo = (item) => (item.periodo ? `${etiquetaDe(MESES, String(item.periodo.mes))} ${item.periodo.anio}` : '—');
const editable = (item) => item.estado !== 'CERRADO' && item.estado !== 'CONFORME';

const columns = [
  { key: 'periodo', header: 'Período', render: periodo },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'dias_trabajados', header: 'Trabajados' },
  { key: 'dias_falta', header: 'Faltas' },
  { key: 'dias_falta_justificada', header: 'Justificadas' },
  { key: 'minutos_tardanza', header: 'Tardanza (min)' },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_CONSOLIDADO, item.estado) },
];

const card = (item) => ({
  icon: BarChart3,
  title: item.trabajador?.nombre_completo ?? 'Consolidado',
  meta: [periodo(item), `${item.dias_trabajados} días trabajados`, `${item.dias_falta} faltas, ${item.dias_falta_justificada} justificadas`, `${item.minutos_tardanza} min de tardanza`],
  footer: etiquetaDe(ESTADOS_CONSOLIDADO, item.estado),
});

export default function ConsolidadoAsistenciaPage() {
  const validate = validador({
    PeriodoAsistenciaId: [requerido],
    VinculoLaboralId: [requerido],
    ConsolidadoAsistenciaDiasTrabajados: [dias()],
    ConsolidadoAsistenciaDiasFalta: [dias()],
    ConsolidadoAsistenciaDiasFaltaJustificada: [dias()],
    ConsolidadoAsistenciaMinutosTardanza: [entero({ min: 0, max: 60000 })],
    ConsolidadoAsistenciaMinutosExtra: [entero({ min: 0, max: 60000 })],
  });

  const crud = useCrudResource({
    endpoint: '/consolidados-asistencia',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Eliminar el consolidado de ${item.trabajador?.nombre_completo ?? ''} (${periodo(item)})?`,
    deactivateErrorMessage: 'No se pudo eliminar el consolidado.',
  });
  const [generando, setGenerando] = useState(false);
  const [verDetalle, setVerDetalle] = useState(null);

  return (
    <PageContainer>
      <PageHeader title="Consolidado de asistencia" subtitle="Consolidación · Consolidado de asistencia">
        <Button onClick={() => setGenerando(true)} icon={Calculator}>
          Generar consolidado
        </Button>
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo consolidado
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador o documento…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando consolidados…"
        emptyIcon={BarChart3}
        emptyMessage="No hay consolidados de asistencia todavía."
        columns={columns}
        card={card}
        acciones={[{ icon: ListTree, label: 'Detalle diario', onClick: setVerDetalle }]}
        puedeEditar={editable}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar consolidado' : 'Nuevo consolidado de asistencia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ConsolidadoAsistenciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>

      <GenerarConsolidadoModal abierto={generando} onClose={() => setGenerando(false)} onGenerado={() => crud.cargar()} />
      <DetalleConsolidadoModal consolidado={verDetalle} onClose={() => setVerDetalle(null)} />
    </PageContainer>
  );
}
