import { FileText, FileType, Fingerprint, FolderOpen, Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';

export default function DocumentoSustentoForm({ form, setForm, errors }) {
  return (
    <>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DocumentoSustentoNombre"
        label="Nombre del archivo"
        icon={FileText}
        required
        maxLength={255}
        placeholder="Ej. certificado-medico.pdf"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DocumentoSustentoRuta"
        label="Ruta de almacenamiento"
        icon={FolderOpen}
        maxLength={500}
        placeholder="Ej. /storage/documentos/2026/09/archivo.pdf"
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="DocumentoSustentoTipo"
          label="Tipo (MIME)"
          icon={Tag}
          maxLength={100}
          placeholder="Ej. application/pdf"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="DocumentoSustentoExtension"
          label="Extensión"
          icon={FileType}
          maxLength={10}
          placeholder="Ej. pdf"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DocumentoSustentoTamanoBytes"
        label="Tamaño (bytes)"
        icon={Hash}
        maxLength={12}
        filter="digitos"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="DocumentoSustentoHash"
        label="Hash SHA-256"
        icon={Fingerprint}
        maxLength={128}
      />
    </>
  );
}
