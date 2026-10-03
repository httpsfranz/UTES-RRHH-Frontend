import { useState } from 'react';
import { CircleCheck, CircleX, FileSignature, Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useAccionDeRegistro } from '../../hooks/useAccionDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { fecha, noAnteriorA, requerido, validador } from '../../utils/validaciones';
import { ESTADOS_SOLICITUD, etiquetaDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import ResolucionModal from '../../components/ui/ResolucionModal';
import LicenciaForm from './LicenciaForm';

const { emptyForm, mapToForm } = formModel({
  VinculoLaboralId: 'vinculo_laboral_id',
  TipoLicenciaId: 'tipo_licencia_id',
  DocumentoSustentoId: 'documento_sustento_id',
  UsuarioRegistroId: 'usuario_registro_id',
  LicenciaNumeroResolucion: 'numero_resolucion',
  LicenciaFechaInicio: 'fecha_inicio',
  LicenciaFechaFin: 'fecha_fin',
  LicenciaMotivo: 'motivo',
});

const dias = (item) => Math.round((Date.parse(item.fecha_fin) - Date.parse(item.fecha_inicio)) / 86400000) + 1;
const rango = (item) => `${formatoFecha(item.fecha_inicio)} – ${formatoFecha(item.fecha_fin)} (${dias(item)} d)`;
const pendiente = (item) => item.estado === 'PENDIENTE';
const noAnulada = (item) => item.estado !== 'ANULADO';

const columns = [
  { key: 'trabajador', header: 'Trabajador', render: (item) => item.trabajador?.nombre_completo ?? '—' },
  { key: 'tipo', header: 'Tipo', render: (item) => item.tipo?.nombre ?? '—' },
  { key: 'fechas', header: 'Fechas', render: rango },
  { key: 'goce', header: 'Con goce', render: (item) => (item.tipo?.con_goce ? 'Sí' : 'No') },
  { key: 'estado', header: 'Resolución', render: (item) => etiquetaDe(ESTADOS_SOLICITUD, item.estado) },
];

const card = (item) => ({
  icon: FileSignature,
  title: item.trabajador?.nombre_completo ?? 'Licencia',
  meta: [item.tipo?.nombre, rango(item), item.numero_resolucion && `Resolución ${item.numero_resolucion}`, item.motivo],
  footer: etiquetaDe(ESTADOS_SOLICITUD, item.estado),
});

export default function LicenciaPage() {
  // El maximo de dias depende del tipo elegido: la validacion de usuario necesita el catalogo.
  const tipos = useOpciones('/tipos-licencia');
  const validate = validador({
    VinculoLaboralId: [requerido],
    TipoLicenciaId: [requerido],
    LicenciaFechaInicio: [requerido, fecha],
    LicenciaFechaFin: [
      requerido,
      fecha,
      noAnteriorA('LicenciaFechaInicio', 'La fecha final no puede ser anterior a la inicial.'),
      (valor, form) => {
        const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoLicenciaId));
        const total = Math.round((Date.parse(valor) - Date.parse(form.LicenciaFechaInicio)) / 86400000) + 1;
        return tipo?.maximo_dias && total > tipo.maximo_dias ? `Esta licencia admite como máximo ${tipo.maximo_dias} días corridos (se piden ${total}).` : null;
      },
    ],
  });

  const crud = useCrudResource({
    endpoint: '/licencias',
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: (item) => `¿Anular la licencia de ${item.trabajador?.nombre_completo ?? ''} (${rango(item)})?`,
    deactivateErrorMessage: 'No se pudo anular la licencia.',
  });
  const acciones = useAccionDeRegistro('/licencias', { alTerminar: () => crud.cargar() });
  const [resolucion, setResolucion] = useState({ item: null, accion: null });
  const cerrar = () => setResolucion({ item: null, accion: null });

  return (
    <PageContainer>
      <PageHeader title="Licencias" subtitle="Solicitudes · Licencia">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nueva licencia
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por trabajador, resolución o motivo…"
      />

      <Alert>{crud.error || acciones.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando licencias…"
        emptyIcon={FileSignature}
        emptyMessage="No hay licencias registradas todavía."
        columns={columns}
        card={card}
        acciones={[
          { icon: CircleCheck, label: 'Aprobar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'aprobar' }) },
          { icon: CircleX, label: 'Rechazar', visible: pendiente, onClick: (item) => setResolucion({ item, accion: 'rechazar' }) },
        ]}
        etiquetas={{ activo: 'Vigente', inactivo: 'Anulada', desactivar: 'Anular' }}
        puedeEditar={pendiente}
        puedeAlternar={noAnulada}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar licencia' : 'Nueva licencia'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <LicenciaForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>

      <ResolucionModal
        item={resolucion.item}
        accion={resolucion.accion}
        titulo={resolucion.accion === 'rechazar' ? 'Rechazar licencia' : 'Aprobar licencia'}
        resolver={(item, accion, datos) => acciones.ejecutar(item, { accion, cuerpo: datos, enModal: true })}
        onClose={cerrar}
      />
    </PageContainer>
  );
}
