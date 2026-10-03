import { Network, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { requerido, validador } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import UsuarioAmbitoForm from './UsuarioAmbitoForm';

const { emptyForm, mapToForm } = formModel({
  UsuarioId: 'usuario_id',
  MicroredId: 'microred_id',
  EessId: 'eess_id',
});

const validate = validador({ UsuarioId: [requerido] });

const NOMBRES_ALCANCE = { RED: 'Toda la Red', MICRORED: 'Microred', EESS: 'Establecimiento' };
const destino = (item) => item.eess?.nombre ?? item.microred?.nombre ?? 'Toda la Red';

const columns = [
  { key: 'usuario', header: 'Usuario', render: (item) => item.usuario?.nombre ?? '—' },
  { key: 'alcance', header: 'Alcance', render: (item) => NOMBRES_ALCANCE[item.alcance] },
  { key: 'destino', header: 'Ámbito', render: destino },
];

const card = (item) => ({
  icon: Network,
  title: item.usuario?.nombre ?? 'Ámbito de usuario',
  meta: [NOMBRES_ALCANCE[item.alcance], destino(item), item.usuario?.trabajador?.nombre_completo],
  footer: item.alcance,
});

export default function UsuarioAmbitoPage() {
  const crud = useCrudResource({
    endpoint: '/usuarios-ambitos',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'UsuarioAmbitoEstado',
    buildConfirmMessage: (item) => `¿Quitar el ámbito "${destino(item)}" a ${item.usuario?.nombre ?? ''}?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Ámbitos de usuario" subtitle="Seguridad · Ámbito de usuario">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Asignar ámbito
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por usuario o trabajador…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando ámbitos…"
        emptyIcon={Network}
        emptyMessage="No hay ámbitos asignados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar ámbito de usuario' : 'Asignar ámbito a un usuario'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <UsuarioAmbitoForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
