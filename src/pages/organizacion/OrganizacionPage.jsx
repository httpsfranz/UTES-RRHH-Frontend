import { useState } from 'react';
import { Hospital, Network, Plus, UserPlus } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { tonoDeArea } from '../../nav/moduleIcons';
import { hoyLocal } from '../../utils/marcacion';
import { designacionVigente, establecimiento, microred, responsable, vigenciaDeDesignacion } from './organizacionModelos';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Toolbar from '../../components/ui/Toolbar';
import CampoBusqueda from '../../components/ui/CampoBusqueda';
import Alert from '../../components/ui/Alert';
import ZonaDesplazable from '../../components/ui/ZonaDesplazable';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import GrupoPlegable from '../../components/ui/GrupoPlegable';
import GrillaDeTarjetas from '../../components/ui/GrillaDeTarjetas';
import TarjetaResumen from '../../components/ui/TarjetaResumen';
import ActionButtons from '../../components/ui/ActionButtons';
import Modal from '../../components/Modal';
import DatosDeRegistro from '../../components/ui/DatosDeRegistro';
import ListaDeRegistros from '../../components/ui/ListaDeRegistros';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import FormModal from '../../components/ui/FormModal';
import MicroredForm from './MicroredForm';
import EstablecimientoSaludForm from './EstablecimientoSaludForm';
import ResponsableEessForm from './ResponsableEessForm';

const TONO = tonoDeArea('Organización');
const coincide = (texto, buscar) => (texto ?? '').toLowerCase().includes(buscar);
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const porNombre = (a, b) => Number(b.activo) - Number(a.activo) || a.nombre.localeCompare(b.nombre, 'es');

/**
 * Organizacion de la Red en una sola pantalla: las microredes como tarjetas que se despliegan para mostrar sus
 * establecimientos; cada establecimiento abre su ficha con sus datos y sus responsables (jefe, responsable de control
 * de asistencia...), donde tambien se designan. Reemplaza las tres pantallas sueltas (microredes, establecimientos y
 * responsables).
 */
