import { Plus, UserCheck } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { fecha, noAnteriorA, requerido, validador } from '../../utils/validaciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResponsableEessForm from './ResponsableEessForm';

const { emptyForm, mapToForm } = formModel({
  EessId: 'eess_id',
  VinculoLaboralId: 'vinculo_laboral_id',
  TipoResponsabilidadId: 'tipo_responsabilidad_id',
  DocumentoSustentoId: 'documento_sustento_id',
  ResponsableEessFechaInicio: 'fecha_inicio',
  ResponsableEessFechaFin: 'fecha_fin',
  ResponsableEessDocumentoNumero: 'documento_numero',
  ResponsableEessObservacion: 'observacion',
});

const validate = validador({
  EessId: [requerido],
  VinculoLaboralId: [requerido],
  TipoResponsabilidadId: [requerido],
  ResponsableEessFechaInicio: [requerido, fecha],
  ResponsableEessFechaFin: [fecha, noAnteriorA('ResponsableEessFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
});

const vigencia = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'vigente'}`;

const columns = [
  { key: 'eess', header: 'Establecimiento', render: (item) => item.eess?.nombre ?? '—' },
  { key: 'tipo', header: 'Responsabilidad', render: (item) => item.tipo_responsabilidad?.nombre ?? '—' },
  { key: 'trabajador', header: 'Responsable', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'vigencia', header: 'Designación', render: vigencia },
];

const card = (item) => ({
  icon: UserCheck,
  title: item.trabajador?.nombre_completo ?? 'Responsable',
  meta: [item.tipo_responsabilidad?.nombre, item.eess?.nombre, vigencia(item), item.documento_numero],
  footer: item.eess?.codigo,
});

export default function ResponsableEessPage() {
  const crud = useCrudResource({
    endpoint: '/responsables-eess',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'ResponsableEessEstado',
    buildConfirmMessage: (item) => `¿Desactivar la designación de ${item.trabajador?.nombre_completo ?? ''} como ${item.tipo_responsabilidad?.nombre ?? 'responsable'}?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Responsables de EESS" subtitle="Organización · Responsable de establecimiento">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva designación
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por responsable, documento u observación…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando responsables…"
        emptyIcon={UserCheck}
        emptyMessage="No hay responsables designados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar designación' : 'Nueva designación de responsable'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <ResponsableEessForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
