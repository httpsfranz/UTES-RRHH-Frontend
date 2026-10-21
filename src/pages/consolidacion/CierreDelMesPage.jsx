import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarCheck, CheckCheck, FileSpreadsheet, Inbox, Lock, RefreshCw, Search, Wallet } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useAuth } from '../../auth/useAuth';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useConsulta } from '../../hooks/useConsulta';
import { useOpciones } from '../../hooks/useOpciones';
import { puedeAccion, puedeEscribir } from '../../nav/permisosDeApi';
import { formatoFechaHora } from '../../utils/formato';
import { MESES } from '../../utils/opciones';
import { hoyLocal } from '../../utils/marcacion';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import Alert from '../../components/ui/Alert';
import AvisoExito from '../../components/ui/AvisoExito';
import LoadingState from '../../components/ui/LoadingState';
import ZonaDesplazable from '../../components/ui/ZonaDesplazable';
import PasoDeCierre from '../../components/ui/PasoDeCierre';

const ESTADOS_PERIODO = { ABIERTO: 'abierto', EN_PROCESO: 'en proceso', CERRADO: 'cerrado' };
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

// El periodo que toca cerrar: el ultimo ya terminado que sigue abierto (o, si no hay, el ultimo abierto).
function periodoPorDefecto(periodos) {
  const hoy = hoyLocal();
  const abiertos = periodos.filter((p) => p.estado !== 'CERRADO').sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio));
  return (abiertos.find((p) => p.fecha_fin < hoy) ?? abiertos[abiertos.length - 1] ?? periodos[0])?.id ?? '';
}

/**
 * Cierre del mes, paso a paso y en orden: resolver las solicitudes del mes, generar el consolidado, dar conformidad
 * (en lote lo que no tiene faltas ni tardanzas), generar las liquidaciones de descuento y cerrar el periodo. Cada paso
 * dice si esta listo y que falta; las acciones en lote evitan revisar cientos de filas una por una.
 */
