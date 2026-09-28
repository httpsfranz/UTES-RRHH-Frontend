import { Building2, Plus } from 'lucide-react';
import { fieldMapper, useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
//import CardGrid from '../../components/ui/CardGrid';
//import EntityCard from '../../components/ui/EntityCard';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import MicroredForm from './MicroredForm';

import { Pencil, Power } from 'lucide-react';
import Table from '../../components/ui/Table';
import StatusBadge from '../../components/ui/StatusBadge';

const campoVacio = {
  MicroredCodigo: '',
  MicroredNombre: '',
  MicroredDistrito: '',
  MicroredUbigeo: '',
  MicroredDireccion: '',
  MicroredTelefono: '',
  MicroredDescripcion: '',
};

// El form escribe en PascalCase (asi lo valida MicroredRequest en el backend)
// pero la respuesta de lectura viene en camelCase (MicroredResource); fieldMapper
// traduce de una a otra al abrir "Editar".
const mapToForm = fieldMapper({
  MicroredCodigo: 'codigo',
  MicroredNombre: 'nombre',
  MicroredDistrito: 'distrito',
  MicroredUbigeo: 'ubigeo',
  MicroredDireccion: 'direccion',
  MicroredTelefono: 'telefono',
  MicroredDescripcion: 'descripcion',
});

export default function MicroredPage() {
  const {
    items: microredes,
    loading,
    error,
    buscar,
    setBuscar,
    cargar,
    modalOpen,
    editando,
    form,
    setForm,
    erroresForm,
    guardando,
    abrirCrear,
    abrirEditar,
    cerrarModal,
    guardar,
    desactivar,
  } = useCrudResource({
    endpoint: '/microredes',
    emptyForm: campoVacio,
    mapToForm,
  });

  //aca 

   const columnasMicrored = [
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'distrito', header: 'Distrito' },
    {
      key: 'estado',
      header: 'Estado',
      render: (microred) => <StatusBadge active={microred.activo} />,
    },
    {
      key: 'acciones',
      header: '',
      render: (microred) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => abrirEditar(microred)}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-page hover:text-brand"
            aria-label="Editar"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          {microred.activo && (
            <button
              type="button"
              onClick={() => desactivar(microred)}
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Desactivar"
              title="Desactivar"
            >
              <Power size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader title="Microredes" subtitle="Organización · Microred">
        <Button onClick={abrirCrear} icon={Plus}>
          Nueva microred
        </Button>
      </PageHeader>

      <SearchInput value={buscar} onChange={setBuscar} onSubmit={() => cargar()} />

      <Alert>{error}</Alert>


      {/*
  {loading ? (
    <LoadingState message="Cargando microredes…" />
  ) : microredes.length === 0 ? (
    <EmptyState icon={Building2} message="No hay microredes registradas todavía." />
  ) : (
    <CardGrid>
      {microredes.map((microred) => (
        <EntityCard
          key={microred.id}
          initial={microred.nombre?.[0] ?? 'M'}
          active={microred.activo}
          title={microred.nombre}
          meta={[microred.distrito]}
          footer={microred.codigo}
          onEdit={() => abrirEditar(microred)}
          onToggle={microred.activo ? () => desactivar(microred) : undefined}
        />
      ))}
    </CardGrid>
  )}
*/}
   
    {loading ? (
        <LoadingState message="Cargando microredes…" />
      ) : microredes.length === 0 ? (
        <EmptyState icon={Building2} message="No hay microredes registradas todavía." />
      ) : (
        <Table columns={columnasMicrored} rows={microredes} />
      )}

      <Modal open={modalOpen} onClose={cerrarModal} title={editando ? 'Editar microred' : 'Nueva microred'}>
        <Form onSubmit={guardar} generalError={erroresForm.general?.[0]}>
          <MicroredForm form={form} setForm={setForm} errors={erroresForm} />
          <FormActions onCancel={cerrarModal} submitting={guardando} />
        </Form>
      </Modal>
    </div>
  );
}
