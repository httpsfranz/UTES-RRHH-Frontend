import { useState } from 'react';
import { Building2, CopyPlus, FileSpreadsheet, Send } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useOpciones } from '../../hooks/useOpciones';
import { useProgramacionMensual } from '../../hooks/useProgramacionMensual';
import { puedeAccion, puedeEscribir } from '../../nav/permisosDeApi';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import NavegadorDeFecha from '../../components/ui/NavegadorDeFecha';
import StatusBadge from '../../components/ui/StatusBadge';
import Alert from '../../components/ui/Alert';
import AvisoExito from '../../components/ui/AvisoExito';
import HelpText from '../../components/ui/HelpText';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import PaletaDeTurnos from '../../components/ui/PaletaDeTurnos';
import GrillaDeProgramacion from '../../components/ui/GrillaDeProgramacion';
import ImportarProgramacionModal from './ImportarProgramacionModal';

// Misma clave que los calendarios: el establecimiento elegido en una pantalla se recuerda en las demas.
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

// La programacion se prepara antes de que empiece el mes: por defecto se abre el mes siguiente.
function mesSiguiente() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  return { anio: d.getFullYear(), mes: d.getMonth() + 1 };
}
const mover = ({ anio, mes }, sentido) => {
  const d = new Date(anio, mes - 1 + sentido, 1);
  return { anio: d.getFullYear(), mes: d.getMonth() + 1 };
};

const ESTADOS = {
  BORRADOR: { tono: 'warning', texto: 'Borrador' },
  PUBLICADA: { tono: 'success', texto: 'Publicada' },
  CERRADA: { tono: 'neutral', texto: 'Cerrada' },
};

/**
 * Programacion del mes en una grilla trabajador x dia, como la hoja que hoy usa la UTES: se elige un turno de la paleta y
 * se pulsan las celdas (pulsar de nuevo con el mismo turno lo quita; "Libre" vacia el dia). "Copiar mes anterior" llena
 * las celdas vacias y "Publicar" la deja vigente para la asistencia. La programacion del periodo y la de cada trabajador
 * se crean solas con el primer turno: no hace falta registrarlas antes.
 */
