import { FileText, Fingerprint, FolderOpen, HardDrive, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function DocumentoSustentoForm({ form, setForm, errors }) {
  return (
    <>
      <Field form={form} setForm={setForm} errors={errors} name="DocumentoSustentoNombre" label="Nombre" icon={FileText} />
      <Field form={form} setForm={setForm} errors={errors} name="DocumentoSustentoRuta" label="Ruta" icon={FolderOpen} />
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="DocumentoSustentoTipo" label="Tipo (MIME)" icon={Tag} placeholder="application/pdf" />
        <Field form={form} setForm={setForm} errors={errors} name="DocumentoSustentoExtension" label="Extensión" icon={FileText} placeholder="pdf" />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="DocumentoSustentoTamanoBytes" label="Tamaño (bytes)" icon={HardDrive} type="number" />
        <Field form={form} setForm={setForm} errors={errors} name="DocumentoSustentoHash" label="Hash" icon={Fingerprint} />
      </FormGrid>
    </>
  );
}
