import { Boxes, FileText, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function PermisoForm({ form, setForm, errors }) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoCodigo"
        label="Código"
        icon={Hash}
        required
        maxLength={100}
        filter="codigo"
        placeholder="Ej. ASISTENCIA_VER"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoNombre"
        label="Nombre"
        icon={Tag}
        required
        maxLength={150}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoModulo"
        label="Módulo"
        icon={Boxes}
        maxLength={60}
        placeholder="Ej. ASISTENCIA"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
