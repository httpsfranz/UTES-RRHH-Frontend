import { useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { mensajeDeError, traerTodo } from '../api/paginado';

/**
 * Declara el formulario de un modulo una sola vez y deriva de ahi lo que el hook necesita.
 *
 * CONTRATO DE LA API (manual de desarrollo, secciones 4 y 7):
 *   - Lo que SALE (Resource) es snake_case en espanol: { id, codigo, nombre, activo, ... }.
 *   - Lo que ENTRA (Form Request) usa el nombre real de la columna: MicroredCodigo, MicroredNombre...
 * Por eso el formulario escribe con los nombres de columna (se envia tal cual) y aqui se declara
 * de que campo de la respuesta se rellena cada uno al editar:
 *
 *   const { emptyForm, mapToForm } = formModel({
 *     MicroredCodigo: 'codigo',                        // texto: vacio por defecto
 *     CondicionLaboralEsPermanente: ['es_permanente', false],   // [campo de la respuesta, valor por defecto]
 *   });
 *
 * Un modulo que escriba en claves distintas a las del Request (p. ej. `codigo` en vez de
 * `ParametroSistemaCodigo`) recibe un 422 en cada guardado: es el error mas comun de este proyecto.
 */
export function formModel(spec) {
  const entradas = Object.entries(spec).map(([campoForm, definicion]) => {
    const [campoApi, valorPorDefecto = ''] = Array.isArray(definicion) ? definicion : [definicion];
    return { campoForm, campoApi, valorPorDefecto };
  });

  const emptyForm = Object.fromEntries(entradas.map((e) => [e.campoForm, e.valorPorDefecto]));

  const mapToForm = (item) =>
    Object.fromEntries(
      entradas.map(({ campoForm, campoApi, valorPorDefecto }) => {
        const valor = item[campoApi];
        return [campoForm, typeof valorPorDefecto === 'boolean' ? Boolean(valor ?? valorPorDefecto) : (valor ?? valorPorDefecto)];
      })
    );

  return { emptyForm, mapToForm };
}

const IDENTIDAD = (item) => item;

// `emptyForm` puede ser una funcion cuando algun valor inicial depende del momento (p. ej. la fecha y hora de hoy).
const valorInicial = (emptyForm) => (typeof emptyForm === 'function' ? emptyForm() : emptyForm);

/**
 * Estado y acciones comunes a cualquier pantalla de catalogo: listar (todas las paginas), buscar,
 * crear, editar, desactivar/reactivar. La unica diferencia entre modulos entra por config; el hook
 * nunca tiene un `if` por entidad.
 *
 * Config:
 *   endpoint        ruta de la API (/microredes)                                   [obligatoria]
 *   emptyForm       forma inicial del formulario                                   [obligatoria]
 *   mapToForm       item de la lista -> formulario al editar (ver formModel)
 *   validate        form -> { campo: [mensajes] } antes de enviar (ver validador)
 *   estadoKey       columna BIT de baja logica (MicroredEstado): habilita reactivar()
 *   idKey           clave del id en la respuesta (default 'id')
 *   searchParam     query param de busqueda (default 'buscar')
 *   limite          si se indica, NO se traen todas las paginas: solo las primeras `limite` filas
 *                   (auditoria, logs: pueden ser miles). `total` informa cuantas hay en realidad.
 *   buildConfirmMessage / *ErrorMessage   textos propios del modulo
 */
export function useCrudResource({
  endpoint,
  emptyForm,
  mapToForm = IDENTIDAD,
  validate,
  estadoKey,
  idKey = 'id',
  searchParam = 'buscar',
  limite,
  buildConfirmMessage = (item) => `¿Desactivar "${item.nombre}"?`,
  connectionErrorMessage = 'No se pudo conectar con el backend. ¿Está corriendo "php artisan serve"?',
  saveErrorMessage = 'No se pudo guardar. Revisa la conexión con el backend.',
  deactivateErrorMessage = 'No se pudo desactivar el registro.',
  reactivateErrorMessage = 'No se pudo reactivar el registro.',
}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null); // null = creando, item = editando
  const [form, setForm] = useState(() => valorInicial(emptyForm));
  const [erroresForm, setErroresForm] = useState({});
  const [guardando, setGuardando] = useState(false);

  // Solo la ultima consulta puede actualizar la pantalla: si el usuario escribe rapido, una
  // respuesta lenta de una busqueda anterior no debe pisar a la actual.
  const ultimaConsulta = useRef(0);

  async function cargar(filtro = buscar) {
    const consulta = ++ultimaConsulta.current;
    setLoading(true);
    setError('');
    try {
      const params = filtro ? { [searchParam]: filtro } : {};
      let filas;
      let cantidad;
      if (limite) {
        const { data } = await api.get(endpoint, { params: { ...params, por_pagina: limite } });
        filas = data.data ?? [];
        cantidad = data.meta?.total ?? filas.length;
      } else {
        filas = await traerTodo(endpoint, params);
        cantidad = filas.length;
      }
      if (consulta !== ultimaConsulta.current) return;
      setItems(filas);
      setTotal(cantidad);
    } catch (err) {
      if (consulta !== ultimaConsulta.current) return;
      setError(err.response ? (mensajeDeError(err) ?? connectionErrorMessage) : connectionErrorMessage);
    } finally {
      if (consulta === ultimaConsulta.current) setLoading(false);
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
    setForm(valorInicial(emptyForm));
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
    setErroresForm({});

    // Validacion de usuario: corta antes de molestar al servidor.
    const erroresLocales = validate ? validate(form) : {};
    if (Object.keys(erroresLocales).length > 0) {
      setErroresForm(erroresLocales);
      return;
    }

    setGuardando(true);
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
        setErroresForm(err.response.data.errors ?? { general: [err.response.data.message ?? saveErrorMessage] });
      } else {
        setErroresForm({ general: [mensajeDeError(err) ?? saveErrorMessage] });
      }
    } finally {
      setGuardando(false);
    }
  }

  async function desactivar(item) {
    if (!window.confirm(buildConfirmMessage(item))) return;
    setError('');
    try {
      await api.delete(`${endpoint}/${item[idKey]}`);
      await cargar();
    } catch (err) {
      setError(mensajeDeError(err) ?? deactivateErrorMessage);
    }
  }

  async function reactivar(item) {
    if (!estadoKey) return;
    setError('');
    try {
      await api.patch(`${endpoint}/${item[idKey]}`, { [estadoKey]: true });
      await cargar();
    } catch (err) {
      setError(mensajeDeError(err) ?? reactivateErrorMessage);
    }
  }

  // Una sola accion para el boton de estado de tarjetas y filas: desactiva si esta activo y
  // reactiva si esta inactivo.
  function alternarEstado(item) {
    return item.activo ? desactivar(item) : reactivar(item);
  }

  return {
    items,
    total,
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
    reactivar,
    alternarEstado,
  };
}
