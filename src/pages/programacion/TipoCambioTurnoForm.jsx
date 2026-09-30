import { FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoCambioTurnoForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoCambioTurnoCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. PERMUTA"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoCambioTurnoNombre"
          label="Nombre"
          icon={Tag}
          required
          maxLength={100}
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoCambioTurnoDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoCambioTurnoRequiereReemplazante" label="Requiere reemplazante" />
    </>
  );
}