export default function ProgramacionMensualPage() {
  const auth = useAuth();
  const { puedeElegir, eessFijo, eessPermitidos } = useAlcanceDeEess();
  const [filtros, setFiltros] = useState({ EessId: eessFijo ?? eessRecordado() });
  const [mes, setMes] = useState(mesSiguiente);
  const [pincel, setPincel] = useState(null);
  const [aviso, setAviso] = useState('');
  const [importando, setImportando] = useState(false);
  const { opciones: todos } = useOpciones('/establecimientos', { sinOpcion: 'Selecciona un establecimiento' });
  const establecimientos = eessPermitidos ? todos.filter((o) => o.value === '' || eessPermitidos.includes(Number(o.value))) : todos;
  const prog = useProgramacionMensual({ eessId: filtros.EessId, anio: mes.anio, mes: mes.mes });
  const { grilla } = prog;

  const puedePintar = puedeEscribir(auth, '/programacion-mensual');
  const editable = Boolean(grilla) && puedePintar && !grilla.bloqueo;
  const estado = grilla?.programacion ? ESTADOS[grilla.programacion.estado] : null;
  const puedePublicar = grilla?.programacion?.estado === 'BORRADOR' && puedeAccion(auth, '/programaciones-periodo', 'publicar');
  const hoy = mesSiguiente();

  function cambiarFiltros(actualizar) {
    setFiltros((previos) => {
      const siguientes = typeof actualizar === 'function' ? actualizar(previos) : actualizar;
      if (siguientes.EessId && siguientes.EessId !== previos.EessId) recordarEess(siguientes.EessId);
      return siguientes;
    });
  }

  function alPulsarCelda(fila, dia) {
    if (pincel === null) {
      prog.setError('Elige primero un turno de la paleta (o "Libre" para vaciar el día).');
      return;
    }
    const actuales = fila.celdas[dia.fecha].turnos.map((t) => t.turno_id);
    let nuevos;
    if (pincel === 'libre') nuevos = [];
    else if (actuales.includes(pincel)) nuevos = actuales.filter((id) => id !== pincel);
    else nuevos = [...actuales, pincel];
    setAviso('');
    prog.pintar(fila.vinculo_id, dia.fecha, nuevos);
  }

  async function copiar() {
    setAviso('');
    const resultado = await prog.copiar();
    if (!resultado) return;
    const omitidos = resultado.omitidos.length;
    setAviso(
      `Se copiaron ${resultado.creados} turnos del mes anterior.` +
        (omitidos ? ` ${omitidos} no se copiaron: ${resultado.omitidos.slice(0, 3).join(' · ')}${omitidos > 3 ? '…' : ''}` : '')
    );
  }

  async function publicar() {
    if (!window.confirm(`¿Publicar la programación de ${grilla.periodo.etiqueta}? Después solo se modifica con cambios de turno (RIT, Art. 16).`)) return;
    if (await prog.publicar()) setAviso(`Programación de ${grilla.periodo.etiqueta} publicada: ya rige para el control de asistencia.`);
  }

  return (
    <PageContainer>
      <PageHeader title="Programación del mes" subtitle="Elige un turno y pulsa los días de cada trabajador. Al terminar, publícala.">
        {editable && (
          <Button variant="secondary" icon={CopyPlus} onClick={copiar} disabled={prog.trabajando}>
            Copiar mes anterior
          </Button>
        )}
        {editable && (
          <Button variant="secondary" icon={FileSpreadsheet} onClick={() => setImportando(true)} disabled={prog.trabajando}>
            Importar desde Excel
          </Button>
        )}
        {puedePublicar && (
          <Button icon={Send} onClick={publicar} disabled={prog.trabajando}>
            Publicar
          </Button>
        )}
      </PageHeader>

      <Toolbar>
        {puedeElegir && (
          <ToolbarItem ancho="lg">
            <Select form={filtros} setForm={cambiarFiltros} name="EessId" label="Establecimiento de salud (EESS)" icon={Building2} options={establecimientos} />
          </ToolbarItem>
        )}
        <NavegadorDeFecha
          etiqueta={grilla?.periodo.etiqueta ?? `${mes.mes}/${mes.anio}`}
          onAnterior={() => setMes((m) => mover(m, -1))}
          onSiguiente={() => setMes((m) => mover(m, 1))}
          onHoy={() => setMes(mesSiguiente())}
          esHoy={mes.anio === hoy.anio && mes.mes === hoy.mes}
          textoHoy="Próximo mes"
        />
        {grilla && (
          <StatusBadge
            tone={estado?.tono ?? 'info'}
            label={
              estado
                ? `${estado.texto}${grilla.programacion.fecha_publicacion ? ` el ${formatoFechaHora(grilla.programacion.fecha_publicacion)}` : ''}`
                : 'Sin programar'
            }
          />
        )}
      </Toolbar>

      <Alert>{prog.error}</Alert>
      <AvisoExito onCerrar={() => setAviso('')}>{aviso}</AvisoExito>

      {!filtros.EessId && <EmptyState icon={Building2} message="Selecciona un establecimiento de salud para programar su mes." />}
      {filtros.EessId && prog.cargando && !grilla && <LoadingState message="Cargando la programación…" />}
      {grilla && (
        <>
          {editable ? (
            <PaletaDeTurnos turnos={grilla.turnos} pincel={pincel} onElegir={setPincel} deshabilitada={prog.trabajando} />
          ) : (
            <HelpText>{grilla.bloqueo ?? 'Solo consulta: tu rol no programa turnos.'}</HelpText>
          )}
          {grilla.trabajadores.length === 0 ? (
            <EmptyState message="No hay trabajadores con vínculo vigente en este establecimiento durante el mes." />
          ) : (
            <GrillaDeProgramacion grilla={grilla} editable={editable} ocupada={prog.ocupada} onCelda={alPulsarCelda} />
          )}
        </>
      )}
      <ImportarProgramacionModal
        open={importando}
        onClose={() => setImportando(false)}
        grilla={grilla}
        onImportado={(r) => {
          setAviso(`Programación importada: ${r.aplicados} ${r.aplicados === 1 ? 'día actualizado' : 'días actualizados'}.`);
          prog.recargar();
        }}
      />
    </PageContainer>
  );
}
