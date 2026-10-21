import { invalidarOpciones } from '../../api/cacheDeOpciones';
import ImportarDesdeExcel from '../../components/ui/ImportarDesdeExcel';

const plural = (n, uno, varios) => `${n.toLocaleString('es-PE')} ${n === 1 ? uno : varios}`;

/**
 * Alta masiva de trabajadores desde Excel. Las columnas del vínculo laboral (establecimiento, régimen, condición, cargo,
 * inicio) y el horario son opcionales: si la fila las trae, se registra la persona con su plaza, como el asistente "Nuevo
 * trabajador"; a un trabajador ya registrado solo se le agrega el vínculo.
 *
 *   open, onClose  visibilidad
 *   onImportado    se llama al terminar (para recargar la lista)
 */
export default function ImportarTrabajadoresModal({ open, onClose, onImportado }) {
  return (
    <ImportarDesdeExcel
      open={open}
      onClose={onClose}
      titulo="Importar trabajadores desde Excel"
      instrucciones="Descarga la plantilla y llena una fila por trabajador. Las columnas naranjas (vínculo laboral y horario) son opcionales: si las llenas, el trabajador queda listo para programarse y marcar."
      plantilla={{ ruta: '/trabajadores/plantilla', nombre: 'plantilla_trabajadores.xlsx' }}
      envio={{ ruta: '/trabajadores/importar' }}
      ayuda="Primero se valida el archivo sin guardar nada, con las mismas reglas del formulario. Hasta 20 000 filas y 10 MB por carga; con vínculos, la validación toma unos segundos por cada mil filas."
      resumen={(a) => [
        { etiqueta: 'Filas leídas', valor: a.total },
        { etiqueta: `Listas para importar (${a.con_vinculo} con vínculo)`, valor: a.validas, tono: 'exito' },
        { etiqueta: 'Con errores', valor: a.filas_con_error, tono: a.filas_con_error ? 'error' : undefined },
      ]}
      validos={(a) => a.validas}
      textoImportar={(n) => (n ? `Importar ${plural(n, 'fila', 'filas')}` : 'Importar')}
      textoOmitir={(n) => `Importar solo las ${plural(n, 'fila válida', 'filas válidas')} y omitir las que tienen errores`}
      exito={(r) => ({
        titulo: r.importados ? `${plural(r.importados, 'trabajador importado', 'trabajadores importados')}` : 'Vínculos registrados',
        detalle: r.vinculos ? `${plural(r.vinculos, 'vínculo laboral', 'vínculos laborales')} y ${plural(r.horarios, 'horario asignado', 'horarios asignados')}.` : null,
      })}
      onImportado={(r) => {
        invalidarOpciones('/trabajadores');
        onImportado?.(r.importados);
      }}
    />
  );
}
