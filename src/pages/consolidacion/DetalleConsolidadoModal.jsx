import { useState } from 'react';
import { CalendarDays, Clock, ListChecks, Plus } from 'lucide-react';
import { useDetalleDeRegistro } from '../../hooks/useDetalleDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { entero, fecha, requerido, validador } from '../../utils/validaciones';
import { formatoFecha } from '../../utils/formato';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import FormGrid from '../../components/ui/FormGrid';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import Table from '../../components/ui/Table';
import ActionButtons from '../../components/ui/ActionButtons';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import HelpText from '../../components/ui/HelpText';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

const vacio = { DetalleConsolidadoFecha: '', DetalleConsolidadoEstado: '', DetalleConsolidadoMinutosTardanza: '0', DetalleConsolidadoMinutosExtra: '0', DetalleConsolidadoEsJustificada: false };

const validate = validador({
  DetalleConsolidadoFecha: [requerido, fecha],
  DetalleConsolidadoEstado: [requerido],
  DetalleConsolidadoMinutosTardanza: [entero({ min: 0, max: 1440 })],
  DetalleConsolidadoMinutosExtra: [entero({ min: 0, max: 1440 })],
});

/**
 * Detalle diario de un consolidado (Consolidacion.DetalleConsolidado): la foto de la asistencia de cada dia al
 * generarlo. `consolidado` null = cerrado. Mientras el consolidado esta generado u observado se pueden corregir los dias;
 * conforme o cerrado, solo se consulta (ya se presento y no se toca).
 */
export default function DetalleConsolidadoModal({ consolidado, onClose }) {
  const detalle = useDetalleDeRegistro('/detalles-consolidado', consolidado && { consolidado_asistencia_id: consolidado.id });
  const estados = useOpciones('/estados-asistencia', { params: {} });
  const opcionesEstado = estados.filas.map((fila) => ({ value: fila.codigo, label: fila.nombre }));
  const [edicion, setEdicion] = useState(null); // null = lista, { id | null, form } = formulario
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const editable = ['GENERADO', 'OBSERVADO'].includes(consolidado?.estado);

  function cerrar() {
    setEdicion(null);
    setErrores({});
    onClose();
  }

  function abrirFormulario(fila) {
    setErrores({});
    setEdicion(
      fila
        ? {
            id: fila.id,
            form: {
              DetalleConsolidadoFecha: fila.fecha,
              DetalleConsolidadoEstado: fila.estado,
              DetalleConsolidadoMinutosTardanza: String(fila.minutos_tardanza),
              DetalleConsolidadoMinutosExtra: String(fila.minutos_extra),
              DetalleConsolidadoEsJustificada: Boolean(fila.es_justificada),
            },
          }
        : { id: null, form: { ...vacio } },
    );
  }

  const setForm = (actualizar) => setEdicion((actual) => ({ ...actual, form: typeof actualizar === 'function' ? actualizar(actual.form) : actualizar }));

  async function guardar(event) {
    event.preventDefault();
    const locales = validate(edicion.form);
    if (Object.keys(locales).length) {
      setErrores(locales);
      return;
    }
    setGuardando(true);
    const datos = edicion.id ? edicion.form : { ...edicion.form, ConsolidadoAsistenciaId: consolidado.id };
    const resultado = await detalle.guardar(edicion.id, datos);
    setGuardando(false);
    if (resultado.ok) setEdicion(null);
    else setErrores(resultado.errores);
  }

  async function quitar(fila) {
    if (window.confirm(`¿Quitar el detalle del ${formatoFecha(fila.fecha)}?`)) await detalle.eliminar(fila);
  }

  const columns = [
    { key: 'fecha', header: 'Fecha', render: (fila) => formatoFecha(fila.fecha) },
    { key: 'estado', header: 'Estado', render: (fila) => opcionesEstado.find((opcion) => opcion.value === fila.estado)?.label ?? fila.estado },
    { key: 'tardanza', header: 'Tardanza (min)', render: (fila) => String(fila.minutos_tardanza) },
    { key: 'extra', header: 'Extra (min)', render: (fila) => String(fila.minutos_extra) },
    { key: 'justificada', header: 'Justificada', render: (fila) => (fila.es_justificada ? 'Sí' : 'No') },
    ...(editable ? [{ key: 'acciones', header: '', render: (fila) => <ActionButtons onEdit={() => abrirFormulario(fila)} onDelete={() => quitar(fila)} /> }] : []),
  ];

  return (
    <Modal open={Boolean(consolidado)} onClose={cerrar} title={consolidado ? `Detalle del consolidado de ${consolidado.trabajador?.nombre_completo ?? ''}` : ''} size="lg">
      {edicion ? (
        <Form onSubmit={guardar} generalError={errores.general?.[0]}>
          <FormGrid>
            <Field form={edicion.form} setForm={setForm} errors={errores} name="DetalleConsolidadoFecha" label="Fecha" icon={CalendarDays} type="date" required />
            <Select form={edicion.form} setForm={setForm} errors={errores} name="DetalleConsolidadoEstado" label="Estado de asistencia" icon={ListChecks} options={opcionesEstado} required />
          </FormGrid>
          <FormGrid>
            <Field form={edicion.form} setForm={setForm} errors={errores} name="DetalleConsolidadoMinutosTardanza" label="Minutos de tardanza" icon={Clock} maxLength={4} filter="digitos" />
            <Field form={edicion.form} setForm={setForm} errors={errores} name="DetalleConsolidadoMinutosExtra" label="Minutos de sobretiempo" icon={Clock} maxLength={4} filter="digitos" />
          </FormGrid>
          <Checkbox form={edicion.form} setForm={setForm} errors={errores} name="DetalleConsolidadoEsJustificada" label="La falta está justificada" />
          <HelpText>
            El detalle es la foto de la asistencia diaria al generar el consolidado. Corregirlo a mano no cambia los totales del consolidado: ajústalos
            también si hace falta.
          </HelpText>
          <FormActions onCancel={() => setEdicion(null)} submitting={guardando} />
        </Form>
      ) : (
        <>
          <Alert>{detalle.error}</Alert>
          {detalle.cargando ? (
            <LoadingState message="Cargando el detalle…" />
          ) : detalle.filas.length === 0 ? (
            <EmptyState message="El consolidado no tiene detalle diario." />
          ) : (
            <Table columns={columns} rows={detalle.filas} />
          )}
          <HelpText>
            {editable
              ? `${detalle.filas.length} día(s). El consolidado está pendiente de conformidad: puedes corregir su detalle.`
              : `${detalle.filas.length} día(s). El consolidado ya está conforme o cerrado: su detalle solo se consulta.`}
          </HelpText>
          <FormActions
            onCancel={cerrar}
            cancelLabel="Cerrar"
            hideSubmit
            extra={
              editable ? (
                <Button type="button" onClick={() => abrirFormulario(null)} icon={Plus}>
                  Agregar día
                </Button>
              ) : null
            }
          />
        </>
      )}
    </Modal>
  );
}
