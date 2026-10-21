import ImportarDesdeExcel from '../../components/ui/ImportarDesdeExcel';

/**
 * Programación del mes desde Excel (RIT, Art. 16): la plantilla es la grilla del mes ya llena con el personal y lo
 * programado; cada fila reemplaza el mes de ese trabajador con las mismas reglas que pintar la grilla.
 *
 *   grilla       la grilla abierta (establecimiento, mes)
 *   onImportado  se llama al terminar (para recargar la grilla)
 */
export default function ImportarProgramacionModal({ open, onClose, grilla, onImportado }) {
  if (!grilla) return null;
  const { anio, mes, etiqueta } = grilla.periodo;
  const datos = { eess_id: grilla.eess.id, anio, mes };

  return (
    <ImportarDesdeExcel
      open={open}
      onClose={onClose}
      titulo={`Importar la programación de ${etiqueta}`}
      instrucciones={`Descarga la plantilla de ${grilla.eess.nombre}: trae al personal y lo ya programado. Escribe el código del turno en cada día (dos turnos: M+T) y súbela.`}
      plantilla={{ ruta: '/programacion-mensual/plantilla', params: datos, nombre: 'programacion.xlsx' }}
      envio={{ ruta: '/programacion-mensual/importar', datos }}
      bloqueo={grilla.bloqueo}
      ayuda="Cada fila reemplaza el mes de ese trabajador (un día vacío queda libre); quien no esté en el archivo no se toca. Al validar se ensayan todas las reglas de la grilla sin guardar nada."
      resumen={(a) => [
        { etiqueta: 'Trabajadores en el archivo', valor: a.filas },
        { etiqueta: 'Días que cambian', valor: a.validos, tono: 'exito' },
        { etiqueta: 'Días con errores', valor: a.celdas_con_error, tono: a.celdas_con_error ? 'error' : undefined },
      ]}
      validos={(a) => a.validos}
      textoImportar={(n) => (n ? `Aplicar ${n} ${n === 1 ? 'cambio' : 'cambios'}` : 'Aplicar')}
      textoOmitir={(n) => `Aplicar solo los ${n} días válidos y dejar como están los que tienen errores`}
      exito={(r) => ({ titulo: `${r.aplicados} ${r.aplicados === 1 ? 'día actualizado' : 'días actualizados'}`, detalle: `La programación de ${etiqueta} sigue en borrador: revísala y publícala.` })}
      onImportado={onImportado}
    />
  );
}