export default function CierreDelMesPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { puedeElegir, eessFijo, eessPermitidos } = useAlcanceDeEess();
  const periodos = useConsulta('/periodos-asistencia', { por_pagina: 100 });
  const filasPeriodo = periodos.datos?.data ?? [];
  const [elegido, setElegido] = useState({ PeriodoAsistenciaId: '', EessId: eessFijo ?? '' });
  const periodoId = elegido.PeriodoAsistenciaId || String(periodoPorDefecto(filasPeriodo));
  const { opciones: todos } = useOpciones('/establecimientos', { sinOpcion: eessPermitidos ? 'Todos mis establecimientos' : 'Toda la Red' });
  const establecimientos = eessPermitidos ? todos.filter((o) => o.value === '' || eessPermitidos.includes(Number(o.value))) : todos;
  const params = { periodo_asistencia_id: periodoId, ...(elegido.EessId ? { eess_id: elegido.EessId } : {}) };
  const cierre = useConsulta('/cierre-mes', params, { activo: Boolean(periodoId) });
  const [trabajando, setTrabajando] = useState('');
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');
  const r = cierre.datos;

  async function ejecutar(clave, llamada, mensaje) {
    setTrabajando(clave);
    setError('');
    setAviso('');
    try {
      const { data } = await llamada();
      setAviso(mensaje(data));
      await cierre.recargar();
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo completar la acción.');
    } finally {
      setTrabajando('');
    }
  }
  const cuerpo = { PeriodoAsistenciaId: Number(periodoId), ...(elegido.EessId ? { EessId: Number(elegido.EessId) } : {}) };

  const opcionesPeriodo = filasPeriodo
    .slice()
    .sort((a, b) => b.fecha_inicio.localeCompare(a.fecha_inicio))
    .map((p) => ({ value: String(p.id), label: `${MESES[p.mes - 1].label} ${p.anio} · ${ESTADOS_PERIODO[p.estado] ?? p.estado}` }));

  let pasos = [];
  if (r) {
    const c = r.consolidados;
    const porRevisar = c.generado + c.observado;
    const cerrado = r.cierre.cerrado;
    const consolidadoListo = c.total > 0 && c.total >= r.trabajadores_con_asistencia;
    pasos = [
      {
        titulo: 'Resolver las solicitudes del mes',
        estado: r.solicitudes_pendientes === 0 ? 'hecho' : 'pendiente',
        resumen:
          r.solicitudes_pendientes === 0
            ? 'No quedan justificaciones, papeletas ni licencias del mes por resolver.'
            : `${plural(r.solicitudes_pendientes, 'solicitud del mes espera', 'solicitudes del mes esperan')} aprobación. Cambian la asistencia: resuélvelas antes de consolidar.`,
        acciones: r.solicitudes_pendientes > 0 && (
          <Button variant="secondary" icon={Inbox} onClick={() => navigate('/solicitudes/bandeja')}>
            Ir a la bandeja
          </Button>
        ),
      },
      {
        titulo: 'Generar el consolidado',
        estado: cerrado || consolidadoListo ? 'hecho' : 'pendiente',
        resumen: `${plural(c.total, 'trabajador consolidado', 'trabajadores consolidados')} de ${r.trabajadores_con_asistencia} con asistencia en el mes. Puedes volver a generarlo: lo ya conforme no cambia.`,
        acciones: !cerrado && puedeAccion(auth, '/consolidados-asistencia', 'generar') && (
          <Button
            variant={consolidadoListo ? 'secondary' : 'primary'}
            icon={RefreshCw}
            disabled={Boolean(trabajando)}
            onClick={() => ejecutar('generar', () => api.post('/consolidados-asistencia/generar', cuerpo), () => 'Consolidado actualizado con la asistencia del mes.')}
          >
            {trabajando === 'generar' ? 'Generando…' : c.total ? 'Actualizar consolidado' : 'Generar consolidado'}
          </Button>
        ),
      },
      {
        titulo: 'Revisar y dar conformidad',
        estado: c.total === 0 ? 'bloqueado' : porRevisar === 0 ? 'hecho' : 'pendiente',
        resumen:
          c.total === 0
            ? 'Primero genera el consolidado.'
            : porRevisar === 0
              ? `Los ${c.conforme + c.cerrado} consolidados tienen conformidad.`
              : `${plural(porRevisar, 'consolidado espera', 'consolidados esperan')} conformidad${c.observado ? ` (${c.observado} observados)` : ''}. ${
                  c.sin_incidencias
                    ? `${plural(c.sin_incidencias, 'no tiene', 'no tienen')} faltas ni tardanzas: se aprueban juntos.`
                    : 'Todos tienen faltas, tardanzas u observaciones: revísalos en el consolidado.'
                }`,
        acciones: porRevisar > 0 && !cerrado && (
          <>
            {c.sin_incidencias > 0 && puedeAccion(auth, '/cierre-mes', 'conformidad') && (
              <Button
                icon={CheckCheck}
                disabled={Boolean(trabajando)}
                onClick={() => ejecutar('conformidad', () => api.post('/cierre-mes/conformidad', cuerpo), (d) => `${plural(d.aprobados, 'consolidado aprobado', 'consolidados aprobados')} (sin incidencias).`)}
              >
                {trabajando === 'conformidad' ? 'Aprobando…' : `Aprobar ${c.sin_incidencias} sin incidencias`}
              </Button>
            )}
            <Button variant="secondary" icon={Search} onClick={() => navigate('/consolidacion/gestion?pestana=consolidado')}>
              Revisar el resto
            </Button>
          </>
        ),
      },
      {
        titulo: 'Liquidar los descuentos',
        estado: c.total === 0 ? 'bloqueado' : r.liquidaciones.por_generar === 0 ? 'hecho' : 'pendiente',
        resumen:
          r.liquidaciones.por_generar > 0
            ? `${plural(r.liquidaciones.por_generar, 'trabajador con faltas o tardanzas aún no tiene', 'trabajadores con faltas o tardanzas aún no tienen')} su liquidación (solo de los consolidados conformes).`
            : `Liquidaciones: ${r.liquidaciones.generado} generadas, ${r.liquidaciones.aprobado} aprobadas y ${r.liquidaciones.remitido} remitidas.`,
        acciones: (
          <>
            {r.liquidaciones.por_generar > 0 && !cerrado && puedeAccion(auth, '/cierre-mes', 'liquidaciones') && (
              <Button
                icon={Wallet}
                disabled={Boolean(trabajando)}
                onClick={() => ejecutar('liquidar', () => api.post('/cierre-mes/liquidaciones', cuerpo), (d) => `${plural(d.generadas, 'liquidación generada', 'liquidaciones generadas')}.`)}
              >
                {trabajando === 'liquidar' ? 'Generando…' : `Generar ${r.liquidaciones.por_generar} liquidaciones`}
              </Button>
            )}
            <Button variant="secondary" icon={FileSpreadsheet} onClick={() => navigate('/consolidacion/gestion?pestana=liquidaciones')}>
              Ver liquidaciones
            </Button>
          </>
        ),
      },
      {
        titulo: 'Cerrar el período',
        estado: cerrado ? 'hecho' : r.cierre.puede_cerrar ? 'pendiente' : 'bloqueado',
        resumen: cerrado
          ? `Cerrado el ${formatoFechaHora(r.periodo.fecha_cierre)}: su asistencia ya no se modifica.`
          : r.cierre.puede_cerrar
            ? 'Todo listo. Al cerrarlo, la asistencia del mes ya no se modifica (RIT, Art. 16).'
            : `Se cierra para toda la Red: faltan ${plural(r.cierre.sin_conformidad_en_la_red, 'consolidado', 'consolidados')} con conformidad${elegido.EessId || eessPermitidos ? ' (contando otros establecimientos)' : ''}.`,
        acciones: !cerrado && r.cierre.puede_cerrar && puedeEscribir(auth, '/periodos-asistencia') && (
          <Button
            icon={Lock}
            disabled={Boolean(trabajando)}
            onClick={() => {
              if (!window.confirm(`¿Cerrar ${r.periodo.etiqueta}? Ya no se podrá reabrir ni modificar su asistencia.`)) return;
              ejecutar('cerrar', () => api.patch(`/periodos-asistencia/${r.periodo.id}`, { PeriodoAsistenciaEstado: 'CERRADO' }), () => `${r.periodo.etiqueta} cerrado.`);
            }}
          >
            Cerrar el período
          </Button>
        ),
      },
    ];
  }

  return (
    <PageContainer>
      <PageHeader title="Cierre del mes" subtitle="Lo que falta para cerrar la asistencia del mes, en orden. Cada paso se marca solo cuando está listo." />

      <Toolbar>
        <ToolbarItem ancho="lg">
          <Select
            form={{ PeriodoAsistenciaId: periodoId }}
            setForm={(f) => setElegido((e) => ({ ...e, PeriodoAsistenciaId: (typeof f === 'function' ? f({ PeriodoAsistenciaId: periodoId }) : f).PeriodoAsistenciaId }))}
            name="PeriodoAsistenciaId"
            label="Mes"
            icon={CalendarCheck}
            options={opcionesPeriodo}
          />
        </ToolbarItem>
        {puedeElegir && (
          <ToolbarItem ancho="lg">
            <Select form={elegido} setForm={setElegido} name="EessId" label="Establecimiento" icon={Building2} options={establecimientos} />
          </ToolbarItem>
        )}
      </Toolbar>

      <Alert>{error || cierre.error || periodos.error}</Alert>
      <AvisoExito onCerrar={() => setAviso('')}>{aviso}</AvisoExito>

      {!r ? (
        <LoadingState message="Revisando el mes…" />
      ) : (
        <ZonaDesplazable>
          <ol className="space-y-3">
            {pasos.map((paso, i) => (
              <PasoDeCierre key={paso.titulo} numero={i + 1} titulo={paso.titulo} estado={paso.estado} resumen={paso.resumen}>
                {paso.acciones || null}
              </PasoDeCierre>
            ))}
          </ol>
        </ZonaDesplazable>
      )}
    </PageContainer>
  );
}
