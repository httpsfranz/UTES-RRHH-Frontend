import { Fingerprint, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { requerido, requeridoSi, unoDe, validador } from '../../utils/validaciones';
import { DEDOS, TIPOS_PLANTILLA, etiquetaDe, valoresDe } from '../../utils/opciones';
import { formatoBytes, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import PlantillaBiometricaForm from './PlantillaBiometricaForm';

const { emptyForm, mapToForm } = formModel({
  TrabajadorId: 'trabajador_id',
  PlantillaBiometricaTipo: ['tipo', 'ROSTRO'],
  PlantillaBiometricaDedo: 'dedo',
});

const validate = validador({
  TrabajadorId: [requerido],
  PlantillaBiometricaTipo: [requerido, unoDe(valoresDe(TIPOS_PLANTILLA))],
  PlantillaBiometricaDedo: [requeridoSi((form) => form.PlantillaBiometricaTipo === 'HUELLA', 'Indica el dedo de la huella.'), unoDe(valoresDe(DEDOS))],
});

const detalle = (item) => (item.dedo ? etiquetaDe(DEDOS, item.dedo) : 'Reconocimiento facial');
const referencia = (item) => (item.tiene_referencia ? `Referencia de ${formatoBytes(item.referencia_bytes)}` : 'Pendiente de enrolamiento');

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => etiquetaDe(TIPOS_PLANTILLA, item.tipo) },
  { key: 'dedo', header: 'Detalle', render: detalle },
  { key: 'referencia', header: 'Referencia', render: referencia },
  { key: 'fecha_registro', header: 'Registrada', render: (item) => formatoFechaHora(item.fecha_registro) },
];

const card = (item) => ({
  icon: Fingerprint,
  title: item.trabajador?.nombre_completo ?? 'Plantilla biométrica',
  meta: [etiquetaDe(TIPOS_PLANTILLA, item.tipo), item.dedo && etiquetaDe(DEDOS, item.dedo), referencia(item), `Registrada ${formatoFechaHora(item.fecha_registro)}`],
  footer: item.trabajador?.numero_documento && `Doc. ${item.trabajador.numero_documento}`,
});

export default function PlantillaBiometricaPage() {
  const crud = useCrudResource({
    endpoint: '/plantillas-biometricas',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'PlantillaBiometricaEstado',
    buildConfirmMessage: (item) => `¿Desactivar la plantilla biométrica de "${item.trabajador?.nombre_completo ?? ''}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Plantillas biométricas" subtitle="Biometría · Plantilla biométrica">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva plantilla
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
        loadingMessage="Cargando plantillas biométricas…"
        emptyIcon={Fingerprint}
        emptyMessage="No hay plantillas biométricas registradas todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar plantilla biométrica' : 'Nueva plantilla biométrica'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <PlantillaBiometricaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
