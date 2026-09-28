import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Fingerprint,
  FileText,
  Hash,
  Loader2,
  Pencil,
  Plus,
  Power,
  Search,
} from 'lucide-react';

import { api } from '../../api/client';
import Modal from '../../components/Modal';

const campoVacio = {
  codigo: '',
  nombre: '',
  descripcion: '',
};

export default function MetodoMarcacionPage() {
  const [metodos, setMetodos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [buscar, setBuscar] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);

  const [form, setForm] = useState(campoVacio);
  const [erroresForm, setErroresForm] = useState({});

  const [guardando, setGuardando] = useState(false);

  // =========================================================
  // CARGAR MÉTODOS DE MARCACIÓN
  // =========================================================

  async function cargar(filtro = buscar) {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/metodos-marcacion', {
        params: filtro
          ? {
              buscar: filtro,
            }
          : {},
      });

      setMetodos(data.data ?? []);
    } catch (err) {
      console.error(err);

      setError(
        'No se pudo conectar con el backend. ¿Está corriendo "php artisan serve"?'
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    cargar('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // ABRIR MODAL CREAR
  // =========================================================

  function abrirCrear() {
    setEditando(null);
    setForm(campoVacio);
    setErroresForm({});
    setModalOpen(true);
  }

  // =========================================================
  // ABRIR MODAL EDITAR
  // =========================================================

  function abrirEditar(metodo) {
    setEditando(metodo);

    setForm({
      codigo: metodo.codigo ?? '',
      nombre: metodo.nombre ?? '',
      descripcion: metodo.descripcion ?? '',
    });

    setErroresForm({});
    setModalOpen(true);
  }

  // =========================================================
  // GUARDAR
  // POST / PATCH
  // =========================================================

  async function guardar(event) {
    event.preventDefault();

    setGuardando(true);
    setErroresForm({});

    try {
      if (editando) {
        await api.patch(`/metodos-marcacion/${editando.id}`, form);
      } else {
        await api.post('/metodos-marcacion', form);
      }

      setModalOpen(false);

      await cargar();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422) {
        setErroresForm(err.response.data.errors ?? {});
      } else {
        setErroresForm({
          general: [
            'No se pudo guardar. Revisa la conexión con el backend.',
          ],
        });
      }
    } finally {
      setGuardando(false);
    }
  }

  // =========================================================
  // DESACTIVAR
  // DELETE /metodos-marcacion/{id}
  // =========================================================

  async function desactivar(metodo) {
    if (
      !window.confirm(
        `¿Desactivar "${metodo.nombre}"?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/metodos-marcacion/${metodo.id}`);

      await cargar();
    } catch (err) {
      console.error(err);

      setError(
        'No se pudo desactivar el método de marcación.'
      );
    }
  }

  // =========================================================
  // CAMPO DEL FORMULARIO
  // =========================================================

  function campo(name, label, Icon, placeholder = '') {
    return (
      <div>
        <label
          className="mb-1 block text-sm font-medium text-heading"
          htmlFor={name}
        >
          {label}
        </label>

        <div className="relative">
          <Icon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            id={name}
            type="text"
            value={form[name]}
            placeholder={placeholder}
            onChange={(event) =>
              setForm((f) => ({
                ...f,
                [name]: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </div>

        <AnimatePresence initial={false}>
          {erroresForm[name] && (
            <motion.p
              initial={{
                opacity: 0,
                y: -4,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              transition={{
                duration: 0.15,
              }}
              className="mt-1 text-xs text-red-600"
            >
              {erroresForm[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-6">

      {/* =====================================================
          CABECERA
      ====================================================== */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

        <div>
          <h1 className="text-xl font-semibold text-heading">
            Métodos de Marcación
          </h1>

          <p className="text-sm text-muted">
            Biometría · Método de marcación
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <Plus size={16} />

          Nuevo método
        </button>
      </div>

      {/* =====================================================
          BUSCADOR
      ====================================================== */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          cargar();
        }}
        className="mb-5"
      >
        <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">

          <Search
            size={16}
            className="text-muted"
          />

          <input
            type="text"
            value={buscar}
            onChange={(event) =>
              setBuscar(event.target.value)
            }
            placeholder="Buscar por nombre o código…"
            className="w-full text-sm text-heading outline-none placeholder:text-muted"
          />

        </div>
      </form>

      {/* =====================================================
          ERROR GENERAL
      ====================================================== */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          LISTADO
      ====================================================== */}

      {loading ? (

        <div className="flex items-center gap-2 text-sm text-muted">

          <Loader2
            size={16}
            className="animate-spin"
          />

          Cargando métodos de marcación…

        </div>

      ) : metodos.length === 0 ? (

        <div className="rounded-xl border border-line bg-surface p-8 text-center">

          <Fingerprint
            size={32}
            className="mx-auto mb-3 text-muted"
          />

          <p className="text-sm text-muted">
            No hay métodos de marcación registrados todavía.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {metodos.map((metodo) => (

            <motion.div
              key={metodo.id}
              layout
              whileHover={{
                y: -3,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="flex min-h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm hover:shadow-md"
            >

              {/* =================================================
                  INFORMACIÓN
              ================================================== */}

              <div className="flex-1 p-5">

                <div className="flex items-start justify-between gap-2">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">

                    <Fingerprint size={20} />

                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      metodo.activo
                        ? 'bg-green-50 text-accent-green'
                        : 'bg-gray-100 text-muted'
                    }`}
                  >
                    {metodo.activo
                      ? 'Activo'
                      : 'Inactivo'}
                  </span>

                </div>

                {/* NOMBRE */}

                <h3 className="mt-4 line-clamp-2 text-base font-medium leading-tight text-heading">
                  {metodo.nombre}
                </h3>

                {/* CÓDIGO */}

                {metodo.codigo && (
                  <p className="mt-2 text-sm text-muted">
                    Código: {metodo.codigo}
                  </p>
                )}

                {/* DESCRIPCIÓN */}

                {metodo.descripcion && (
                  <p className="mt-2 line-clamp-2 text-xs text-muted">
                    {metodo.descripcion}
                  </p>
                )}

              </div>

              {/* =================================================
                  ACCIONES
              ================================================== */}

              <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">

                <span className="truncate text-xs font-medium text-muted">
                  ID: {metodo.id}
                </span>

                <div className="flex shrink-0 gap-1">

                  {/* EDITAR */}

                  <button
                    type="button"
                    onClick={() =>
                      abrirEditar(metodo)
                    }
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-page hover:text-brand"
                    aria-label="Editar"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>

                  {/* DESACTIVAR */}

                  {metodo.activo ? (
                    <button
                      type="button"
                      onClick={() =>
                        desactivar(metodo)
                      }
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Desactivar"
                      title="Desactivar"
                    >
                      <Power size={14} />
                    </button>
                  ) : null}

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      )}

      {/* =====================================================
          MODAL
      ====================================================== */}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editando
            ? 'Editar método de marcación'
            : 'Nuevo método de marcación'
        }
      >

        <form
          onSubmit={guardar}
          className="space-y-4"
        >

          {/* ERROR GENERAL */}

          {erroresForm.general && (
            <p className="text-sm text-red-600">
              {erroresForm.general[0]}
            </p>
          )}

          {/* CÓDIGO */}

          {campo(
            'codigo',
            'Código',
            Hash,
            'Ej. HUELLA'
          )}

          {/* NOMBRE */}

          {campo(
            'nombre',
            'Nombre',
            Fingerprint,
            'Ej. Huella dactilar'
          )}

          {/* DESCRIPCIÓN */}

          {campo(
            'descripcion',
            'Descripción',
            FileText,
            'Descripción del método'
          )}

          {/* =================================================
              BOTONES
          ================================================== */}

          <div className="flex justify-end gap-2 border-t border-line pt-4">

            <button
              type="button"
              onClick={() =>
                setModalOpen(false)
              }
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-page"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >

              {guardando && (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              )}

              {guardando
                ? 'Guardando…'
                : 'Guardar'}

            </button>

          </div>

        </form>

      </Modal>

    </div>
  );
}