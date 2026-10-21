import { useState } from 'react';
import { CalendarDays, Eye, FileSpreadsheet, History, Layers, ListChecks, Table2, UserRound } from 'lucide-react';
import { useConsulta } from '../../hooks/useConsulta';
import { descargarArchivo } from '../../api/descargas';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Toolbar, { ToolbarItem } from '../../components/ui/Toolbar';
import EntityList from '../../components/ui/EntityList';
import Modal from '../../components/Modal';
import DatosDeRegistro from '../../components/ui/DatosDeRegistro';
import CambiosDeAuditoria from '../../components/ui/CambiosDeAuditoria';

const MODULOS = ['Organización', 'Personal', 'Asistencia', 'Programación', 'Solicitudes', 'Vacaciones', 'Compensaciones', 'Consolidación', 'Disciplina', 'Biometría', 'Configuración', 'Seguridad', 'Soporte'];
const ACCIONES = {
  INSERT: 'Registró',
  UPDATE: 'Modificó',
  DELETE: 'Eliminó',
  LOGIN: 'Inició sesión',
  LOGIN_FALLIDO: 'Ingreso fallido',
  LOGOUT: 'Cerró sesión',
  BLOQUEO: 'Bloqueo de cuenta',
  DESBLOQUEO: 'Desbloqueo de cuenta',
  ACCESO_DENEGADO: 'Acceso denegado',
  PERMISOS: 'Cambio de roles o permisos',
  REVOCAR_SESION: 'Revocó una sesión',
  EXPORTAR: 'Exportó información',
  CAMBIO_PASSWORD: 'Cambio de contraseña',
};
const RESULTADOS = { EXITO: 'Éxito', FALLO: 'Fallo', DENEGADO: 'Denegado' };

const opciones = (mapa, todas) => [{ value: '', label: todas }, ...Object.entries(mapa).map(([value, label]) => ({ value, label }))];

const columns = [
  { key: 'fecha_hora', header: 'Fecha y hora', render: (item) => formatoFechaHora(item.fecha_hora) },
  { key: 'usuario', header: 'Usuario', render: (item) => item.usuario?.nombre ?? 'Sistema' },
  { key: 'modulo', header: 'Módulo', render: (item) => item.modulo ?? '—' },
  { key: 'operacion', header: 'Acción', render: (item) => ACCIONES[item.operacion] ?? item.operacion },
  { key: 'entidad', header: 'Entidad', render: (item) => `${item.tabla}${item.registro_id ? ` #${item.registro_id}` : ''}` },
  { key: 'resultado', header: 'Resultado', render: (item) => RESULTADOS[item.resultado] ?? item.resultado },
  { key: 'detalle', header: 'Detalle', render: (item) => item.detalle ?? '—' },
];

const FILTROS_INICIALES = { usuario: '', desde: '', hasta: '', modulo: '', operacion: '', resultado: '', tabla: '' };

/**
 * Auditoria: quien hizo que, cuando, sobre que registro y con que resultado (altas, ediciones y bajas con sus datos
 * antes y despues, ingresos, accesos denegados, cambios de permisos y exportaciones). Es de solo lectura: la base de
 * datos impide modificar o borrar sus registros. Se filtra por usuario, fecha, modulo, accion y entidad, y se exporta.
 */
export default function AuditoriaPage() {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [detalle, setDetalle] = useState(null);
  const [errorExportar, setErrorExportar] = useState('');
  const [exportando, setExportando] = useState(false);
  const params = Object.fromEntries(Object.entries(filtros).filter(([, v]) => v !== ''));
  const consulta = useConsulta('/auditoria', params, { hasta: 1000 });
  const filas = consulta.datos?.data ?? [];

  async function exportar() {
    setExportando(true);
    setErrorExportar((await descargarArchivo('/auditoria/exportar', params, 'Auditoria.xlsx')) ?? '');
    setExportando(false);
  }

  return (
    <PageContainer>
      <PageHeader title="Auditoría" subtitle="Registro inalterable de acciones y eventos de seguridad. Filtra y exporta lo que necesites.">
        <Button variant="secondary" icon={FileSpreadsheet} disabled={exportando} onClick={exportar}>
          {exportando ? 'Exportando…' : 'Exportar Excel'}
        </Button>
      </PageHeader>

      <Toolbar>
        <ToolbarItem ancho="md">
          <Field form={filtros} setForm={setFiltros} name="usuario" label="Usuario" icon={UserRound} maxLength={100} />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Field form={filtros} setForm={setFiltros} name="desde" label="Desde" icon={CalendarDays} type="date" />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Field form={filtros} setForm={setFiltros} name="hasta" label="Hasta" icon={CalendarDays} type="date" />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Select form={filtros} setForm={setFiltros} name="modulo" label="Módulo" icon={Layers} options={[{ value: '', label: 'Todos' }, ...MODULOS.map((m) => ({ value: m, label: m }))]} />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Select form={filtros} setForm={setFiltros} name="operacion" label="Acción" icon={ListChecks} options={opciones(ACCIONES, 'Todas')} />
        </ToolbarItem>
        <ToolbarItem ancho="sm">
          <Select form={filtros} setForm={setFiltros} name="resultado" label="Resultado" icon={ListChecks} options={opciones(RESULTADOS, 'Todos')} />
        </ToolbarItem>
        <ToolbarItem ancho="md">
          <Field form={filtros} setForm={setFiltros} name="tabla" label="Entidad (tabla)" icon={Table2} maxLength={100} />
        </ToolbarItem>
      </Toolbar>

      <Alert>{consulta.error || errorExportar}</Alert>

      <EntityList
        items={filas}
        total={consulta.datos?.meta?.total ?? filas.length}
        loading={consulta.cargando}
        loadingMessage="Cargando auditoría…"
        emptyIcon={History}
        emptyMessage="No hay registros de auditoría con esos filtros."
        columns={columns}
        isActive={() => undefined}
        acciones={[{ icon: Eye, label: 'Ver cambios', onClick: setDetalle }]}
      />

      <Modal open={Boolean(detalle)} onClose={() => setDetalle(null)} title="Detalle del registro de auditoría" size="lg">
        {detalle && (
          <>
            <DatosDeRegistro
              items={[
                { label: 'Fecha y hora', value: formatoFechaHora(detalle.fecha_hora) },
                { label: 'Usuario', value: detalle.usuario?.nombre ?? 'Sistema' },
                { label: 'Acción', value: ACCIONES[detalle.operacion] ?? detalle.operacion },
                { label: 'Resultado', value: RESULTADOS[detalle.resultado] ?? detalle.resultado },
                { label: 'Entidad', value: `${detalle.esquema}.${detalle.tabla}${detalle.registro_id ? ` #${detalle.registro_id}` : ''}` },
                { label: 'Detalle', value: detalle.detalle },
                { label: 'Dirección IP', value: detalle.direccion_ip },
              ]}
            />
            <CambiosDeAuditoria anteriores={detalle.datos_anteriores} nuevos={detalle.datos_nuevos} />
          </>
        )}
      </Modal>
    </PageContainer>
  );
}
