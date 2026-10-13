import { Boxes, FileText, Hash, Tag } from 'lucide-react';
import { conValorActual, MODULOS_DE_PERMISO } from '../../utils/opciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';

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
      <Select form={form} setForm={setForm} errors={errors} name="PermisoModulo" label="Módulo" icon={Boxes} options={conValorActual(MODULOS_DE_PERMISO, form.PermisoModulo)} />
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
