import { useState } from 'react';
import { AlertTriangle, BarChart3, Calculator, CalendarCheck, CircleCheck, FileSpreadsheet, ListTree, MessageSquareWarning } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { descargarArchivo } from '../../api/descargas';
import { ESTADOS_CONSOLIDADO, MESES, etiquetaDe } from '../../utils/opciones';
import { formatoFecha, formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import AccionModal from '../../components/ui/AccionModal';
import Select from '../../components/ui/Select';
import GenerarConsolidadoModal from './GenerarConsolidadoModal';
import DetalleConsolidadoModal from './DetalleConsolidadoModal';
import { useAuth } from '../../auth/useAuth';
import IncidenciasConsolidadoModal from './IncidenciasConsolidadoModal';
import TextoEstandar from '../../components/ui/TextoEstandar';
import { TEXTOS } from '../../utils/textosEstandar';

const periodo = (item) => (item.periodo ? `${etiquetaDe(MESES, String(item.periodo.mes))} ${item.periodo.anio}` : '—');
const revisable = (item) => item.estado === 'GENERADO' || item.estado === 'OBSERVADO';

const columns = [
  { key: 'periodo', header: 'Período', render: periodo },
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.vinculo?.eess?.nombre ?? '—' },
  { key: 'dias_trabajados', header: 'Trabajados' },
  { key: 'dias_falta', header: 'Faltas' },
  { key: 'minutos_tardanza', header: 'Tardanza (min)' },
  { key: 'fecha_generacion', header: 'Consolidado el', render: (item) => formatoFechaHora(item.fecha_generacion) },
  { key: 'plazo', header: 'Plazo RIT', render: (item) => (item.fecha_limite_rit ? formatoFecha(item.fecha_limite_rit) : '—') },
  { key: 'estado', header: 'Estado', render: (item) => etiquetaDe(ESTADOS_CONSOLIDADO, item.estado) },
  { key: 'revisado', header: 'Revisado por', render: (item) => item.revisado_por ?? '—' },
];

const card = (item) => ({
  icon: BarChart3,
  title: item.trabajador?.nombre_completo ?? 'Consolidado',
  meta: [
    periodo(item),
    `${item.dias_trabajados} días trabajados, ${item.dias_falta} faltas, ${item.minutos_tardanza} min de tardanza`,
    `Consolidado el ${formatoFechaHora(item.fecha_generacion)}`,
    item.observacion,
  ],
  footer: etiquetaDe(ESTADOS_CONSOLIDADO, item.estado),
});

/**
 * Consolidado mensual de asistencia: se GENERA de la asistencia diaria (nadie lo digita) y se REVISA. El revisor mira
 * las incidencias de cada trabajador, pide corregir la asistencia de origen cuando corresponde (queda OBSERVADO) o
 * aprueba el resultado (CONFORME); el Excel por condicion laboral es el formato que se remite (RIT, Art. 16).
 */
