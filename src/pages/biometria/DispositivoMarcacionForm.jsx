import { Building2, Hash, MapPin, ScanFace, Tag, Wifi } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';

export default function DispositivoMarcacionForm({ form, setForm, errors }) {
  const { opciones: opcionesEess } = useOpciones('/establecimientos', { actual: form.EessId, sinOpcion: 'Sin establecimiento asignado' });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="DispositivoMarcacionCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={50}
          filter="codigo"
          placeholder="Ej. DISP-001"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="DispositivoMarcacionTipo"
          label="Tipo"
          icon={Tag}
          required
          maxLength={50}
          placeholder="Ej. Huella dactilar / Facial / Tarjeta"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DispositivoMarcacionNombre"
        label="Nombre"
        icon={ScanFace}
        required
        maxLength={100}
        placeholder="Ej. Lector biométrico - Recepción"
      />
      <Select
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessId"
        label="Establecimiento"
        icon={Building2}
        options={opcionesEess}
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="DispositivoMarcacionUbicacion"
          label="Ubicación"
          icon={MapPin}
          maxLength={200}
          placeholder="Ej. Ingreso principal"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="DispositivoMarcacionIp"
          label="Dirección IP"
          icon={Wifi}
          maxLength={45}
          filter="ip"
          placeholder="Ej. 192.168.1.10"
        />
      </FormGrid>
    </>
  );
}
