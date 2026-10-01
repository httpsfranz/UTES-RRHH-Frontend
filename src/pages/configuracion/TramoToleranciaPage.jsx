import { Percent, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { validador, entero, noMenorQue, requerido, unoDe } from '../../utils/validaciones';
import { TIPOS_TRAMO, etiquetaDe, valoresDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TramoToleranciaForm from './TramoToleranciaForm';

const { emptyForm, mapToForm } = formModel({
  TablaToleranciaId: 'tabla_tolerancia_id',
  TramoToleranciaTipo: ['tipo', 'TARDANZA'],
  TramoToleranciaMinutosDesde: 'minutos_desde',
  TramoToleranciaMinutosHasta: 'minutos_hasta',
  TramoToleranciaMinutosDescuento: 'minutos_descuento',
  TramoToleranciaDescripcion: 'descripcion',
  TramoToleranciaEsInasistencia: ['es_inasistencia', false],
});

const validate = validador({
  TablaToleranciaId: [requerido],
  TramoToleranciaTipo: [requerido, unoDe(valoresDe(TIPOS_TRAMO))],
  TramoToleranciaMinutosDesde: [requerido, entero({ min: 0, max: 1440 })],
  TramoToleranciaMinutosHasta: [entero({ min: 0, max: 1440 }), noMenorQue('TramoToleranciaMinutosDesde', 'El tramo no puede terminar antes de empezar.')],
  TramoToleranciaMinutosDescuento: [entero({ min: 0, max: 1440 })],
});

const columns = [
  { key: 'escala', header: 'Escala', render: (item) => item.tabla_tolerancia?.nombre ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_TRAMO, item.tipo) },
  { key: 'rango', header: 'Minutos', render: (item) => item.minutos_hasta === null ? `desde ${item.minutos_desde}` : `${item.minutos_desde} a ${item.minutos_hasta}` },
  { key: 'descuento', header: 'Descuento', render: (item) => item.es_inasistencia ? 'Inasistencia' : item.minutos_descuento === null ? '—' : `${item.minutos_descuento} min` },
];

const card = (item) => ({
  icon: Percent,
  title: item.minutos_hasta === null ? `Desde el minuto ${item.minutos_desde}` : `Minutos ${item.minutos_desde} a ${item.minutos_hasta}`,
  meta: [item.tabla_tolerancia?.nombre, etiquetaDe(TIPOS_TRAMO, item.tipo), item.es_inasistencia ? 'Inasistencia injustificada' : item.minutos_descuento !== null && `Descuenta ${item.minutos_descuento} min`, item.descripcion],
  footer: `ID: ${item.id}`,
});

export default function TramoToleranciaPage() {
  const crud = useCrudResource({
    endpoint: '/tramos-tolerancia',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Eliminar el tramo de ${item.minutos_desde} min${item.minutos_hasta === null ? " en adelante" : ` a ${item.minutos_hasta} min`}?`,
    deactivateErrorMessage: 'No se pudo eliminar el tramo.',
  });

  return (
    <PageContainer>
      <PageHeader title="Tramos de tolerancia" subtitle="Configuración · Tramo de tolerancia">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo tramo
        </Button>
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando tramos de tolerancia…"
        emptyIcon={Percent}
        emptyMessage="No hay tramos de tolerancia registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onDelete={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar tramo de tolerancia' : 'Nuevo tramo de tolerancia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TramoToleranciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
