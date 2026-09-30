import { CheckCircle2, Code, Folder, Shield } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function PermisoForm({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Código del Permiso */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoCodigo"
        label="Código"
        icon={Code}
        placeholder="ej. SEG_PERMISOS_CREAR"
      />

      {/* Nombre del Permiso */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoNombre"
        label="Nombre"
        icon={Shield}
        placeholder="ej. Crear Permisos"
      />

      {/* Módulo al que pertenece */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoModulo"
        label="Módulo"
        icon={Folder}
        placeholder="ej. Seguridad"
      />

      {/* Estado activo/inactivo */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="PermisoEstado"
        label="Estado"
        icon={CheckCircle2}
        type="select"
        options={[
          { value: 1, label: 'Activo' },
          { value: 0, label: 'Inactivo' },
        ]}
      />
    </div>
  );
}