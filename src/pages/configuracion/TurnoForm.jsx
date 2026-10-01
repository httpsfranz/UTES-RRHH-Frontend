import { Clock, Coffee, Hash, LogIn, LogOut, Percent, Tag, Timer } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function TurnoForm({ form, setForm, errors }) {
  const { opciones: opcionesJornada } = useOpciones('/tipos-jornada', { actual: form.TipoJornadaId });
  const { opciones: opcionesTabla } = useOpciones('/tablas-tolerancia', { actual: form.TablaToleranciaId, sinOpcion: 'Sin escala propia' });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. M"
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoJornadaId"
          label="Tipo de jornada"
          icon={Clock}
          options={opcionesJornada}
          required
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TurnoNombre"
        label="Nombre"
        icon={Tag}
        required
        maxLength={100}
        placeholder="Ej. Mañana 07:30-13:30"
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoHoraEntrada"
          label="Hora de entrada"
          icon={LogIn}
          type="time"
          required
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoHoraSalida"
          label="Hora de salida"
          icon={LogOut}
          type="time"
          required
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoToleranciaEntradaMinutos"
          label="Tolerancia de entrada (min)"
          icon={Timer}
          maxLength={3}
          filter="digitos"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoToleranciaSalidaMinutos"
          label="Tolerancia de salida (min)"
          icon={Timer}
          maxLength={3}
          filter="digitos"
        />
      </FormGrid>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TurnoRefrigerioMinutos"
          label="Refrigerio (min)"
          icon={Coffee}
          maxLength={3}
          filter="digitos"
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TablaToleranciaId"
          label="Escala de tolerancia"
          icon={Percent}
          options={opcionesTabla}
        />
      </FormGrid>
      <Checkbox form={form} setForm={setForm} errors={errors} name="TurnoPermiteHoraExtra" label="Permite horas extra" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TurnoEsGuardia" label="Es una guardia (12 horas continuas)" />
    </>
  );
}
