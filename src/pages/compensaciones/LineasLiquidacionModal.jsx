import { useState } from 'react';
import { FileText, ListChecks, Plus, Wallet } from 'lucide-react';
import { useDetalleDeRegistro } from '../../hooks/useDetalleDeRegistro';
import { useOpciones } from '../../hooks/useOpciones';
import { decimal, requerido, validador } from '../../utils/validaciones';
import { formatoSoles } from '../../utils/formato';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import FormActions from '../../components/ui/FormActions';
import FormGrid from '../../components/ui/FormGrid';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Table from '../../components/ui/Table';
import ActionButtons from '../../components/ui/ActionButtons';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import HelpText from '../../components/ui/HelpText';
import LoadingState from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';

const vacio = { ConceptoDescuentoId: '', DetalleLiquidacionCantidad: '0', DetalleLiquidacionImporte: '0', DetalleLiquidacionObservacion: '' };

const validate = validador({
  ConceptoDescuentoId: [requerido],
  DetalleLiquidacionCantidad: [requerido, decimal({ min: 0, max: 99999999.99 })],
  DetalleLiquidacionImporte: [requerido, decimal({ min: 0, max: 9999999999.99 })],
});

/**
 * Lineas de una liquidacion de descuentos (Compensaciones.DetalleLiquidacion), dentro de la pantalla de Liquidaciones.
 * `liquidacion` null = cerrado. Mientras esta GENERADA se completan los importes y se agregan o quitan lineas; aprobada
 * o remitida, solo se consulta. `alCambiar` avisa a la pantalla para que recargue el listado.
 */
export default function LineasLiquidacionModal({ liquidacion, onClose, alCambiar }) {
  const detalle = useDetalleDeRegistro('/detalles-liquidacion', liquidacion && { liquidacion_descuento_id: liquidacion.id }, { alCambiar });
  const conceptos = useOpciones('/conceptos-descuento');
  const [edicion, setEdicion] = useState(null); // null = lista, { id | null, form } = formulario
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const editable = liquidacion?.estado === 'GENERADO';
  const total = detalle.filas.reduce((suma, fila) => suma + Number(fila.importe), 0);

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
              ConceptoDescuentoId: fila.concepto_descuento_id,
              DetalleLiquidacionCantidad: String(fila.cantidad),
              DetalleLiquidacionImporte: String(fila.importe),
              DetalleLiquidacionObservacion: fila.observacion ?? '',
            },
          }
        : { id: null, form: { ...vacio, LiquidacionDescuentoId: liquidacion.id } },
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
    const datos = edicion.id ? edicion.form : { ...edicion.form, LiquidacionDescuentoId: liquidacion.id };
    const resultado = await detalle.guardar(edicion.id, datos);
    setGuardando(false);
    if (resultado.ok) setEdicion(null);
    else setErrores(resultado.errores);
  }

  async function quitar(fila) {
    if (window.confirm(`¿Quitar la línea "${fila.concepto?.nombre ?? ''}" de la liquidación?`)) await detalle.eliminar(fila);
  }

  const columns = [
    { key: 'concepto', header: 'Concepto', render: (fila) => fila.concepto?.nombre ?? '—' },
    { key: 'cantidad', header: 'Cantidad', render: (fila) => String(fila.cantidad) },
    { key: 'importe', header: 'Importe', render: (fila) => formatoSoles(fila.importe) },
    { key: 'observacion', header: 'Observación', render: (fila) => fila.observacion ?? '—' },
    ...(editable ? [{ key: 'acciones', header: '', render: (fila) => <ActionButtons onEdit={() => abrirFormulario(fila)} onDelete={() => quitar(fila)} /> }] : []),
  ];

  return (
    <Modal open={Boolean(liquidacion)} onClose={cerrar} title={liquidacion ? `Líneas de la liquidación de ${liquidacion.trabajador?.nombre_completo ?? ''}` : ''} size="lg">
      {edicion ? (
        <Form onSubmit={guardar} generalError={errores.general?.[0]}>
          <Select form={edicion.form} setForm={setForm} errors={errores} name="ConceptoDescuentoId" label="Concepto de descuento" icon={ListChecks} options={conceptos.opciones} required />
          <FormGrid>
            <Field form={edicion.form} setForm={setForm} errors={errores} name="DetalleLiquidacionCantidad" label="Cantidad (días u horas)" icon={ListChecks} required maxLength={11} filter="decimal" inputMode="decimal" />
            <Field form={edicion.form} setForm={setForm} errors={errores} name="DetalleLiquidacionImporte" label="Importe a descontar (S/)" icon={Wallet} required maxLength={13} filter="decimal" inputMode="decimal" />
          </FormGrid>
          <Textarea form={edicion.form} setForm={setForm} errors={errores} name="DetalleLiquidacionObservacion" label="Observación" icon={FileText} maxLength={500} />
          <HelpText>
            RIT, Art. 25: valor del día = ingreso total / 30; valor de la hora = valor del día / jornada diaria (6 u 8 horas); valor del minuto = valor de
            la hora / 60. El sistema no guarda la remuneración: el importe se completa con el dato de la planilla.
          </HelpText>
          <FormActions onCancel={() => setEdicion(null)} submitting={guardando} />
        </Form>
      ) : (
        <>
          <Alert>{detalle.error}</Alert>
          {detalle.cargando ? (
            <LoadingState message="Cargando las líneas…" />
          ) : detalle.filas.length === 0 ? (
            <EmptyState message="La liquidación no tiene líneas." />
          ) : (
            <Table columns={columns} rows={detalle.filas} />
          )}
          <HelpText>
            {`Importe total: ${formatoSoles(total)}. ${
              editable
                ? 'Completa el importe de cada línea con el dato de la planilla; sin él no se puede aprobar la liquidación.'
                : 'La liquidación ya no está generada: sus líneas solo se consultan.'
            }`}
          </HelpText>
          <FormActions
            onCancel={cerrar}
            cancelLabel="Cerrar"
            hideSubmit={!editable}
            extra={
              editable ? (
                <Button type="button" onClick={() => abrirFormulario(null)} icon={Plus}>
                  Agregar línea
                </Button>
              ) : null
            }
          />
        </>
      )}
    </Modal>
  );
}
