import { useEffect, useState } from 'react';
import { FileText, History, Undo2 } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import { useOpciones } from '../../hooks/useOpciones';
import { formatoFechaHora } from '../../utils/formato';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import GrupoPlegable from '../../components/ui/GrupoPlegable';
import ImportarDesdeExcel from '../../components/ui/ImportarDesdeExcel';
import SelectorDeDocumento from '../../components/ui/SelectorDeDocumento';
import StatusBadge from '../../components/ui/StatusBadge';
import TablaEnModal from '../../components/ui/TablaEnModal';

/**
 * Hojas de control de asistencia en papel pasadas al sistema. El RIT dispone que los establecimientos sin reloj de
 * reconocimiento facial sigan usando las hojas; se cargan por mes, con la hoja firmada escaneada como sustento. Las cargas
 * anteriores se listan abajo y se pueden anular (sus marcas dejan de contar y la asistencia se recalcula).
 *
 *   eess         { id, nombre } del establecimiento elegido en el calendario
 *   anio, mes    el mes que muestra el calendario
 *   onImportado  se llama al cargar o anular (para recargar el calendario)
 */
export default function CargarHojaAsistenciaModal({ open, onClose, eess, anio, mes, etiqueta, onImportado }) {
  const documentos = useOpciones('/documentos-sustento', { params: {}, sinOpcion: 'Elige la hoja escaneada', etiqueta: (d) => d.nombre });
  const [cargas, setCargas] = useState(null);
  const [error, setError] = useState('');
  const [verCargas, setVerCargas] = useState(false);
  const eessId = eess?.id;

  const pedirLista = () => api.get('/cargas-asistencia-manual', { params: { eess_id: eessId, por_pagina: 10 } }).then(({ data }) => data.data);
  const falloLista = (err) => setError(mensajeDeError(err) ?? 'No se pudieron consultar las cargas anteriores.');
  const cargarLista = () => pedirLista().then(setCargas).catch(falloLista);

  useEffect(() => {
    if (!open || !eessId) return undefined;
    let vigente = true;
    pedirLista()
      .then((filas) => vigente && setCargas(filas))
      .catch((err) => vigente && falloLista(err));
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, eessId]);

  async function anular(carga) {
    if (!window.confirm(`¿Anular la carga «${carga.nombre_archivo}»? Sus ${carga.registros} marcas dejarán de contar y la asistencia se recalculará.`)) return;
    setError('');
    try {
      await api.delete(`/cargas-asistencia-manual/${carga.id}`);
      await cargarLista();
      onImportado?.();
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo anular la carga.');
    }
  }

  if (!eess) return null;
  const datos = { eess_id: eessId, anio, mes };

  return (
    <ImportarDesdeExcel
      open={open}
      onClose={onClose}
      titulo={`Cargar hoja de asistencia · ${etiqueta}`}
      instrucciones={`Descarga la hoja de ${eess.nombre}: trae una fila por trabajador y día. Copia las horas de la hoja firmada y súbela junto con su escaneo. Para otro mes, cámbialo en el calendario.`}
      plantilla={{ ruta: '/cargas-asistencia-manual/plantilla', params: datos, nombre: 'hoja_asistencia.xlsx' }}
      envio={{ ruta: '/cargas-asistencia-manual/importar', datos }}
      campos={(form, setForm, errors) => (
        <SelectorDeDocumento
          form={form}
          setForm={setForm}
          errors={errors}
          name="DocumentoSustentoId"
          label="Hoja firmada escaneada (sustento)"
          icon={FileText}
          options={documentos.opciones}
          required
        />
      )}
      ayuda="Solo para establecimientos sin reloj facial (RIT, disposiciones complementarias). No se duplica una marca que ya existe; una salida menor que la entrada es del día siguiente (guardia nocturna)."
      resumen={(a) => [
        { etiqueta: 'Filas con horas', valor: a.filas },
        { etiqueta: 'Marcas a registrar', valor: a.marcas, tono: 'exito' },
        { etiqueta: 'Filas con errores', valor: a.filas_con_error, tono: a.filas_con_error ? 'error' : undefined },
      ]}
      validos={(a) => a.marcas}
      textoImportar={(n) => (n ? `Registrar ${n} ${n === 1 ? 'marca' : 'marcas'}` : 'Registrar')}
      textoOmitir={(n) => `Registrar solo las ${n} marcas válidas y omitir las filas con errores`}
      exito={(r) => ({ titulo: `${r.registradas} ${r.registradas === 1 ? 'marca registrada' : 'marcas registradas'}`, detalle: 'La asistencia del mes ya se recalculó. Si te equivocaste, anula la carga en la lista de abajo.' })}
      onImportado={() => {
        cargarLista();
        onImportado?.();
      }}
      pie={
        <GrupoPlegable
          icono={History}
          titulo="Cargas anteriores"
          datos={[cargas ? `${cargas.length} recientes de ${eess.nombre}` : null]}
          abierto={verCargas}
          onAlternar={() => setVerCargas((v) => !v)}
        >
          <Alert>{error}</Alert>
          <TablaEnModal
            cargando={cargas === null}
            rows={cargas ?? []}
            vacio="Aún no se cargaron hojas de asistencia."
            columns={[
              { key: 'fecha', header: 'Cargada', render: (c) => formatoFechaHora(c.fecha) },
              { key: 'nombre_archivo', header: 'Archivo' },
              { key: 'registros', header: 'Marcas' },
              { key: 'usuario', header: 'Por', render: (c) => c.usuario?.nombre },
              { key: 'estado', header: 'Estado', render: (c) => <StatusBadge tone={c.activo ? 'success' : 'neutral'} label={c.activo ? 'Vigente' : 'Anulada'} /> },
              {
                key: 'acciones',
                header: '',
                render: (c) =>
                  c.activo && (
                    <Button variant="secondary" icon={Undo2} onClick={() => anular(c)}>
                      Anular
                    </Button>
                  ),
              },
            ]}
          />
        </GrupoPlegable>
      }
    />
  );
}