export default function OrganizacionPage() {
  const microredes = useCrudResource({
    endpoint: '/microredes',
    ...microred,
    estadoKey: 'MicroredEstado',
    buildConfirmMessage: (item) => `¿Desactivar la microred "${item.nombre}"?`,
  });
  const eess = useCrudResource({
    endpoint: '/establecimientos',
    ...establecimiento,
    estadoKey: 'EessEstado',
    buildConfirmMessage: (item) => `¿Desactivar el establecimiento "${item.nombre}"?`,
  });
  const responsables = useCrudResource({
    endpoint: '/responsables-eess',
    ...responsable,
    estadoKey: 'ResponsableEessEstado',
    buildConfirmMessage: (item) => `¿Desactivar la designación de ${item.trabajador?.nombre_completo ?? ''} como ${item.tipo_responsabilidad?.nombre ?? 'responsable'}?`,
  });

  const [buscar, setBuscar] = useState('');
  const [abiertas, setAbiertas] = useState(() => new Set());
  const [fichaId, setFichaId] = useState(null);
  const hoy = hoyLocal();
  const texto = buscar.trim().toLowerCase();

  const responsablesDe = (eessId) => responsables.items.filter((r) => String(r.eess_id) === String(eessId));
  const vigentesDe = (eessId) => responsablesDe(eessId).filter((r) => designacionVigente(r, hoy));
  const coincideEess = (e) =>
    !texto || coincide(e.nombre, texto) || coincide(e.codigo, texto) || coincide(e.renipres, texto) || vigentesDe(e.id).some((r) => coincide(r.trabajador?.nombre_completo, texto));

  const grupos = [...microredes.items].sort(porNombre).map((m) => {
    const todos = eess.items.filter((e) => String(e.microred_id) === String(m.id));
    const visibles = (coincide(m.nombre, texto) ? todos : todos.filter(coincideEess)).sort(porNombre);
    return { microred: m, todos, visibles, mostrar: !texto || coincide(m.nombre, texto) || visibles.length > 0 };
  });
  const ficha = eess.items.find((e) => e.id === fichaId) ?? null;
  const cargando = microredes.loading || eess.loading;

  function alternar(id) {
    setAbiertas((actual) => {
      const siguiente = new Set(actual);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }

  function nuevoEess(microredId) {
    eess.abrirCrear();
    eess.setForm((f) => ({ ...f, MicroredId: microredId }));
  }

  function nuevoResponsable(eessId) {
    responsables.abrirCrear();
    responsables.setForm((f) => ({ ...f, EessId: eessId, ResponsableEessFechaInicio: hoy }));
  }

  return (
    <PageContainer>
      <PageHeader title="Organización" subtitle="Microredes, sus establecimientos y los responsables de cada uno. Pulsa una microred para ver sus establecimientos.">
        {microredes.abrirCrear && (
          <Button variant="secondary" onClick={microredes.abrirCrear} icon={Plus}>
            Nueva microred
          </Button>
        )}
        {eess.abrirCrear && (
          <Button onClick={() => nuevoEess('')} icon={Plus}>
            Nuevo establecimiento
          </Button>
        )}
      </PageHeader>

      <Toolbar>
        <CampoBusqueda value={buscar} onChange={setBuscar} placeholder="Buscar microred, establecimiento, código o responsable…" />
      </Toolbar>

      <Alert>{microredes.error || eess.error || responsables.error}</Alert>

      {cargando ? (
        <LoadingState message="Cargando la organización…" />
      ) : (
        <ZonaDesplazable>
          {grupos.filter((g) => g.mostrar).length === 0 && <EmptyState message="Ninguna microred o establecimiento coincide con la búsqueda." />}
          {grupos
            .filter((g) => g.mostrar)
            .map(({ microred: m, todos, visibles }) => (
              <GrupoPlegable
                key={m.id}
                icono={Network}
                tono={TONO}
                titulo={m.nombre}
                datos={[plural(todos.filter((e) => e.activo).length, 'establecimiento', 'establecimientos'), m.distrito, m.telefono && `Tel. ${m.telefono}`, m.codigo]}
                abierto={Boolean(texto) || abiertas.has(m.id)}
                onAlternar={() => alternar(m.id)}
                inactivo={!m.activo}
                acciones={
                  <ActionButtons
                    active={m.activo}
                    extras={eess.abrirCrear && m.activo ? [{ icon: Plus, label: 'Nuevo establecimiento en esta microred', onClick: () => nuevoEess(m.id) }] : []}
                    onEdit={microredes.abrirEditar ? () => microredes.abrirEditar(m) : undefined}
                    onToggle={microredes.alternarEstado ? () => microredes.alternarEstado(m) : undefined}
                  />
                }
              >
                {visibles.length === 0 ? (
                  <EmptyState message="Esta microred aún no tiene establecimientos." />
                ) : (
                  <GrillaDeTarjetas>
                    {visibles.map((e) => {
                      const vigentes = vigentesDe(e.id);
                      return (
                        <TarjetaResumen
                          key={e.id}
                          titulo={e.nombre}
                          lineas={[[e.tipo?.nombre, e.categoria].filter(Boolean).join(' · '), plural(e.trabajadores_total ?? 0, 'trabajador', 'trabajadores')]}
                          destacado={vigentes.length ? vigentes.map((r) => r.trabajador?.nombre_completo).join(' · ') : 'Sin responsable designado'}
                          inactivo={!e.activo}
                          onClick={() => setFichaId(e.id)}
                        />
                      );
                    })}
                  </GrillaDeTarjetas>
                )}
              </GrupoPlegable>
            ))}
        </ZonaDesplazable>
      )}

      {/* Ficha del establecimiento: sus datos y sus responsables (vigentes y anteriores). */}
      <Modal open={Boolean(ficha)} onClose={() => setFichaId(null)} title={ficha?.nombre ?? ''} size="lg">
        {ficha && (
          <div className="space-y-5">
            <DatosDeRegistro
              items={[
                { label: 'Microred', value: ficha.microred?.nombre },
                { label: 'Tipo', value: ficha.tipo?.nombre },
                { label: 'Categoría', value: ficha.categoria },
                { label: 'Código', value: ficha.codigo },
                { label: 'RENIPRESS', value: ficha.renipres },
                { label: 'Dirección', value: ficha.direccion },
                { label: 'Teléfono', value: ficha.telefono },
                { label: 'Ubigeo', value: ficha.ubigeo },
                { label: 'Trabajadores vigentes', value: String(ficha.trabajadores_total ?? 0) },
                { label: 'Estado', value: ficha.activo ? 'Activo' : 'Inactivo' },
              ]}
            />
            <ListaDeRegistros
              titulo="Responsables"
              vacio="Este establecimiento aún no tiene responsables designados."
              accion={
                responsables.abrirCrear &&
                ficha.activo && (
                  <Button variant="secondary" icon={UserPlus} onClick={() => nuevoResponsable(ficha.id)}>
                    Designar responsable
                  </Button>
                )
              }
              filas={responsablesDe(ficha.id)
                .sort((a, b) => Number(designacionVigente(b, hoy)) - Number(designacionVigente(a, hoy)) || (b.fecha_inicio ?? '').localeCompare(a.fecha_inicio ?? ''))
                .map((r) => ({
                  id: r.id,
                  titulo: `${r.trabajador?.nombre_completo ?? 'Responsable'} · ${r.tipo_responsabilidad?.nombre ?? ''}`,
                  detalle: [vigenciaDeDesignacion(r), r.documento_numero, designacionVigente(r, hoy) ? null : 'no vigente'].filter(Boolean).join(' · '),
                  activo: r.activo,
                  onEdit: responsables.abrirEditar ? () => responsables.abrirEditar(r) : undefined,
                  onToggle: responsables.alternarEstado ? () => responsables.alternarEstado(r) : undefined,
                }))}
            />
            <AccionesDeModal>
              <Button variant="secondary" onClick={() => setFichaId(null)}>
                Cerrar
              </Button>
              {eess.alternarEstado && (
                <Button variant="secondary" onClick={() => eess.alternarEstado(ficha)}>
                  {ficha.activo ? 'Desactivar' : 'Reactivar'}
                </Button>
              )}
              {eess.abrirEditar && (
                <Button icon={Hospital} onClick={() => eess.abrirEditar(ficha)}>
                  Editar establecimiento
                </Button>
              )}
            </AccionesDeModal>
          </div>
        )}
      </Modal>

      <FormModal
        open={microredes.modalOpen}
        onClose={microredes.cerrarModal}
        title={microredes.editando ? 'Editar microred' : 'Nueva microred'}
        onSubmit={microredes.guardar}
        error={microredes.erroresForm.general?.[0]}
        submitting={microredes.guardando}
      >
        <MicroredForm form={microredes.form} setForm={microredes.setForm} errors={microredes.erroresForm} editando={microredes.editando} />
      </FormModal>

      <FormModal
        open={eess.modalOpen}
        onClose={eess.cerrarModal}
        title={eess.editando ? 'Editar establecimiento de salud' : 'Nuevo establecimiento de salud'}
        onSubmit={eess.guardar}
        error={eess.erroresForm.general?.[0]}
        submitting={eess.guardando}
      >
        <EstablecimientoSaludForm form={eess.form} setForm={eess.setForm} errors={eess.erroresForm} />
      </FormModal>

      <FormModal
        open={responsables.modalOpen}
        onClose={responsables.cerrarModal}
        title={responsables.editando ? 'Editar designación' : 'Designar responsable'}
        onSubmit={responsables.guardar}
        error={responsables.erroresForm.general?.[0]}
        submitting={responsables.guardando}
      >
        <ResponsableEessForm form={responsables.form} setForm={responsables.setForm} errors={responsables.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}

