import { useState } from 'react';
import { Building2, CalendarDays } from 'lucide-react';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useCalendarioAsistencia } from '../../hooks/useCalendarioAsistencia';
import { useOpciones } from '../../hooks/useOpciones';
import { MESES } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import BarraDeCalendario from '../../components/ui/BarraDeCalendario';
import CampoBusqueda from '../../components/ui/CampoBusqueda';
import CalendarioAsistencia from '../../components/ui/CalendarioAsistencia';
import LeyendaAsistencia from '../../components/ui/LeyendaAsistencia';

// Misma clave que Asistencia diaria: el establecimiento elegido en una pantalla se recuerda en las demas.
const CLAVE_EESS = 'asistencia.calendario.eess';

const eessRecordado = () => {
  try {
    return localStorage.getItem(CLAVE_EESS) ?? '';
  } catch {
    return '';
  }
};
const recordarEess = (id) => {
  try {
    localStorage.setItem(CLAVE_EESS, String(id));
  } catch {
    // sin almacenamiento: se elige de nuevo la proxima vez
  }
};

const anios = () => {
  const actual = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => ({ value: String(actual - 2 + i), label: String(actual - 2 + i) }));
};

/**
 * Calendario mensual de planificacion de un establecimiento (trabajadores en filas, dias en columnas). Solo consulta: la
 * edicion sigue en las pantallas de lista de cada modulo. Lo usan "Calendario de programación" y "Calendario de ausencias".
 *
 *   titulo, subtitulo  encabezado de la pagina
 *   endpoint           GET que devuelve el calendario (programacion-calendario/turnos | /ausencias)
 *   etiqueta           nombre del reporte en la barra ("PROGRAMACIÓN - EESS")
 */
export default function CalendarioPlanificacionPage({ titulo, subtitulo, endpoint, etiqueta }) {
  const { puedeElegir, eessFijo, eessPermitidos } = useAlcanceDeEess();
  const hoy = new Date();
  const [filtros, setFiltros] = useState({ EessId: eessFijo ?? eessRecordado(), Mes: String(hoy.getMonth() + 1), Anio: String(hoy.getFullYear()) });
  const [buscar, setBuscar] = useState('');
  const [buscarAplicado, setBuscarAplicado] = useState('');

  const { opciones: todos } = useOpciones('/establecimientos', { sinOpcion: 'Selecciona un establecimiento' });
  const establecimientos = eessPermitidos ? todos.filter((o) => o.value === '' || eessPermitidos.includes(Number(o.value))) : todos;
  const cal = useCalendarioAsistencia({ eessId: filtros.EessId, anio: filtros.Anio, mes: filtros.Mes, buscar: buscarAplicado, endpoint });

  function cambiarFiltros(actualizar) {
    setFiltros((previos) => {
      const siguientes = typeof actualizar === 'function' ? actualizar(previos) : actualizar;
      if (siguientes.EessId && siguientes.EessId !== previos.EessId) recordarEess(siguientes.EessId);
      return siguientes;
    });
  }

  const { calendario } = cal;
  const sinEess = !filtros.EessId;

  return (
    <PageContainer>
      <PageHeader title={titulo} subtitle={subtitulo} />

      <Toolbar>
        {puedeElegir && (
          <ToolbarItem ancho="lg">
            <Select form={filtros} setForm={cambiarFiltros} name="EessId" label="Establecimiento de salud (EESS)" icon={Building2} options={establecimientos} />
          </ToolbarItem>
        )}
        <ToolbarItem ancho="md">
          <Select form={filtros} setForm={cambiarFiltros} name="Mes" label="Mes" icon={CalendarDays} options={MESES} />
        </ToolbarItem>
        <ToolbarItem ancho="sm">
          <Select form={filtros} setForm={cambiarFiltros} name="Anio" label="Año" options={anios()} />
        </ToolbarItem>
        <CampoBusqueda value={buscar} onChange={setBuscar} onBuscar={() => setBuscarAplicado(buscar)} placeholder="Buscar trabajador por nombre o DNI…" />
      </Toolbar>

      <Alert>{cal.error}</Alert>

      {sinEess && <EmptyState icon={Building2} message="Selecciona un establecimiento de salud para ver su calendario." />}
      {!sinEess && cal.cargando && !calendario && <LoadingState message="Cargando calendario…" />}
      {calendario && (
        <>
          <BarraDeCalendario
            titulo={`${etiqueta} - ${calendario.eess.nombre}`}
            subtitulo={`${calendario.periodo.etiqueta} · ${calendario.trabajadores.length} ${calendario.trabajadores.length === 1 ? 'trabajador' : 'trabajadores'}`}
          >
            <LeyendaAsistencia leyenda={calendario.leyenda} />
          </BarraDeCalendario>
          {calendario.trabajadores.length === 0 ? (
            <EmptyState message="No hay trabajadores con vínculo en este establecimiento durante el mes." />
          ) : (
            <CalendarioAsistencia calendario={calendario} />
          )}
        </>
      )}
    </PageContainer>
  );
}
