import { FileText, Hash, Minus, Percent, Tag } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';
import { TIPOS_TRAMO } from '../../utils/opciones';

export default function TramoToleranciaForm({ form, setForm, errors }) {
  const { opciones: opcionesTabla } = useOpciones('/tablas-tolerancia', { actual: form.TablaToleranciaId });

  return (
    <>
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="TablaToleranciaId"
        label="Escala de tolerancia"
        icon={Percent}
        options={opcionesTabla}
        required
      />
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TramoToleranciaTipo"
          label="Tipo"
          icon={Tag}
          options={TIPOS_TRAMO}
          required
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TramoToleranciaMinutosDescuento"
          label="Minutos que se descuentan"
          icon={Minus}
          maxLength={4}
          filter="digitos"
          placeholder="Ej. 10"
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TramoToleranciaMinutosDesde"
          label="Desde el minuto"
          icon={Hash}
          required
          maxLength={4}
          filter="digitos"
          placeholder="Ej. 6"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TramoToleranciaMinutosHasta"
          label="Hasta el minuto"
          icon={Hash}
          maxLength={4}
          filter="digitos"
          placeholder="Vacío = sin límite"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TramoToleranciaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={250}
      />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TramoToleranciaEsInasistencia" label="A partir de aquí es inasistencia injustificada" />
    </>
  );
}
