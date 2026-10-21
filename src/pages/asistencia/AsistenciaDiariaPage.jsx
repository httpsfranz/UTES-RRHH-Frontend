import { lazy, useEffect, useState } from 'react';
import { Building2, CalendarDays, CalendarRange, FileSpreadsheet, History, Sun } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useAuth } from '../../auth/useAuth';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useCalendarioAsistencia } from '../../hooks/useCalendarioAsistencia';
import { useCrudResource } from '../../hooks/useCrudResource';
import { useOpciones } from '../../hooks/useOpciones';
import { hoyLocal, moverFecha } from '../../utils/marcacion';
import { MESES } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import AvisoExito from '../../components/ui/AvisoExito';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import FormModal from '../../components/ui/FormModal';
import ModalDePagina from '../../components/ui/ModalDePagina';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import Segmentado from '../../components/ui/Segmentado';
import NavegadorDeFecha from '../../components/ui/NavegadorDeFecha';
import BarraDeCalendario from '../../components/ui/BarraDeCalendario';
import CampoBusqueda from '../../components/ui/CampoBusqueda';
import ExportarCalendarioPdf from '../../components/ui/ExportarCalendarioPdf';
import CalendarioAsistencia from '../../components/ui/CalendarioAsistencia';
import LeyendaAsistencia from '../../components/ui/LeyendaAsistencia';
import TableroDeMarcacion from '../../components/ui/TableroDeMarcacion';
import AjusteMarcacionForm from './AjusteMarcacionForm';
import CargarHojaAsistenciaModal from './CargarHojaAsistenciaModal';
import CeldaAsistenciaModal from './CeldaAsistenciaModal';
import JustificacionFaltaForm from './JustificacionFaltaForm';
import * as ajuste from './ajusteMarcacionModelo';
import * as justificacion from './justificacionFaltaModelo';

const MarcacionPage = lazy(() => import('./MarcacionPage'));

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

const VISTAS = [
  { value: 'dia', label: 'Día', icon: Sun },
  { value: 'semana', label: 'Semana', icon: CalendarRange },
  { value: 'mes', label: 'Mes', icon: CalendarDays },
];

/** En la vista del dia de hoy el tablero se refresca solo (otras marcas, cambios de estado) cada minuto. */
const REFRESCO_MS = 60_000;

/**
 * Control de asistencia de un establecimiento, en formato calendario y con tres vistas:
 *   - Dia: una tarjeta por trabajador con su estado de hoy (por marcar, en turno, salio...) y el boton para marcar su
 *     entrada o su salida. La hora NO se escribe: la registra el servidor al pulsar (RIT, Art. 21: control manual).
 *   - Semana y Mes: el calendario trabajadores x dias. Pulsar la celda personal-dia abre su detalle; si es hoy, desde
 *     ahi tambien se marca.
 * El calendario se recalcula solo al abrirse y despues de cada marca: no hay boton "Calcular". Un dia pasado no se edita:
 * desde su celda se justifica la falta o se solicita el ajuste de una marca (quedan pendientes de aprobacion).
 */
