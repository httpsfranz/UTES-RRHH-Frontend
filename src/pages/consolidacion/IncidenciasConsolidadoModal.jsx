import { useConsulta } from '../../hooks/useConsulta';
import { formatoFecha } from '../../utils/formato';
import Modal from '../../components/Modal';
import Alert from '../../components/ui/Alert';
import HelpText from '../../components/ui/HelpText';
import TablaEnModal from '../../components/ui/TablaEnModal';

const ORIGEN = { CALCULADO: 'Calculada', MANUAL: 'Corregida a mano' };

const columns = [
  { key: 'fecha', header: 'Día', render: (f) => formatoFecha(f.fecha) },
  { key: 'estado', header: 'Incidencia' },
  { key: 'tardanza', header: 'Tardanza', render: (f) => (f.minutos_tardanza ? `${f.minutos_tardanza} min` : '—') },
  { key: 'origen', header: 'Origen', render: (f) => ORIGEN[f.origen] ?? f.origen },
  { key: 'observacion', header: 'Detalle', render: (f) => f.observacion ?? '—' },
];

// Lo que el revisor debe mirar antes de aprobar: los dias del mes con falta, tardanza, omision o salida anticipada.
export default function IncidenciasConsolidadoModal({ consolidado, onClose }) {
  const consulta = useConsulta(`/consolidados-asistencia/${consolidado?.id}/incidencias`, {}, { activo: Boolean(consolidado) });

  return (
    <Modal open={Boolean(consolidado)} onClose={onClose} title={`Incidencias · ${consolidado?.trabajador?.nombre_completo ?? ''}`} size="lg">
      <Alert>{consulta.error}</Alert>
      <TablaEnModal columns={columns} rows={consulta.datos?.data} cargando={consulta.cargando} vacio="Sin incidencias en el período: asistió todos los días programados." getRowKey={(f) => f.fecha} />
      <HelpText>Si una incidencia es un error de la asistencia de origen, pide la corrección: el responsable la corrige y el consolidado se vuelve a generar.</HelpText>
    </Modal>
  );
}
