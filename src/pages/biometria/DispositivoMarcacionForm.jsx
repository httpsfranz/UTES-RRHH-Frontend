import { Building2, Hash, MapPin, ScanFace, Tag, Wifi } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function DispositivoMarcacionForm({ form, setForm, errors }) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DispositivoMarcacionCodigo"
        label="Código"
        icon={Hash}
        placeholder="Ej. DISP-001"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DispositivoMarcacionNombre"
        label="Nombre"
        icon={ScanFace}
        placeholder="Ej. Lector biométrico - Recepción"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DispositivoMarcacionTipo"
        label="Tipo"
        icon={Tag}
        placeholder="Ej. Huella dactilar / Facial / Tarjeta"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessId"
        label="ID de Establecimiento"
        icon={Building2}
        type="number"
        placeholder="Ej. 12"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DispositivoMarcacionUbicacion"
        label="Ubicación"
        icon={MapPin}
        placeholder="Ej. Ingreso principal"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DispositivoMarcacionIp"
        label="Dirección IP"
        icon={Wifi}
        placeholder="Ej. 192.168.1.10"
      />
    </>
  );
}
