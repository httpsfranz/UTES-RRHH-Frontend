import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ExternalLink, Inbox, X } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useConsulta } from '../../hooks/useConsulta';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Toolbar from '../../components/ui/Toolbar';
import CampoBusqueda from '../../components/ui/CampoBusqueda';
import Segmentado from '../../components/ui/Segmentado';
import FiltroDeChips from '../../components/ui/FiltroDeChips';
import Alert from '../../components/ui/Alert';
import AvisoExito from '../../components/ui/AvisoExito';
import EntityList from '../../components/ui/EntityList';
import ResolucionModal from '../../components/ui/ResolucionModal';

const ESTADOS = { PENDIENTE: 'Pendiente', APROBADO: 'Aprobado', RECHAZADO: 'Rechazado', ANULADO: 'Anulado' };
const VISTAS = [
  { value: 'PENDIENTE', label: 'Por resolver' },
  { value: 'TODOS', label: 'Historial' },
];

const periodo = (s) => (s.fecha_fin && s.fecha_fin !== s.fecha ? `${formatoFecha(s.fecha)} – ${formatoFecha(s.fecha_fin)}` : formatoFecha(s.fecha));
const esperando = (s) => (s.dias_esperando === null ? '—' : s.dias_esperando === 0 ? 'Hoy' : `${s.dias_esperando} d`);

const columnas = [
  { key: 'tipo_nombre', header: 'Solicitud' },
  { key: 'trabajador', header: 'Trabajador', render: (s) => `${s.trabajador ?? '—'} · DNI ${s.dni ?? '—'}` },
  { key: 'eess', header: 'Establecimiento' },
  { key: 'fecha', header: 'Fecha', render: periodo },
  { key: 'detalle', header: 'Detalle' },
  { key: 'esperando', header: 'Espera', render: esperando },
  { key: 'estado', header: 'Estado', render: (s) => ESTADOS[s.estado] ?? s.estado },
];

const tarjeta = (s) => ({
  icon: Inbox,
  title: `${s.tipo_nombre} · ${s.trabajador ?? ''}`,
  meta: [periodo(s), s.detalle, s.eess, `${ESTADOS[s.estado]}${s.dias_esperando ? ` hace ${s.dias_esperando} d` : ''}`],
  footer: `DNI ${s.dni ?? '—'}`,
});

/**
 * Bandeja unica: todo lo que espera aprobacion (justificaciones, ajustes, papeletas, licencias, descansos, vacaciones,
 * cambios de turno, informes de guardia y horas por compensar) en una sola lista, lo mas antiguo primero, con Aprobar
 * y Rechazar a la mano. Para quien solo es TRABAJADOR es "Mis solicitudes": ve el estado de las suyas, sin acciones.
 */
export default function BandejaDeSolicitudesPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const propias = Boolean(auth.alcance?.propio);
  const [vista, setVista] = useState(propias ? 'TODOS' : 'PENDIENTE');
  const [tipo, setTipo] = useState('todos');
  const [buscar, setBuscar] = useState('');
  const [resolviendo, setResolviendo] = useState(null); // { item, accion }
  const [aviso, setAviso] = useState('');
  const consulta = useConsulta('/bandeja-solicitudes', { estado: vista });
  // Las acciones son las de cada recurso: POST /{tipo}/{id}/aprobar | rechazar.
  const acciones = useAccionDeRegistro('', { idKey: 'ruta', alTerminar: () => consulta.recargar() });

  const todas = (consulta.datos?.solicitudes ?? []).map((s) => ({ ...s, ruta: `${s.tipo}/${s.id}` }));
  const texto = buscar.trim().toLowerCase();
  const visibles = todas.filter(
    (s) => (tipo === 'todos' || s.tipo === tipo) && (!texto || `${s.trabajador} ${s.dni} ${s.eess} ${s.detalle}`.toLowerCase().includes(texto))
  );
  const resumen = consulta.datos?.resumen ?? [];
  const chips = [
    { clave: 'todos', etiqueta: 'Todas', cantidad: todas.length },
    ...resumen.map((r) => ({ clave: r.tipo, etiqueta: r.nombre, cantidad: todas.filter((s) => s.tipo === r.tipo).length })).filter((c) => c.cantidad > 0),
  ];

  async function resolver(item, accion, form) {
    const resultado = await acciones.ejecutar(item, { accion, cuerpo: form, enModal: true });
    if (resultado.ok) setAviso(`${item.tipo_nombre} de ${item.trabajador} ${accion === 'aprobar' ? 'aprobada' : 'rechazada'}.`);
    return resultado;
  }

  return (
    <PageContainer>
      <PageHeader
        title={propias ? 'Mis solicitudes' : 'Bandeja de solicitudes'}
        subtitle={
          propias
            ? 'El estado de tus papeletas, licencias, justificaciones y vacaciones. Las registra tu jefe o RRHH.'
            : 'Todo lo que espera tu aprobación, lo más antiguo primero. Aprueba o rechaza sin cambiar de pantalla.'
        }
      />

      <Toolbar>
        <Segmentado opciones={VISTAS} value={vista} onChange={setVista} etiqueta="Qué solicitudes ver" />
        <CampoBusqueda value={buscar} onChange={setBuscar} placeholder="Buscar por trabajador, DNI, establecimiento o detalle…" />
      </Toolbar>
      <FiltroDeChips opciones={chips} valor={tipo} onChange={setTipo} etiqueta="Tipo de solicitud" />

      <Alert>{consulta.error || acciones.error}</Alert>
      <AvisoExito onCerrar={() => setAviso('')}>{aviso}</AvisoExito>

      <EntityList
        items={visibles}
        total={visibles.length}
        loading={consulta.cargando && !consulta.datos}
        loadingMessage="Reuniendo las solicitudes…"
        emptyIcon={Inbox}
        emptyMessage={vista === 'PENDIENTE' ? 'No hay solicitudes por resolver. ¡Todo al día!' : 'No hay solicitudes registradas.'}
        columns={columnas}
        card={tarjeta}
        getKey={(s) => s.clave}
        acciones={[
          { icon: Check, label: 'Aprobar', visible: (s) => s.puede_aprobar, onClick: (s) => setResolviendo({ item: s, accion: 'aprobar' }) },
          { icon: X, label: 'Rechazar', visible: (s) => s.puede_rechazar, onClick: (s) => setResolviendo({ item: s, accion: 'rechazar' }) },
          { icon: ExternalLink, label: 'Abrir en su pantalla', visible: () => !propias, onClick: (s) => navigate(s.pantalla) },
        ]}
      />

      <ResolucionModal
        item={resolviendo?.item ?? null}
        accion={resolviendo?.accion ?? null}
        titulo={resolviendo ? `${resolviendo.accion === 'aprobar' ? 'Aprobar' : 'Rechazar'} ${resolviendo.item.tipo_nombre.toLowerCase()} de ${resolviendo.item.trabajador}` : ''}
        ayuda={resolviendo ? `${periodo(resolviendo.item)} · ${resolviendo.item.detalle}` : null}
        resolver={resolver}
        onClose={() => setResolviendo(null)}
      />
    </PageContainer>
  );
}
