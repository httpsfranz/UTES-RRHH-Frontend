import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2,
  FileText,
  Hash,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Power,
  Search,
} from 'lucide-react';
import { api } from '../../api/client';
import Modal from '../../components/Modal';

// El backend (MicroredController) no envuelve la respuesta en un Resource: devuelve
// el paginador crudo de Laravel, con los nombres de columna tal cual estan en SQL
// Server (MicroredId, MicroredCodigo, ...). Por eso este formulario usa esos mismos
// nombres de campo en vez de camelCase/snake_case "bonito".
const campoVacio = {
  MicroredCodigo: '',
  MicroredNombre: '',
  MicroredDistrito: '',
  MicroredUbigeo: '',
  MicroredDireccion: '',
  MicroredTelefono: '',
  MicroredDescripcion: '',
};

export default function MicroredPage() {
  const [microredes, setMicroredes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buscar, setBuscar] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null); // null = creando, objeto = editando
  const [form, setForm] = useState(campoVacio);
  const [erroresForm, setErroresForm] = useState({});
  const [guardando, setGuardando] = useState(false);

  async function cargar(filtro = buscar) {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/microredes', {
        params: filtro ? { buscar: filtro } : {},
      });
      setMicroredes(data.data ?? []);
    } catch {
      setError('No se pudo conectar con el backend. ¿Está corriendo "php artisan serve"?');
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
    setForm(campoVacio);
    setErroresForm({});
    setModalOpen(true);
  }

  function abrirEditar(microred) {
    setEditando(microred);
    setForm({
      MicroredCodigo: microred.MicroredCodigo ?? '',
      MicroredNombre: microred.MicroredNombre ?? '',
      MicroredDistrito: microred.MicroredDistrito ?? '',
      MicroredUbigeo: microred.MicroredUbigeo ?? '',
      MicroredDireccion: microred.MicroredDireccion ?? '',
      MicroredTelefono: microred.MicroredTelefono ?? '',
      MicroredDescripcion: microred.MicroredDescripcion ?? '',
    });
    setErroresForm({});
    setModalOpen(true);
  }

  async function guardar(event) {
    event.preventDefault();
    setGuardando(true);
    setErroresForm({});
    try {
      if (editando) {
        await api.patch(`/microredes/${editando.MicroredId}`, form);
      } else {
        await api.post('/microredes', form);
      }
      setModalOpen(false);
      await cargar();
    } catch (err) {
      if (err.response?.status === 422) {
        setErroresForm(err.response.data.errors ?? {});
      } else {
        setErroresForm({ general: ['No se pudo guardar. Revisa la conexión con el backend.'] });
      }
    } finally {
      setGuardando(false);
    }
  }

  async function desactivar(microred) {
    if (!window.confirm(`¿Desactivar "${microred.MicroredNombre}"?`)) return;
    await api.delete(`/microredes/${microred.MicroredId}`);
    cargar();
  }

  function campo(name, label, Icon) {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-heading" htmlFor={name}>
          {label}
        </label>
        <div className="relative">
          <Icon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id={name}
            type="text"
            value={form[name]}
            onChange={(event) => setForm((f) => ({ ...f, [name]: event.target.value }))}
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm text-heading outline-none transition-colors focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </div>
        <AnimatePresence initial={false}>
          {erroresForm[name] && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mt-1 text-xs text-red-600"
            >
              {erroresForm[name][0]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-heading">Microredes</h1>
          <p className="text-sm text-muted">Organización · Microred</p>
        </div>
        <button
          type="button"
          onClick={abrirCrear}
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <Plus size={16} />
          Nueva microred
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          cargar();
        }}
        className="mb-5"
      >
        <div className="flex w-full max-w-sm items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            value={buscar}
            onChange={(event) => setBuscar(event.target.value)}
            placeholder="Buscar por nombre o código…"
            className="w-full text-sm text-heading outline-none placeholder:text-muted"
          />
        </div>
      </form>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Cargando…</p>
      ) : microredes.length === 0 ? (
        <p className="text-sm text-muted">No hay microredes registradas todavía.</p>
      ) : (
        // Tarjetas verticales redondeadas: bloque de info arriba, franja de
        // acciones abajo separada por borde — la misma composicion del ejemplo,
        // sin la animacion de apilado/abanico (se muestran todas de una vez).
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {microredes.map((microred) => (
            <motion.div
              key={microred.MicroredId}
              layout
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex h-56 flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface shadow-sm hover:shadow-md"
            >
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-sm font-semibold text-brand">
                    {microred.MicroredNombre?.[0] ?? 'M'}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      microred.MicroredEstado
                        ? 'bg-green-50 text-accent-green'
                        : 'bg-gray-100 text-muted'
                    }`}
                  >
                    {microred.MicroredEstado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-2 text-base font-medium leading-tight text-heading">
                  {microred.MicroredNombre}
                </h3>
                {microred.MicroredDistrito && (
                  <p className="mt-1 text-sm text-muted">{microred.MicroredDistrito}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
                <span className="truncate text-xs font-medium text-muted">
                  {microred.MicroredCodigo}
                </span>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => abrirEditar(microred)}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-page hover:text-brand"
                    aria-label="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  {microred.MicroredEstado ? (
                    <button
                      type="button"
                      onClick={() => desactivar(microred)}
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Desactivar"
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editando ? 'Editar microred' : 'Nueva microred'}
      >
        <form onSubmit={guardar} className="space-y-4">
          {erroresForm.general && <p className="text-sm text-red-600">{erroresForm.general[0]}</p>}

          <div className="grid grid-cols-2 gap-4">
            {campo('MicroredCodigo', 'Código', Hash)}
            {campo('MicroredUbigeo', 'Ubigeo', MapPin)}
          </div>
          {campo('MicroredNombre', 'Nombre', Building2)}
          <div className="grid grid-cols-2 gap-4">
            {campo('MicroredDistrito', 'Distrito', MapPin)}
            {campo('MicroredTelefono', 'Teléfono', Phone)}
          </div>
          {campo('MicroredDireccion', 'Dirección', MapPin)}
          {campo('MicroredDescripcion', 'Descripción', FileText)}

          <div className="flex justify-end gap-2 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-page"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {guardando && <Loader2 size={14} className="animate-spin" />}
              {guardando ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
