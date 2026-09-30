import { ArrowRightLeft, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import Modal from '../../components/Modal';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import CardGrid from '../../components/ui/CardGrid';
import EntityCard from '../../components/ui/EntityCard';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import TipoCambioTurnoForm from './TipoCambioTurnoForm';

const campoVacio = {
  TipoCambioTurnoCodigo: '',
  TipoCambioTurnoNombre: '',
  TipoCambioTurnoRequiereReemplazante: false,
  TipoCambioTurnoEstado: true,
};

function mapToForm(tipoCambioTurno) {
  return {
    TipoCambioTurnoCodigo:
      tipoCambioTurno.TipoCambioTurnoCodigo ??
      tipoCambioTurno.codigo ??
      '',

    TipoCambioTurnoNombre:
      tipoCambioTurno.TipoCambioTurnoNombre ??
      tipoCambioTurno.nombre ??
      '',

    TipoCambioTurnoRequiereReemplazante:
      Boolean(
        tipoCambioTurno.TipoCambioTurnoRequiereReemplazante ??
        tipoCambioTurno.requiere_reemplazante ??
        false
      ),

    TipoCambioTurnoEstado:
      Boolean(
        tipoCambioTurno.TipoCambioTurnoEstado ??
        tipoCambioTurno.activo ??
        true
      ),
  };
}

export default function TipoCambioTurnoPage() {
  const {
    items: tiposCambioTurno,
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
    endpoint: '/tipos-cambio-turno',
    emptyForm: campoVacio,
    mapToForm,
    deactivateErrorMessage:
      'No se pudo desactivar el tipo de cambio de turno.',
  });

  return (
    <div className="p-6">

      {/* Encabezado */}
      <PageHeader
        title="Tipos de Cambio de Turno"
        subtitle="Programación · Tipo de cambio de turno"
      >
        <Button onClick={abrirCrear} icon={Plus}>
          Nuevo tipo de cambio
        </Button>
      </PageHeader>

      {/* Buscador */}
      <div className="mb-6">
        <SearchInput
          value={buscar}
          onChange={setBuscar}
          onSubmit={() => cargar()}
        />
      </div>

      {/* Error general */}
      {error && <Alert className="mb-4">{error}</Alert>}

      {/* Cargando */}
      {loading ? (
        <LoadingState message="Cargando tipos de cambio de turno…" />

      ) : tiposCambioTurno.length === 0 ? (

        /* Sin registros */
        <EmptyState
          icon={ArrowRightLeft}
          message="No hay tipos de cambio de turno registrados todavía."
        />

      ) : (

        /* Lista */
        <CardGrid>
          {tiposCambioTurno.map((item) => {

            const id =
              item.TipoCambioTurnoId ??
              item.id;

            const nombre =
              item.TipoCambioTurnoNombre ??
              item.nombre;

            const codigo =
              item.TipoCambioTurnoCodigo ??
              item.codigo;

            const requiereReemplazante =
              Boolean(
                item.TipoCambioTurnoRequiereReemplazante ??
                item.requiere_reemplazante
              );

            const activo =
              Boolean(
                item.TipoCambioTurnoEstado ??
                item.activo
              );

            return (
              <EntityCard
                key={id}
                icon={ArrowRightLeft}
                active={activo}
                title={nombre}
                meta={[
                  codigo && `Código: ${codigo}`,

                  requiereReemplazante
                    ? 'Requiere reemplazante'
                    : 'No requiere reemplazante',
                ].filter(Boolean)}
                footer={`ID: ${id}`}
                onEdit={() => abrirEditar(item)}
                onToggle={
                  activo
                    ? () => desactivar(item)
                    : undefined
                }
              />
            );
          })}
        </CardGrid>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={cerrarModal}
        title={
          editando
            ? 'Editar tipo de cambio de turno'
            : 'Nuevo tipo de cambio de turno'
        }
      >
        <Form
          onSubmit={guardar}
          generalError={erroresForm.general?.[0]}
        >
          <TipoCambioTurnoForm
            form={form}
            setForm={setForm}
            errors={erroresForm}
          />

          <FormActions
            onCancel={cerrarModal}
            submitting={guardando}
          />
        </Form>
      </Modal>

    </div>
  );
}