import { FileText, Folder, KeyRound, ShieldCheck } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function PermisoForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="PermisoCodigo" label="Código" icon={KeyRound} placeholder="Ej. SEG_PERMISOS_CREAR" />
        <Field form={form} setForm={setForm} errors={errors} name="PermisoNombre" label="Nombre" icon={ShieldCheck} placeholder="Ej. Crear permisos" />
      </FormGrid>
      <Field form={form} setForm={setForm} errors={errors} name="PermisoModulo" label="Módulo" icon={Folder} placeholder="Ej. Seguridad" />
      <Field form={form} setForm={setForm} errors={errors} name="PermisoDescripcion" label="Descripción" icon={FileText} />
    </>
  );
}
