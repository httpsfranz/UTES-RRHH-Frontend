import { FileText, Plus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';

import Modal from '../../components/Modal';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

import TipoPeriodoProgramacionForm from '../../components/forms/TipoPeriodoProgramacionForm';

export default function TipoPeriodoProgramacionPage() {
  const {
    items,
    loading,
    error,
    search,
    setSearch,
    modalOpen,
    editingItem,
    form,
    setForm,
    errors,
    openCreate,
    openEdit,
    closeModal,
    handleSubmit,
    handleDelete,
  } = useCrudResource({
    endpoint: '/tipos-periodo-programacion',

    initialForm: {
      TipoPeriodoProgramacionCodigo: '',
      TipoPeriodoProgramacionNombre: '',
      TipoPeriodoProgramacionEstado: true,
    },
  });

  return (
    <div className="space-y-6">

      {/* Encabezado */}
      <PageHeader
        title="Tipos de Periodo de Programación"
        description="Gestiona los tipos de periodo utilizados en la programación."
        icon={FileText}
        action={
          <Button
            onClick={openCreate}
            icon={Plus}
          >
            Nuevo tipo de periodo
          </Button>
        }
      />

      {/* Alerta */}
      {error && <Alert type="error">{error}</Alert>}

      {/* Buscador */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por código o nombre..."
      />

      {/* Contenido */}
      {loading ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState
          title="No hay tipos de periodo"
          description="No se encontraron registros de tipos de periodo de programación."
          action={
            <Button
              onClick={openCreate}
              icon={Plus}
            >
              Crear tipo de periodo
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Código
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Nombre
                  </th>

                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                    Estado
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {items.map((item) => (
                  <tr
                    key={
                      item.id ||
                      item.TipoPeriodoProgramacionId
                    }
                    className="hover:bg-gray-50"
                  >

                    {/* Código */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.TipoPeriodoProgramacionCodigo}
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.TipoPeriodoProgramacionNombre}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">
                      {Boolean(
                        item.TipoPeriodoProgramacionEstado
                      ) ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Inactivo
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEdit(item)}
                        >
                          Editar
                        </Button>

                        {Boolean(
                          item.TipoPeriodoProgramacionEstado
                        ) && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            Desactivar
                          </Button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal crear / editar */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingItem
            ? 'Editar tipo de periodo'
            : 'Nuevo tipo de periodo'
        }
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <TipoPeriodoProgramacionForm
            form={form}
            setForm={setForm}
            errors={errors}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {editingItem
                ? 'Actualizar'
                : 'Guardar'}
            </Button>

          </div>

        </form>

      </Modal>

    </div>
  );
}