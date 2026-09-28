import { useEffect, useState } from 'react';
import { api } from '../api/client';

// Construye un mapToForm() declarativo sin que cada pagina escriba a mano el
// objeto "campo del form -> campo de la respuesta" con sus `?? ''`. Existe porque
// el formulario de escritura no siempre usa los mismos nombres que la respuesta
// de lectura (p.ej. Microred escribe "MicroredNombre" pero el Resource del
// backend lee "nombre"): ver GUIA_MODULOS_CRUD.md, paso 2.
export function fieldMapper(mapping) {
  return (item) =>
    Object.fromEntries(
      Object.entries(mapping).map(([campoForm, campoApi]) => [campoForm, item[campoApi] ?? ''])
    );
}

const IDENTIDAD = (item) => item;

/**
 * Estado y acciones comunes a cualquier pantalla de catalogo (listar, buscar,
 * crear, editar, desactivar). Las 3 paginas piloto (Microred, TipoEstablecimiento,
 * MetodoMarcacion) solo se diferenciaban en 4 cosas: el endpoint, la forma vacia
 * del formulario, como pasar de "item de la lista" a "formulario" al editar, y el
 * nombre a mostrar en el confirm() de desactivar. Esas 4 cosas son la config;
 * todo lo demas (los 8 useState, cargar/guardar/desactivar, errores 422) vive aca
 * una sola vez, sin ningun "if" por entidad.
 */
export function useCrudResource({
  endpoint,
  emptyForm,
  mapToForm = IDENTIDAD,
  idKey = 'id',
  searchParam = 'buscar',
  buildConfirmMessage = (item) => `¿Desactivar "${item.nombre}"?`,
  connectionErrorMessage = 'No se pudo conectar con el backend. ¿Está corriendo "php artisan serve"?',
  saveErrorMessage = 'No se pudo guardar. Revisa la conexión con el backend.',
  deactivateErrorMessage = 'No se pudo desactivar el registro.',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null); // null = creando, item = editando
  const [form, setForm] = useState(emptyForm);
  const [erroresForm, setErroresForm] = useState({});
  const [guardando, setGuardando] = useState(false);

  async function cargar(filtro = buscar) {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(endpoint, {
        params: filtro ? { [searchParam]: filtro } : {},
      });
      setItems(data.data ?? []);
    } catch {
      setError(connectionErrorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Carga inicial: sincroniza la lista con el backend al montar la pagina.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargar('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirCrear() {
    setEditando(null);
    setForm(emptyForm);
    setErroresForm({});
    setModalOpen(true);
  }

  function abrirEditar(item) {
    setEditando(item);
    setForm(mapToForm(item));
    setErroresForm({});
    setModalOpen(true);
  }

  function cerrarModal() {
    setModalOpen(false);
  }

  async function guardar(event) {
    event.preventDefault();
    setGuardando(true);
    setErroresForm({});
    try {
      if (editando) {
        await api.patch(`${endpoint}/${editando[idKey]}`, form);
      } else {
        await api.post(endpoint, form);
      }
      setModalOpen(false);
      await cargar();
    } catch (err) {
      if (err.response?.status === 422) {
        setErroresForm(err.response.data.errors ?? {});
      } else {
        setErroresForm({ general: [saveErrorMessage] });
      }
    } finally {
      setGuardando(false);
    }
  }

  async function desactivar(item) {
    if (!window.confirm(buildConfirmMessage(item))) return;
    try {
      await api.delete(`${endpoint}/${item[idKey]}`);
      await cargar();
    } catch {
      setError(deactivateErrorMessage);
    }
  }

  return {
    items,
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
  };
}