export default function AsistenciaDiariaPage() {
  const auth = useAuth();
  const puedeMarcar = auth.tiene('ASISTENCIA_MARCAR');
  // El trabajador solo consulta lo suyo: la misma pantalla, como "Mi asistencia".
  const propio = Boolean(auth.alcance?.propio);
  const { puedeElegir, eessFijo, eessPermitidos } = useAlcanceDeEess();
  const [filtros, setFiltros] = useState({ EessId: eessFijo ?? eessRecordado() });
  const [vista, setVista] = useState(puedeMarcar ? 'dia' : 'mes');
  const [fecha, setFecha] = useState(hoyLocal);
  const [buscar, setBuscar] = useState('');
  const [buscarAplicado, setBuscarAplicado] = useState('');
  const [seleccion, setSeleccion] = useState(null);
  const [marcando, setMarcando] = useState(null);
  const [aviso, setAviso] = useState('');
  const [errorAccion, setErrorAccion] = useState('');
  const [historial, setHistorial] = useState(false);
  const [cargandoHoja, setCargandoHoja] = useState(false);
  // Hojas de asistencia en papel (establecimientos sin reloj facial): las carga quien edita la asistencia.
  const puedeCargarHoja = !propio && auth.tiene('ASISTENCIA_EDITAR');

  const { opciones: todos } = useOpciones('/establecimientos', { sinOpcion: 'Selecciona un establecimiento' });
  const establecimientos = eessPermitidos ? todos.filter((o) => o.value === '' || eessPermitidos.includes(Number(o.value))) : todos;
  const cal = useCalendarioAsistencia({ eessId: filtros.EessId, vista, fecha, buscar: buscarAplicado });
  const { calendario, recargar } = cal;

  // Solo los formularios que se abren desde la celda (el calendario ya trae los datos; sus listas no hacen falta).
  const conceptos = useOpciones('/conceptos-justificacion');
  const justificar = useCrudResource({ endpoint: '/justificaciones-falta', emptyForm: justificacion.emptyForm, validate: justificacion.validarJustificacion(conceptos.filas), limite: 1, onCambio: avisar('Justificación registrada: queda pendiente de aprobación.') });
  const ajustar = useCrudResource({ endpoint: '/ajustes-marcacion', emptyForm: ajuste.emptyForm, validate: ajuste.validarAjuste, limite: 1, onCambio: avisar('Solicitud de ajuste registrada: queda pendiente de aprobación.') });
  const [filtroAjuste, setFiltroAjuste] = useState(null);

  const esHoy = fecha === hoyLocal();
  useEffect(() => {
    if (vista !== 'dia' || !esHoy || !filtros.EessId) return undefined;
    const id = setInterval(() => recargar(), REFRESCO_MS);
    return () => clearInterval(id);
  }, [vista, esHoy, filtros.EessId, recargar]);

  function cambiarFiltros(actualizar) {
    setFiltros((previos) => {
      const siguientes = typeof actualizar === 'function' ? actualizar(previos) : actualizar;
      if (siguientes.EessId && siguientes.EessId !== previos.EessId) recordarEess(siguientes.EessId);
      return siguientes;
    });
  }

  async function marcar(trabajador, tipo) {
    setMarcando(trabajador.vinculo_id);
    setErrorAccion('');
    setAviso('');
    try {
      const { data } = await api.post('/asistencia-diaria/marcar', { VinculoLaboralId: trabajador.vinculo_id, MarcacionTipo: tipo });
      setAviso(data.mensaje);
      setSeleccion(null);
      await recargar();
    } catch (err) {
      setErrorAccion(mensajeDeError(err) ?? 'No se pudo registrar la marca.');
    } finally {
      setMarcando(null);
    }
  }

  function abrirCelda(trabajador, dia, celda) {
    setSeleccion({ trabajador, dia, celda, puedeMarcar: Boolean(calendario?.puede_marcar) && dia.fecha === calendario?.fecha_marcas });
  }

  function avisar(mensaje) {
    return () => {
      setAviso(mensaje);
      recargar();
    };
  }

  function abrirJustificacion({ trabajador, dia }) {
    setSeleccion(null);
    justificar.abrirCrear();
    justificar.setForm((form) => ({ ...form, VinculoLaboralId: trabajador.vinculo_id, JustificacionFaltaFechaInicio: dia.fecha, JustificacionFaltaFechaFin: dia.fecha }));
  }

  function abrirAjuste({ trabajador, dia }) {
    setSeleccion(null);
    setFiltroAjuste({ vinculo_laboral_id: trabajador.vinculo_id, desde: dia.fecha, hasta: dia.fecha });
    ajustar.abrirCrear();
  }

  const sinEess = !filtros.EessId;
  const total = calendario?.trabajadores.length ?? 0;

  return (
    <PageContainer>
      <PageHeader
        title={propio ? 'Mi asistencia' : 'Control de asistencia'}
        subtitle={propio ? 'Tu asistencia por semana o mes: pulsa un día para ver su detalle.' : 'Marca la entrada y salida del personal (hora del sistema) y revisa su asistencia por día, semana o mes.'}
      >
        <Button variant="secondary" icon={History} onClick={() => setHistorial(true)}>
          Historial de marcaciones
        </Button>
        {puedeCargarHoja && calendario && (
          <Button variant="secondary" icon={FileSpreadsheet} onClick={() => setCargandoHoja(true)}>
            Cargar hoja de asistencia
          </Button>
        )}
      </PageHeader>

      <Toolbar>
        {puedeElegir && (
          <ToolbarItem ancho="lg">
            <Select form={filtros} setForm={cambiarFiltros} name="EessId" label="Establecimiento de salud (EESS)" icon={Building2} options={establecimientos} />
          </ToolbarItem>
        )}
        <Segmentado opciones={VISTAS} value={vista} onChange={setVista} etiqueta="Vista del calendario" />
        <NavegadorDeFecha
          etiqueta={calendario?.periodo.etiqueta ?? fecha}
          esHoy={esHoy}
          onAnterior={() => setFecha((f) => moverFecha(f, vista, -1))}
          onSiguiente={() => setFecha((f) => moverFecha(f, vista, 1))}
          onHoy={() => setFecha(hoyLocal())}
        />
        {!propio && <CampoBusqueda value={buscar} onChange={setBuscar} onBuscar={() => setBuscarAplicado(buscar)} placeholder="Buscar trabajador por nombre o DNI…" />}
        {vista !== 'dia' && <ExportarCalendarioPdf cal={cal} />}
      </Toolbar>

      <AvisoExito onCerrar={() => setAviso('')}>{aviso}</AvisoExito>
      <Alert>{cal.error || errorAccion}</Alert>

      {sinEess && <EmptyState icon={Building2} message="Selecciona un establecimiento de salud para ver y marcar su asistencia." />}
      {!sinEess && cal.cargando && !calendario && <LoadingState message="Cargando asistencia…" />}
      {calendario && (
        <>
          <BarraDeCalendario
            titulo={`ASISTENCIA - ${calendario.eess.nombre}`}
            subtitulo={`${calendario.periodo.etiqueta} · ${total} ${total === 1 ? 'trabajador' : 'trabajadores'}${calendario.puede_marcar ? ` · hora del sistema ${calendario.ahora}` : ''}`}
          >
            {vista !== 'dia' && <LeyendaAsistencia leyenda={calendario.leyenda} />}
          </BarraDeCalendario>
          {total === 0 ? (
            <EmptyState message="No hay trabajadores con vínculo en este establecimiento en el período." />
          ) : vista === 'dia' ? (
            <TableroDeMarcacion calendario={calendario} marcando={marcando} onMarcar={marcar} onAbrir={abrirCelda} />
          ) : (
            <CalendarioAsistencia calendario={calendario} onCelda={abrirCelda} />
          )}
        </>
      )}

      <CeldaAsistenciaModal
        seleccion={seleccion}
        marcando={marcando}
        onClose={() => setSeleccion(null)}
        onMarcar={marcar}
        onJustificar={justificar.abrirCrear && abrirJustificacion}
        onAjustar={ajustar.abrirCrear && abrirAjuste}
      />

      <FormModal
        open={justificar.modalOpen}
        onClose={justificar.cerrarModal}
        title="Justificar falta"
        onSubmit={justificar.guardar}
        error={justificar.erroresForm.general?.[0]}
        submitting={justificar.guardando}
      >
        <JustificacionFaltaForm form={justificar.form} setForm={justificar.setForm} errors={justificar.erroresForm} />
      </FormModal>

      <FormModal
        open={ajustar.modalOpen}
        onClose={ajustar.cerrarModal}
        title="Solicitar ajuste de marcación"
        onSubmit={ajustar.guardar}
        error={ajustar.erroresForm.general?.[0]}
        submitting={ajustar.guardando}
      >
        <AjusteMarcacionForm form={ajustar.form} setForm={ajustar.setForm} errors={ajustar.erroresForm} filtro={filtroAjuste} />
      </FormModal>

      <ModalDePagina abierto={historial} onClose={() => setHistorial(false)} titulo="Historial de marcaciones" pagina={MarcacionPage} />
      <CargarHojaAsistenciaModal
        open={cargandoHoja}
        onClose={() => setCargandoHoja(false)}
        eess={calendario?.eess}
        anio={Number(fecha.slice(0, 4))}
        mes={Number(fecha.slice(5, 7))}
        etiqueta={`${MESES[Number(fecha.slice(5, 7)) - 1].label} ${fecha.slice(0, 4)}`}
        onImportado={recargar}
      />
    </PageContainer>
  );
}
