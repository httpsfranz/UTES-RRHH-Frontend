import { House, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, requerido, requeridoSi, validador } from '../../utils/validaciones';
import { ESTADOS_CONSTATACION, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ConstatacionDomiciliariaForm from './ConstatacionDomiciliariaForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  DescansoMedicoId: 'descanso_medico_id',
  DocumentoSustentoId: 'documento_sustento_id',
  UsuarioRegistroId: 'usuario_registro_id',
  ConstatacionDomiciliariaFecha: 'fecha',
  ConstatacionDomiciliariaDireccion: 'direccion',
  ConstatacionDomiciliariaResultado: 'resultado',
  ConstatacionDomiciliariaEstado: ['estado', 'PENDIENTE'],
});

const validate = validador({
  VinculoLaboralId: [requerido],
  ConstatacionDomiciliariaFecha: [requerido, fecha],
  ConstatacionDomiciliariaResultado: [
    requeridoSi((form) => ['CONFORME', 'NO_CONFORME'].includes(form.ConstatacionDomiciliariaEstado), 'Indica el resultado de la visita para resolver la constatación.'),
  ],
});

const pendiente = (item) => item.estado === 'PENDIENTE';
const noAnulada = (item) => item.estado !== 'ANULADO';
const nombreEstado = (item) => etiquetaDe([...ESTADOS_CONSTATACION, { value: 'ANULADO', label: 'Anulada' }], item.estado);

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFecha(item.fecha) },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'descanso', header: 'Descanso (CITT)', render: (item) => item.descanso?.numero_citt ?? '—' },
  { key: 'direccion', header: 'Dirección', render: (item) => item.direccion ?? '—' },
  { key: 'estado', header: 'Resultado', render: nombreEstado },
];

const card = (item) => ({
  icon: House,
  title: item.trabajador?.nombre_completo ?? 'Constatación domiciliaria',
  meta: [formatoFecha(item.fecha), item.direccion, item.descanso?.numero_citt && `Descanso ${item.descanso.numero_citt}`, item.resultado],
  footer: nombreEstado(item),
});

export default function ConstatacionDomiciliariaPage() {
  const crud = useCrudResource({
    endpoint: '/constataciones-domiciliarias',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la constatación de ${item.trabajador?.nombre_completo ?? ''} del ${formatoFecha(item.fecha)}?`,
    deactivateErrorMessage: 'No se pudo anular la constatación.',
  });

  return (
    <PageContainer>
      <PageHeader title="Constatación domiciliaria" subtitle="Solicitudes · Constatación domiciliaria">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva constatación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, dirección o resultado…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando constataciones…"
        emptyIcon={House}
        emptyMessage="No hay constataciones domiciliarias registradas todavía."
        columns={columns}
        card={card}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Resolver o editar constatación' : 'Nueva constatación domiciliaria'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ConstatacionDomiciliariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
