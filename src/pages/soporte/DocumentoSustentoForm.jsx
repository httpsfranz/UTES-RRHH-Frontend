import CampoArchivo from '../../components/ui/CampoArchivo';
import HelpText from '../../components/ui/HelpText';

// Un solo campo: el archivo. El nombre, el tipo, el tamaño y el hash los toma el servidor del propio archivo.
export default function DocumentoSustentoForm({ form, setForm, errors, actual }) {
  return (
    <>
      <CampoArchivo form={form} setForm={setForm} errors={errors} name="archivo" label="Archivo" required={!actual} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" actual={actual} />
      <HelpText>Se admiten PDF, imágenes (JPG, PNG), Word y Excel hasta el tamaño máximo configurado (por omisión 5 MB). Un mismo archivo no se puede registrar dos veces.</HelpText>
    </>
  );
}