export default function ConsolidadoAsistenciaPage() {
  const crud = useCrudResource({ endpoint: '/consolidados-asistencia', emptyForm: {} });
  const acciones = useAccionDeRegistro('/consolidados-asistencia', { alTerminar: () => crud.cargar() });
  const periodos = useOpciones('/periodos-asistencia', {
    params: {},
    etiqueta: (p) => `${etiquetaDe(MESES, String(p.mes))} ${p.anio} (${p.estado.toLowerCase()})`,
  });
  const { opciones: establecimientos } = useOpciones('/establecimientos', { sinOpcion: 'Todos los establecimientos' });
  const [generando, setGenerando] = useState(false);
  const [verDetalle, setVerDetalle] = useState(null);
  const [verIncidencias, setVerIncidencias] = useState(null);
  const [revision, setRevision] = useState(null); // { item, accion: 'observar' | 'aprobar' }
  const [exportando, setExportando] = useState(false);
  const auth = useAuth();

  return (
    <PageContainer>
      <PageHeader title="Consolidado de asistencia" subtitle="Revisa las incidencias, pide correcciones cuando corresponda y aprueba el resultado.">
        {auth.tiene('REPORTES_EXPORTAR') && (
          <Button variant="secondary" onClick={() => setExportando(true)} icon={FileSpreadsheet}>
            Exportar Excel
          </Button>
        )}
        {acciones.puede('generar') && (
          <Button onClick={() => setGenerando(true)} icon={Calculator}>
            Generar / actualizar
          </Button>
        )}
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} placeholder="Buscar por trabajador o documento…" />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando consolidados…"
        emptyIcon={BarChart3}
        emptyMessage="No hay consolidados de asistencia todavía: usa Generar / actualizar."
        columns={columns}
        card={card}
        acciones={[
          { icon: AlertTriangle, label: 'Incidencias', onClick: setVerIncidencias },
          { icon: ListTree, label: 'Detalle diario', onClick: setVerDetalle },
          {
            icon: MessageSquareWarning,
            label: 'Pedir corrección',
            visible: (item) => acciones.puede('observar') && revisable(item),
            onClick: (item) => setRevision({ item, accion: 'observar' }),
          },
          {
            icon: CircleCheck,
            label: 'Aprobar',
            visible: (item) => acciones.puede('aprobar') && revisable(item),
            onClick: (item) => setRevision({ item, accion: 'aprobar' }),
          },
        ]}
      />

      <AccionModal
        abierto={revision ? `${revision.item.id}-${revision.accion}` : null}
        titulo={
          revision?.accion === 'observar'
            ? `Pedir corrección · ${revision?.item.trabajador?.nombre_completo ?? ''}`
            : `Aprobar consolidado · ${revision?.item.trabajador?.nombre_completo ?? ''}`
        }
        inicial={{ Observacion: '' }}
        ayuda={
          revision?.accion === 'observar'
            ? 'Se avisa al responsable del establecimiento. Al corregir la asistencia y regenerar, el consolidado vuelve a revisión.'
            : 'Con la conformidad, el consolidado ya no se regenera. Al cerrar el período queda cerrado.'
        }
        enviar={(form) => acciones.ejecutar(revision.item, { accion: revision.accion, cuerpo: form, enModal: true })}
        onClose={() => setRevision(null)}
        campos={(form, setForm, errors) => (
          <TextoEstandar
            form={form}
            setForm={setForm}
            errors={errors}
            name="Observacion"
            opciones={revision?.accion === 'observar' ? TEXTOS.observarConsolidado : TEXTOS.observacionAprobacion}
            label={revision?.accion === 'observar' ? 'Qué debe corregirse' : 'Nota de conformidad (opcional)'}
            maxLength={1000}
          />
        )}
      />

      <AccionModal
        abierto={exportando ? 'exportar' : null}
        titulo="Exportar consolidado a Excel"
        inicial={{ periodo_asistencia_id: '', eess_id: '' }}
        ayuda="Una hoja por condición laboral (nombrados, CAS, destacados, SERUMS…), como los anexos del RIT."
        enviar={async (form) => {
          if (!form.periodo_asistencia_id) return { ok: false, errores: { periodo_asistencia_id: ['Elige el período.'] } };
          const error = await descargarArchivo('/consolidados-asistencia/exportar', form, 'Consolidado.xlsx');
          return error ? { ok: false, errores: { general: [error] } } : { ok: true };
        }}
        onClose={() => setExportando(false)}
        campos={(form, setForm, errors) => (
          <>
            <Select
              form={form}
              setForm={setForm}
              errors={errors}
              name="periodo_asistencia_id"
              label="Período"
              icon={CalendarCheck}
              options={periodos.opciones}
              required
            />
            <Select
              form={form}
              setForm={setForm}
              errors={errors}
              name="eess_id"
              label="Establecimiento"
              icon={BarChart3}
              options={establecimientos}
            />
          </>
        )}
      />

      <GenerarConsolidadoModal abierto={generando} onClose={() => setGenerando(false)} onGenerado={() => crud.cargar()} />
      <DetalleConsolidadoModal consolidado={verDetalle} onClose={() => setVerDetalle(null)} />
      <IncidenciasConsolidadoModal consolidado={verIncidencias} onClose={() => setVerIncidencias(null)} />
    </PageContainer>
  );
}
