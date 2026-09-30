import React, { useState, useEffect, useCallback } from 'react';

import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Shield,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import axios from 'axios';

import PermisoForm from './PermisoForm';

const INITIAL_FORM_STATE = {
  PermisoCodigo: '',
  PermisoNombre: '',
  PermisoModulo: '',
  PermisoEstado: 1,
};

export default function PermisoPage() {
  // =========================================================
  // ESTADOS
  // =========================================================

  const [permisos, setPermisos] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  });

  const [filters, setFilters] = useState({
    buscar: '',
    modulo: '',
    estado: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM_STATE);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  // =========================================================
  // OBTENER PERMISOS
  // =========================================================

  const fetchPermisos = useCallback(
    async (page = 1) => {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await axios.get('/api/permisos', {
          params: {
            buscar: filters.buscar || undefined,
            modulo: filters.modulo || undefined,
            estado:
              filters.estado !== ''
                ? filters.estado
                : undefined,
            por_pagina: pagination.perPage,
            page,
          },
        });

        /*
         * PermisoResource::collection()
         *
         * Laravel devuelve normalmente:
         *
         * {
         *   data: [...],
         *   links: {...},
         *   meta: {...}
         * }
         */

        const responseData = response.data;

        const registros = Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData)
            ? responseData
            : [];

        setPermisos(registros);

        // =====================================================
        // PAGINACIÓN
        // =====================================================

        if (responseData?.meta) {
          setPagination((prev) => ({
            ...prev,
            currentPage:
              responseData.meta.current_page ?? page,

            lastPage:
              responseData.meta.last_page ?? 1,

            total:
              responseData.meta.total ?? registros.length,
          }));
        } else {
          setPagination((prev) => ({
            ...prev,
            currentPage: page,
            lastPage: 1,
            total: registros.length,
          }));
        }
      } catch (error) {
        console.error(
          'Error al cargar permisos:',
          error
        );

        setPermisos([]);

        setErrorMessage(
          error.response?.data?.message ||
            'No se pudieron cargar los permisos.'
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.perPage]
  );

  // =========================================================
  // CARGA INICIAL Y FILTROS
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPermisos(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    filters.buscar,
    filters.modulo,
    filters.estado,
  ]);

  // =========================================================
  // CAMBIO DE FILTROS
  // =========================================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ABRIR MODAL
  // =========================================================

  const handleOpenModal = (permiso = null) => {
    setErrors({});
    setErrorMessage('');

    if (permiso) {
      /*
       * IMPORTANTE:
       *
       * PermisoResource devuelve:
       *
       * id
       * codigo
       * nombre
       * modulo
       * activo
       */

      setEditingId(permiso.id);

      setForm({
        PermisoCodigo: permiso.codigo || '',
        PermisoNombre: permiso.nombre || '',
        PermisoModulo: permiso.modulo || '',
        PermisoEstado: permiso.activo ? 1 : 0,
      });
    } else {
      setEditingId(null);

      setForm({
        ...INITIAL_FORM_STATE,
      });
    }

    setIsModalOpen(true);
  };

  // =========================================================
  // CERRAR MODAL
  // =========================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setEditingId(null);

    setForm({
      ...INITIAL_FORM_STATE,
    });

    setErrors({});
  };

  // =========================================================
  // GUARDAR / ACTUALIZAR
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    setErrors({});

    setErrorMessage('');

    try {
      if (editingId) {
        // ================================================
        // ACTUALIZAR
        // ================================================

        await axios.put(
          `/api/permisos/${editingId}`,
          form
        );
      } else {
        // ================================================
        // CREAR
        // ================================================

        await axios.post(
          '/api/permisos',
          form
        );
      }

      handleCloseModal();

      await fetchPermisos(
        editingId
          ? pagination.currentPage
          : 1
      );
    } catch (error) {
      console.error(
        'Error al guardar permiso:',
        error
      );

      if (
        error.response?.status === 422
      ) {
        setErrors(
          error.response.data.errors || {}
        );
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            'Ocurrió un error al guardar el permiso.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // DESACTIVAR
  // =========================================================

  const handleDesactivar = async (permiso) => {
    const id = permiso.id;

    const confirmado = window.confirm(
      `¿Está seguro de desactivar el permiso "${permiso.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    setLoading(true);

    try {
      await axios.delete(
        `/api/permisos/${id}`
      );

      await fetchPermisos(
        pagination.currentPage
      );
    } catch (error) {
      console.error(
        'Error al desactivar permiso:',
        error
      );

      setErrorMessage(
        error.response?.data?.message ||
          'No se pudo desactivar el permiso.'
      );

      setLoading(false);
    }
  };

  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const handlePreviousPage = () => {
    if (
      pagination.currentPage > 1 &&
      !loading
    ) {
      fetchPermisos(
        pagination.currentPage - 1
      );
    }
  };

  const handleNextPage = () => {
    if (
      pagination.currentPage <
        pagination.lastPage &&
      !loading
    ) {
      fetchPermisos(
        pagination.currentPage + 1
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* =====================================================
          ENCABEZADO
      ====================================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">

            <Shield className="w-7 h-7 text-indigo-600" />

            Gestión de Permisos

          </h1>

          <p className="text-sm text-gray-500">
            Administra los permisos y accesos del sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />

          Nuevo Permiso
        </button>

      </div>

      {/* =====================================================
          MENSAJE DE ERROR
      ====================================================== */}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">

          <AlertCircle className="w-5 h-5" />

          <span className="text-sm">
            {errorMessage}
          </span>

        </div>
      )}

      {/* =====================================================
          FILTROS
      ====================================================== */}

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

          {/* Buscar */}

          <div className="relative">

            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              name="buscar"
              value={filters.buscar}
              onChange={handleFilterChange}
              placeholder="Buscar por código o nombre..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

          </div>

          {/* Módulo */}

          <div className="relative">

            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              name="modulo"
              value={filters.modulo}
              onChange={handleFilterChange}
              placeholder="Filtrar por módulo..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

          </div>

          {/* Estado */}

          <div>

            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >

              <option value="">
                Todos los estados
              </option>

              <option value="1">
                Activos
              </option>

              <option value="0">
                Inactivos
              </option>

            </select>

          </div>

          {/* Refrescar */}

          <div className="flex justify-end">

            <button
              type="button"
              onClick={() =>
                fetchPermisos(
                  pagination.currentPage
                )
              }
              disabled={loading}
              className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors disabled:opacity-50"
              title="Recargar datos"
            >

              <RefreshCw
                className={`w-5 h-5 ${
                  loading
                    ? 'animate-spin'
                    : ''
                }`}
              />

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          TABLA
      ====================================================== */}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm text-gray-600">

            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs border-b border-gray-200">

              <tr>

                <th className="px-6 py-3">
                  Código
                </th>

                <th className="px-6 py-3">
                  Nombre
                </th>

                <th className="px-6 py-3">
                  Módulo
                </th>

                <th className="px-6 py-3">
                  Estado
                </th>

                <th className="px-6 py-3 text-right">
                  Acciones
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-200">

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    Cargando permisos...
                  </td>

                </tr>

              ) : !Array.isArray(permisos) ||
                permisos.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No se encontraron registros.
                  </td>

                </tr>

              ) : (

                permisos.map((permiso) => (

                  <tr
                    key={permiso.id}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    {/* Código */}

                    <td className="px-6 py-4 font-mono font-medium text-gray-900">
                      {permiso.codigo || '-'}
                    </td>

                    {/* Nombre */}

                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {permiso.nombre || '-'}
                    </td>

                    {/* Módulo */}

                    <td className="px-6 py-4">

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">

                        {permiso.modulo || '-'}

                      </span>

                    </td>

                    {/* Estado */}

                    <td className="px-6 py-4">

                      {permiso.activo ? (

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">

                          <CheckCircle2 className="w-3 h-3" />

                          Activo

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">

                          <AlertCircle className="w-3 h-3" />

                          Inactivo

                        </span>

                      )}

                    </td>

                    {/* Acciones */}

                    <td className="px-6 py-4 text-right space-x-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenModal(
                            permiso
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-indigo-600 transition-colors"
                        title="Editar"
                      >

                        <Edit2 className="w-4 h-4" />

                      </button>

                      {permiso.activo && (

                        <button
                          type="button"
                          onClick={() =>
                            handleDesactivar(
                              permiso
                            )
                          }
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                          title="Desactivar"
                        >

                          <Trash2 className="w-4 h-4" />

                        </button>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* ===================================================
            PAGINACIÓN
        ==================================================== */}

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">

          <span className="text-xs text-gray-500">

            Página {pagination.currentPage} de{' '}

            {pagination.lastPage}

            {' '}({pagination.total} registros)

          </span>

          <div className="inline-flex items-center gap-2">

            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={
                pagination.currentPage <= 1 ||
                loading
              }
              className="p-1.5 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
            >

              <ChevronLeft className="w-4 h-4" />

            </button>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={
                pagination.currentPage >=
                  pagination.lastPage ||
                loading
              }
              className="p-1.5 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
            >

              <ChevronRight className="w-4 h-4" />

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          MODAL
      ====================================================== */}

      {isModalOpen && (

        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">

            {/* Header */}

            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">

              <h2 className="text-lg font-bold text-gray-800">

                {editingId
                  ? 'Editar Permiso'
                  : 'Nuevo Permiso'}

              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* Formulario */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
            >

              <PermisoForm
                form={form}
                setForm={setForm}
                errors={errors}
              />

              {/* Botones */}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >

                  {submitting
                    ? 'Guardando...'
                    : editingId
                      ? 'Actualizar'
                      : 'Crear Permiso'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
