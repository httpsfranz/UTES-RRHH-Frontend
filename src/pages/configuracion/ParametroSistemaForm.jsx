import { AlignLeft, FileText, Hash } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function ParametroSistemaForm({ form, setForm, errors }) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ParametroSistemaCodigo"
        label="Código"
        icon={Hash}
        required
        maxLength={100}
        filter="codigo"
        placeholder="Ej. DIAS_JUSTIFICAR_FALTA"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ParametroSistemaValor"
        label="Valor"
        icon={AlignLeft}
        maxLength={500}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="ParametroSistemaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
