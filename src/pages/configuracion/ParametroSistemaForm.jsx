import { AlignLeft, FileText, Hash } from 'lucide-react';
import { conValorActual, PARAMETROS_CON_OPCIONES } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';

export default function ParametroSistemaForm({ form, setForm, errors }) {
  // Los parametros cuyo valor es una eleccion (Sí/No, zona horaria, formato de fecha) se eligen de una lista.
  const opciones = PARAMETROS_CON_OPCIONES[form.ParametroSistemaCodigo];
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
      {opciones ? (
        <Select form={form} setForm={setForm} errors={errors} name="ParametroSistemaValor" label="Valor" icon={AlignLeft} options={conValorActual(opciones, form.ParametroSistemaValor)} />
      ) : (
        <Field form={form} setForm={setForm} errors={errors} name="ParametroSistemaValor" label="Valor" icon={AlignLeft} maxLength={500} />
      )}
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
