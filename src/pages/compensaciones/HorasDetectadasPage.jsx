import { useState } from 'react';
import { Building2, CalendarDays, FilePlus2, Hourglass } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useConsulta } from '../../hooks/useConsulta';
import { useOpciones } from '../../hooks/useOpciones';
import { fechaIso, formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Alert from '../../components/ui/Alert';
import AvisoExito from '../../components/ui/AvisoExito';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import EntityList from '../../components/ui/EntityList';

const primeroDelMes = () => {
  const hoy = new Date();
  return fechaIso(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
};

const situacion = (f) => (f.procede ? `Autorizada (${f.estado === 'PENDIENTE' ? 'por validar' : f.estado.toLowerCase()})` : 'Sin autorización previa');

const columns = [
  { key: 'fecha', header: 'Día', render: (f) => formatoFecha(f.fecha) },
  { key: 'trabajador', header: 'Trabajador' },
  { key: 'eess', header: 'Establecimiento' },
  { key: 'horas', header: 'Horas', render: (f) => String(f.horas) },
  { key: 'motivo', header: 'Cómo se calculó' },
  { key: 'situacion', header: 'Situación', render: situacion },
];

const card = (f) => ({
  icon: Hourglass,
  title: f.trabajador,
  meta: [`${formatoFecha(f.fecha)} · ${f.horas} h`, f.motivo],
  footer: situacion(f),
});

/**
 * Horas potencialmente compensables, detectadas solas en las marcaciones: dias con una hora o mas despues del fin del
 * turno, o trabajados sin turno. Sin autorizacion previa del jefe no proceden (RIT, Art. 17); si se autorizo antes por
 * correo o documento, aqui se registra esa autorizacion.
 */
export default function HorasDetectadasPage() {
  const { puedeElegir, eessFijo, eessPermitidos } = useAlcanceDeEess();
  const [filtros, setFiltros] = useState({ EessId: eessFijo ?? '', Desde: primeroDelMes(), Hasta: fechaIso(new Date()) });
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');
  const { opciones: todos } = useOpciones('/establecimientos', { sinOpcion: 'Selecciona un establecimiento' });
  const establecimientos = eessPermitidos ? todos.filter((o) => o.value === '' || eessPermitidos.includes(Number(o.value))) : todos;
  // Se revisa un establecimiento a la vez (recorre las marcas de cada trabajador dia por dia).
  const consulta = useConsulta('/compensaciones-horarias/candidatas', { eess_id: filtros.EessId, desde: filtros.Desde, hasta: filtros.Hasta }, { activo: Boolean(filtros.EessId) });
  const filas = consulta.datos?.data ?? [];

  async function registrar(f) {
    if (!window.confirm(`¿Registrar que el trabajo de ${f.trabajador} el ${formatoFecha(f.fecha)} fue autorizado antes por el jefe inmediato (correo o documento)?`)) return;
    setError('');
    try {
      await api.post('/compensaciones-horarias', { VinculoLaboralId: f.vinculo_id, CompensacionHorariaFechaTrabajo: f.fecha, CompensacionHorariaAutorizadoPreviamente: true, CompensacionHorariaObservacion: f.motivo });
      setAviso(`Autorización registrada: ${f.horas} h de ${f.trabajador}. Valídalas en la pestaña Autorizaciones.`);
      consulta.recargar();
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo registrar la autorización.');
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Horas detectadas" subtitle="Compensaciones · Horas detectadas" />

      <Toolbar>
        {puedeElegir && (
          <ToolbarItem ancho="lg">
            <Select form={filtros} setForm={setFiltros} name="EessId" label="Establecimiento" icon={Building2} options={establecimientos} />
          </ToolbarItem>
        )}
        <ToolbarItem ancho="md">
          <Field form={filtros} setForm={setFiltros} name="Desde" label="Desde" icon={CalendarDays} type="date" />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Field form={filtros} setForm={setFiltros} name="Hasta" label="Hasta" icon={CalendarDays} type="date" />
        </ToolbarItem>
      </Toolbar>

      <AvisoExito onCerrar={() => setAviso('')}>{aviso}</AvisoExito>
      <Alert>{consulta.error || error}</Alert>

      <EntityList
        items={filas}
        total={filas.length}
        loading={consulta.cargando}
        loadingMessage="Buscando horas fuera de jornada…"
        emptyIcon={Hourglass}
        emptyMessage={filtros.EessId ? 'No se detectó trabajo fuera de jornada de una hora o más en esas fechas.' : 'Selecciona un establecimiento para buscar las horas fuera de jornada.'}
        columns={columns}
        card={card}
        getKey={(f) => `${f.vinculo_id}-${f.fecha}`}
        isActive={() => undefined}
        acciones={[{ icon: FilePlus2, label: 'Registrar autorización previa', visible: (f) => !f.procede, onClick: registrar }]}
      />
    </PageContainer>
  );
}
