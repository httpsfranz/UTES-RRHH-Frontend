import { Eye, FileText, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useCrudResource } from '../../hooks/useCrudResource';

import Modal from '../../components/Modal';
import PageHeader from '../../components/ui/PageHeader';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

import AuditoriaForm from './AuditoriaForm';

export default function AuditoriaPage() {
  const {
    data,
    loading,
    error,
    fetchData,
  } = useCrudResource('/auditoria');

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);

  const [filters, setFilters] = useState({
    esquema: '',
    tabla: '',
    operacion: '',
    usuario_id: '',
    desde: '',
    hasta: '',
    por_pagina: 15,
  });

  const [search, setSearch] = useState('');

  /*
   * Cargar auditorías
   */
  useEffect(() => {
    cargarAuditorias();
  }, []);

  const cargarAuditorias = async (customFilters = filters) => {
    const params = new URLSearchParams();

    if (customFilters.esquema) {
      params.append('esquema', customFilters.esquema);
    }

    if (customFilters.tabla) {
      params.append('tabla', customFilters.tabla);
    }

    if (customFilters.operacion) {
      params.append('operacion', customFilters.operacion);
    }

    if (customFilters.usuario_id) {
      params.append('usuario_id', customFilters.usuario_id);
    }

    if (customFilters.desde) {
      params.append('desde', customFilters.desde);
    }

    if (customFilters.hasta) {
      params.append('hasta', customFilters.hasta);
    }

    params.append('por_pagina', customFilters.por_pagina || 15);

    await fetchData(`?${params.toString()}`);
  };

  /*
   * Ver detalle de auditoría
   */
  const handleView = (auditoria) => {
    setSelectedAuditoria(auditoria);

    setForm({
      AuditoriaId:
        auditoria.AuditoriaId ??
        auditoria.id ??
        '',

      AuditoriaEsquema:
        auditoria.AuditoriaEsquema ??
        '',

      AuditoriaTabla:
        auditoria.AuditoriaTabla ??
        '',

      AuditoriaOperacion:
        auditoria.AuditoriaOperacion ??
        '',

      UsuarioId:
        auditoria.UsuarioId ??
        '',

      AuditoriaFechaHora:
        auditoria.AuditoriaFechaHora ??
        '',

      AuditoriaDetalle:
        auditoria.AuditoriaDetalle ??
        '',
    });

    setErrors({});
  };

  /*
   * Cerrar modal
   */
  const handleClose = () => {
    setSelectedAuditoria(null);
    setForm({});
    setErrors({});
  };

  /*
   * Aplicar filtros
   */
  const handleFilter = (e) => {
    e.preventDefault();
    cargarAuditorias(filters);
  };

  /*
   * Limpiar filtros
   */
  const handleClearFilters = () => {
    const cleanFilters = {
      esquema: '',
      tabla: '',
      operacion: '',
      usuario_id: '',
      desde: '',
      hasta: '',
      por_pagina: 15,
    };

    setFilters(cleanFilters);
    setSearch('');

    cargarAuditorias(cleanFilters);
  };

  /*
   * Obtener registros.
   *
   * Laravel Resource puede devolver:
   * {
   *   data: [...]
   * }
   *
   * o directamente un array dependiendo
   * de cómo esté configurado el hook.
   */
  const auditorias = Array.isArray(data)
    ? data
    : data?.data || [];

  /*
   * Búsqueda visual adicional
   */
  const filteredAuditorias = auditorias.filter((auditoria) => {
    if (!search.trim()) return true;

    const texto = search.toLowerCase();

    return (
      String(auditoria.AuditoriaEsquema ?? '')
        .toLowerCase()
        .includes(texto) ||

      String(auditoria.AuditoriaTabla ?? '')
        .toLowerCase()
        .includes(texto) ||

      String(auditoria.AuditoriaOperacion ?? '')
        .toLowerCase()
        .includes(texto) ||

      String(auditoria.UsuarioId ?? '')
        .toLowerCase()
        .includes(texto)
    );
  });

  return (
    <div className="space-y-6">

      {/* Cabecera */}
      <PageHeader
        title="Auditoría"
        description="Consulta el historial de operaciones realizadas en el sistema."
        icon={FileText}
      />

      {/* Filtros */}
      <div className="bg-white rounded-lg border p-4">

        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} />
          <h2 className="font-semibold">
            Filtros de auditoría
          </h2>
        </div>

        <form
          onSubmit={handleFilter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >

          {/* Esquema */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Esquema
            </label>

            <input
              type="text"
              value={filters.esquema}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  esquema: e.target.value,
                })
              }
              placeholder="Ej. Organizacion"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Tabla */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tabla
            </label>

            <input
              type="text"
              value={filters.tabla}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tabla: e.target.value,
                })
              }
              placeholder="Ej. Microred"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Operación */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Operación
            </label>

            <select
              value={filters.operacion}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  operacion: e.target.value,
                })
              }
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Todas</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Usuario
            </label>

            <input
              type="number"
              value={filters.usuario_id}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  usuario_id: e.target.value,
                })
              }
              placeholder="ID del usuario"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Desde */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Desde
            </label>

            <input
              type="date"
              value={filters.desde}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  desde: e.target.value,
                })
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Hasta */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Hasta
            </label>

            <input
              type="date"
              value={filters.hasta}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  hasta: e.target.value,
                })
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {/* Botones */}
          <div className="md:col-span-2 lg:col-span-3 flex gap-2">

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Filtrar
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Limpiar
            </button>

          </div>

        </form>
      </div>

      {/* Búsqueda */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por esquema, tabla, operación o usuario..."
      />

      {/* Error */}
      {error && (
        <Alert type="error">
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <LoadingState />
      ) : filteredAuditorias.length === 0 ? (

        <EmptyState
          title="No hay registros de auditoría"
          description="No se encontraron registros con los filtros seleccionados."
        />

      ) : (

        <div className="bg-white rounded-lg border overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Fecha y hora
                  </th>

                  <th className="px-4 py-3 text-left">
                    Esquema
                  </th>

                  <th className="px-4 py-3 text-left">
                    Tabla
                  </th>

                  <th className="px-4 py-3 text-left">
                    Operación
                  </th>

                  <th className="px-4 py-3 text-left">
                    Usuario
                  </th>

                  <th className="px-4 py-3 text-center">
                    Acción
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {filteredAuditorias.map((auditoria) => (

                  <tr
                    key={
                      auditoria.AuditoriaId ??
                      auditoria.id
                    }
                    className="hover:bg-gray-50"
                  >

                    <td className="px-4 py-3">
                      {auditoria.AuditoriaFechaHora ?? '-'}
                    </td>

                    <td className="px-4 py-3">
                      {auditoria.AuditoriaEsquema ?? '-'}
                    </td>

                    <td className="px-4 py-3">
                      {auditoria.AuditoriaTabla ?? '-'}
                    </td>

                    <td className="px-4 py-3">

                      <span className="px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">
                        {auditoria.AuditoriaOperacion ?? '-'}
                      </span>

                    </td>

                    <td className="px-4 py-3">
                      {auditoria.UsuarioId ?? '-'}
                    </td>

                    <td className="px-4 py-3 text-center">

                      <button
                        type="button"
                        onClick={() => handleView(auditoria)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-gray-50"
                      >
                        <Eye size={16} />
                        Ver
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

      {/* Modal detalle */}
      {selectedAuditoria && (

        <Modal
          isOpen={!!selectedAuditoria}
          onClose={handleClose}
          title="Detalle de auditoría"
        >

          <AuditoriaForm
            form={form}
            setForm={setForm}
            errors={errors}
          />

          <div className="flex justify-end mt-6">

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Cerrar
            </button>

          </div>

        </Modal>

      )}

    </div>
  );
}
