import { Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

export default function TipoCambioTurnoForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoCambioTurnoCodigo" label="Código" icon={Hash} placeholder="Ej. PERMUTA" />
        <Field form={form} setForm={setForm} errors={errors} name="TipoCambioTurnoNombre" label="Nombre" icon={Tag} placeholder="Ej. Permuta de turno" />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoCambioTurnoRequiereReemplazante" label="Requiere reemplazante" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoCambioTurnoEstado" label="Estado activo" />
    </>
  );
}
