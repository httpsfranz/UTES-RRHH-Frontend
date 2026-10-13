import { useState } from 'react';
import { Building2, Calculator, CalendarDays, FileDown, Plus, ScrollText } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useCalendarioAsistencia } from '../../hooks/useCalendarioAsistencia';
import { useCrudResource } from '../../hooks/useCrudResource';
import { useOpciones } from '../../hooks/useOpciones';
import { MESES } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import FormModal from '../../components/ui/FormModal';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import BarraDeCalendario from '../../components/ui/BarraDeCalendario';
import CampoBusqueda from '../../components/ui/CampoBusqueda';
import CalendarioAsistencia from '../../components/ui/CalendarioAsistencia';
import LeyendaAsistencia from '../../components/ui/LeyendaAsistencia';
import AsistenciaDiariaForm from './AsistenciaDiariaForm';
import CalcularAsistenciaModal from './CalcularAsistenciaModal';
import CeldaAsistenciaModal from './CeldaAsistenciaModal';
import { buildConfirmMessage, deactivateErrorMessage, emptyForm, mapToForm, validate } from './asistenciaDiariaModelo';

// El PDF sale siempre en horizontal; aqui solo se elige el tamaño de hoja.
const PAPELES = [
  { value: 'a4', label: 'A4' },
  { value: 'a3', label: 'A3' },
];

const CLAVE_EESS = 'asistencia.calendario.eess';

// El ultimo establecimiento elegido se recuerda en este navegador (conveniencia; puede no estar disponible).
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
  return Array.from({ length: 5 }, (_, i) => ({ value: String(actual - 3 + i), label: String(actual - 3 + i) }));
};

/**
 * Asistencia diaria: calendario mensual de un establecimiento (trabajadores en filas, dias en columnas). El
 * administrador elige el EESS y el mes; "Exportar PDF" genera el mismo calendario como documento apaisado (ambos salen de
 * GET /asistencia-diaria/calendario). Pulsar una celda abre el detalle del dia para editarlo, eliminarlo o registrarlo.
 *
 * Distribucion: PageContainer ocupa exactamente el alto de la pantalla, asi que cada bloque sobre el calendario resta alto
 * a este. Por eso todo lo de arriba es una sola barra de controles y una sola franja con titulo y leyenda, y el calendario
 * recibe el resto (flex-1) y el ancho completo.
 */
export default function AsistenciaDiariaPage() {
  const { puedeElegir, eessFijo, eessPermitidos } = useAlcanceDeEess();
  const hoy = new Date();
  const [filtros, setFiltros] = useState({ EessId: eessFijo ?? eessRecordado(), Mes: String(hoy.getMonth() + 1), Anio: String(hoy.getFullYear()), Papel: 'a4' });
  const [buscar, setBuscar] = useState('');
  const [buscarAplicado, setBuscarAplicado] = useState('');
  const [seleccion, setSeleccion] = useState(null);
  const [calculando, setCalculando] = useState(false);
  const [errorCelda, setErrorCelda] = useState('');

  const { opciones: todos } = useOpciones('/establecimientos', { sinOpcion: 'Selecciona un establecimiento' });
  const establecimientos = eessPermitidos ? todos.filter((o) => o.value === '' || eessPermitidos.includes(Number(o.value))) : todos;
  const cal = useCalendarioAsistencia({ eessId: filtros.EessId, anio: filtros.Anio, mes: filtros.Mes, buscar: buscarAplicado });

  // Solo el formulario y las acciones de un registro: el calendario ya trae los datos, la lista completa no se carga.
  const crud = useCrudResource({ endpoint: '/asistencia-diaria', emptyForm, mapToForm, validate, buildConfirmMessage, deactivateErrorMessage, limite: 1, onCambio: cal.recargar });

  function cambiarFiltros(actualizar) {
    setFiltros((previos) => {
      const siguientes = typeof actualizar === 'function' ? actualizar(previos) : actualizar;
      if (siguientes.EessId && siguientes.EessId !== previos.EessId) recordarEess(siguientes.EessId);
      return siguientes;
    });
  }

  async function editar({ celda }) {
    setSeleccion(null);
    setErrorCelda('');
    try {
      const { data } = await api.get(`/asistencia-diaria/${celda.asistencia_id}`);
      crud.abrirEditar(data.data);
    } catch (err) {
      setErrorCelda(mensajeDeError(err) ?? 'No se pudo abrir la asistencia.');
    }
  }

  function eliminar({ trabajador, dia, celda }) {
    setSeleccion(null);
    crud.desactivar({ id: celda.asistencia_id, fecha: dia.fecha, trabajador: { nombre_completo: trabajador.nombre } });
  }

  function registrar({ trabajador, dia }) {
    setSeleccion(null);
    crud.abrirCrear();
    crud.setForm((form) => ({ ...form, VinculoLaboralId: trabajador.vinculo_id, AsistenciaDiariaFecha: dia.fecha }));
  }

  const { calendario } = cal;
  const sinEess = !filtros.EessId;

  return (
    <PageContainer>
      <PageHeader title="Asistencia diaria" subtitle="Asistencia · Asistencia diaria">
        <Button onClick={() => setCalculando(true)} icon={Calculator}>
          Calcular asistencia
        </Button>
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva asistencia
        </Button>
      </PageHeader>

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
        <ToolbarItem ancho="sm">
          <Select form={filtros} setForm={cambiarFiltros} name="Papel" label="Papel PDF" icon={ScrollText} options={PAPELES} />
        </ToolbarItem>
        <Button variant="secondary" icon={FileDown} disabled={sinEess || !calendario || cal.exportando} onClick={() => cal.exportarPdf(filtros.Papel)}>
          {cal.exportando ? 'Generando PDF…' : 'Exportar PDF'}
        </Button>
        <CampoBusqueda value={buscar} onChange={setBuscar} onBuscar={() => setBuscarAplicado(buscar)} placeholder="Buscar trabajador por nombre o DNI…" />
      </Toolbar>

      <Alert>{cal.error || errorCelda || crud.error}</Alert>

      {sinEess && <EmptyState icon={Building2} message="Selecciona un establecimiento de salud para ver su calendario de asistencia." />}
      {!sinEess && cal.cargando && !calendario && <LoadingState message="Cargando calendario…" />}
      {calendario && (
        <>
          <BarraDeCalendario
            titulo={`ASISTENCIA - ${calendario.eess.nombre}`}
            subtitulo={`${calendario.periodo.etiqueta} · ${calendario.trabajadores.length} ${calendario.trabajadores.length === 1 ? 'trabajador' : 'trabajadores'}`}
          >
            <LeyendaAsistencia leyenda={calendario.leyenda} />
          </BarraDeCalendario>
          {calendario.trabajadores.length === 0 ? (
            <EmptyState message="No hay trabajadores con vínculo en este establecimiento durante el mes." />
          ) : (
            <CalendarioAsistencia calendario={calendario} onCelda={(trabajador, dia, celda) => setSeleccion({ trabajador, dia, celda })} />
          )}
        </>
      )}

      <CeldaAsistenciaModal seleccion={seleccion} onClose={() => setSeleccion(null)} onEditar={editar} onEliminar={eliminar} onRegistrar={registrar} />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar asistencia diaria' : 'Nueva asistencia diaria'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <AsistenciaDiariaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <CalcularAsistenciaModal abierto={calculando} onClose={() => setCalculando(false)} onCalculado={cal.recargar} />
    </PageContainer>
  );
}
