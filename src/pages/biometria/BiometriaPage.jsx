import { lazy, useState } from 'react';
import { Fingerprint, ScanFace, ShieldCheck, ShieldOff, Smartphone, UserCheck } from 'lucide-react';
import { api } from '../../api/client';
import { useOpciones } from '../../hooks/useOpciones';
import { useResumenBiometrico } from '../../hooks/useResumenBiometrico';
import { fechaIso, formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import CampoBusqueda from '../../components/ui/CampoBusqueda';
import Toolbar from '../../components/ui/Toolbar';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ModalDePagina from '../../components/ui/ModalDePagina';
import GestionBiometricaForm from './GestionBiometricaForm';

const DispositivoMarcacionPage = lazy(() => import('./DispositivoMarcacionPage'));
const MetodoMarcacionPage = lazy(() => import('./MetodoMarcacionPage'));

const consentimiento = (f) => (f.consiente === null ? 'Sin registrar' : f.consiente ? `Sí (${formatoFecha(f.fecha_consentimiento)})` : `No (${formatoFecha(f.fecha_consentimiento)})`);
const plantilla = (f) => (f.plantilla_facial ? (f.plantilla_facial.con_referencia ? 'Enrolada' : 'Pendiente de enrolar') : 'Sin plantilla');
const manual = (f) =>
  f.autorizacion_manual?.vigente ? `Hasta ${f.autorizacion_manual.hasta ? formatoFecha(f.autorizacion_manual.hasta) : 'sin fin'}` : f.autorizacion_manual ? 'No vigente' : '—';

const columns = [
  { key: 'dni', header: 'DNI' },
  { key: 'nombre', header: 'Trabajador' },
  { key: 'eess', header: 'Establecimiento' },
  { key: 'metodo', header: 'Marca con', render: (f) => (f.metodo === 'MANUAL' ? 'Registro manual' : 'Reconocimiento facial') },
  { key: 'consiente', header: 'Consentimiento', render: consentimiento },
  { key: 'plantilla', header: 'Plantilla facial', render: plantilla },
  { key: 'manual', header: 'Autorización manual', render: manual },
];

const card = (f) => ({
  icon: f.metodo === 'MANUAL' ? Fingerprint : ScanFace,
  title: f.nombre,
  meta: [`Marca con ${f.metodo === 'MANUAL' ? 'registro manual' : 'reconocimiento facial'}`, `Consentimiento: ${consentimiento(f)}`, `Plantilla: ${plantilla(f)}`],
  footer: `DNI ${f.dni}`,
});

const FORMULARIOS = {
  autorizar: { titulo: 'Autorizar marcación manual', vacio: () => ({ AutorizacionMetodoFechaInicio: fechaIso(new Date()), AutorizacionMetodoFechaFin: '' }) },
  consentimiento: { titulo: 'Registrar consentimiento biométrico', vacio: () => ({ ConsentimientoBiometricoAceptado: '1' }) },
  plantilla: { titulo: 'Registrar plantilla facial', vacio: () => ({}) },
};

/**
 * Biometria en UNA pantalla (RIT, Art. 21): por trabajador, como marca (reconocimiento facial o registro manual
 * autorizado), su consentimiento (si / no, con fecha) y su plantilla facial. Las acciones de cada fila escriben en
 * su tabla; dispositivos y metodos se administran desde los botones de la cabecera.
 */
export default function BiometriaPage() {
  const resumen = useResumenBiometrico();
  const metodos = useOpciones('/metodos-marcacion');
  const manualId = metodos.filas.find((m) => m.codigo === 'MANUAL')?.id;
  const [accion, setAccion] = useState(null); // { modo, fila }
  const [form, setForm] = useState({});
  const [errorForm, setErrorForm] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [catalogo, setCatalogo] = useState(null);

  function abrir(modo, fila) {
    setAccion({ modo, fila });
    setForm(FORMULARIOS[modo].vacio());
    setErrorForm('');
  }

  async function guardar(event) {
    event.preventDefault();
    const { modo, fila } = accion;
    setGuardando(true);
    const error = await resumen.ejecutar(() => {
      if (modo === 'autorizar') {
        const datos = { TrabajadorId: fila.trabajador_id, MetodoMarcacionId: manualId, AutorizacionMetodoFechaInicio: form.AutorizacionMetodoFechaInicio, AutorizacionMetodoFechaFin: form.AutorizacionMetodoFechaFin || null, AutorizacionMetodoEstado: true };
        return fila.autorizacion_manual ? api.patch(`/autorizaciones-metodo/${fila.autorizacion_manual.id}`, datos) : api.post('/autorizaciones-metodo', datos);
      }
      if (modo === 'consentimiento') {
        return api.post('/consentimientos-biometricos', { TrabajadorId: fila.trabajador_id, ConsentimientoBiometricoAceptado: form.ConsentimientoBiometricoAceptado === '1' });
      }
      return api.post('/plantillas-biometricas', { TrabajadorId: fila.trabajador_id, PlantillaBiometricaTipo: 'ROSTRO' });
    });
    setGuardando(false);
    if (error) setErrorForm(error);
    else setAccion(null);
  }

  async function revocar(fila) {
    if (!window.confirm(`¿Revocar la autorización de marcación manual de ${fila.nombre}?`)) return;
    const error = await resumen.ejecutar(() => api.delete(`/autorizaciones-metodo/${fila.autorizacion_manual.id}`));
    if (error) resumen.setError(error);
  }

  return (
    <PageContainer>
      <PageHeader title="Administración biométrica" subtitle="Método de marcación, consentimiento y plantilla facial de cada trabajador (RIT, Art. 21).">
        <Button variant="secondary" icon={Smartphone} onClick={() => setCatalogo({ titulo: 'Dispositivos de marcación', pagina: DispositivoMarcacionPage })}>
          Dispositivos
        </Button>
        <Button variant="secondary" icon={Fingerprint} onClick={() => setCatalogo({ titulo: 'Métodos de marcación', pagina: MetodoMarcacionPage })}>
          Métodos
        </Button>
      </PageHeader>

      <Toolbar>
        <CampoBusqueda value={resumen.buscar} onChange={resumen.setBuscar} onBuscar={() => resumen.cargar(resumen.buscar)} placeholder="Buscar trabajador por nombre o DNI…" />
      </Toolbar>

      <Alert>{resumen.error}</Alert>

      <EntityList
        items={resumen.filas}
        total={resumen.filas.length}
        loading={resumen.cargando}
        loadingMessage="Cargando información biométrica…"
        emptyIcon={ScanFace}
        emptyMessage="No hay trabajadores con vínculo vigente."
        columns={columns}
        card={card}
        getKey={(f) => f.trabajador_id}
        isActive={() => undefined}
        acciones={[
          { icon: ShieldCheck, label: 'Registrar consentimiento', onClick: (f) => abrir('consentimiento', f) },
          { icon: ScanFace, label: 'Registrar plantilla facial', visible: (f) => f.consiente === true && !f.plantilla_facial, onClick: (f) => abrir('plantilla', f) },
          { icon: UserCheck, label: 'Autorizar marcación manual', visible: (f) => !f.autorizacion_manual?.vigente, onClick: (f) => abrir('autorizar', f) },
          { icon: ShieldOff, label: 'Revocar marcación manual', visible: (f) => f.autorizacion_manual?.vigente, onClick: revocar },
        ]}
      />

      <FormModal
        open={Boolean(accion)}
        onClose={() => setAccion(null)}
        title={accion ? `${FORMULARIOS[accion.modo].titulo} · ${accion.fila.nombre}` : ''}
        onSubmit={guardar}
        error={errorForm}
        submitting={guardando}
      >
        {accion && <GestionBiometricaForm modo={accion.modo} form={form} setForm={setForm} errors={{}} />}
      </FormModal>

      <ModalDePagina abierto={Boolean(catalogo)} onClose={() => setCatalogo(null)} titulo={catalogo?.titulo} pagina={catalogo?.pagina} />
    </PageContainer>
  );
}
