import { useState } from 'react';
import { api } from '../../api/client';
import { aFormData } from '../../api/documentos';
import { mensajeDeError } from '../../api/paginado';
import Modal from '../../components/Modal';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import CampoArchivo from '../../components/ui/CampoArchivo';
import HelpText from '../../components/ui/HelpText';

const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } };

/**
 * Marcaciones exportadas por un reloj biometrico comercial (RIT, Art. 16): primero se revisa el archivo (no guarda nada)
 * y despues se confirma. Columnas: DNI, FECHA_HORA (AAAA-MM-DD HH:MM) y TIPO (ENTRADA o SALIDA).
 */
export default function ImportarMarcacionesModal({ open, onClose, onImportado }) {
  const [form, setForm] = useState({ archivo: null });
  const [analisis, setAnalisis] = useState(null);
  const [error, setError] = useState('');
  const [trabajando, setTrabajando] = useState(false);

  async function enviar(confirmar) {
    setTrabajando(true);
    setError('');
    try {
      const { data } = await api.post('/marcaciones/importar', aFormData({ archivo: form.archivo, confirmar: confirmar ? 1 : 0 }), MULTIPART);
      setAnalisis(data);
      if (confirmar) onImportado?.();
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo leer el archivo.');
    } finally {
      setTrabajando(false);
    }
  }

  function cerrar() {
    setForm({ archivo: null });
    setAnalisis(null);
    setError('');
    onClose();
  }

  return (
    <Modal open={open} onClose={cerrar} title="Importar marcaciones del reloj">
      <div className="space-y-4">
        <Alert>{error}</Alert>
        <CampoArchivo form={form} setForm={setForm} name="archivo" label="Archivo CSV o Excel" accept=".csv,.txt,.xlsx" required />
        <HelpText>Columnas: DNI, FECHA_HORA (AAAA-MM-DD HH:MM) y TIPO (ENTRADA o SALIDA). Las marcas repetidas se omiten y la asistencia se recalcula.</HelpText>
        {analisis && (
          <>
            <Alert variant="aviso">
              {analisis.registradas > 0
                ? `${analisis.registradas} marcas registradas.`
                : `${analisis.validas} marcas válidas, ${analisis.repetidas} repetidas y ${analisis.errores.length} filas con error.`}
            </Alert>
            {analisis.errores.slice(0, 8).map((e) => (
              <HelpText key={e}>{e}</HelpText>
            ))}
          </>
        )}
        <AccionesDeModal>
          <Button variant="secondary" onClick={() => enviar(false)} disabled={!form.archivo || trabajando}>
            Revisar archivo
          </Button>
          <Button onClick={() => enviar(true)} disabled={!analisis?.validas || analisis.registradas > 0 || trabajando}>
            Importar
          </Button>
        </AccionesDeModal>
      </div>
    </Modal>
  );
}
