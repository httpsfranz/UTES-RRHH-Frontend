// Fila de botones al pie de un modal informativo (Cerrar, Editar, Eliminar...), alineada a la derecha.
export default function AccionesDeModal({ children }) {
  return <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line-soft pt-4">{children}</div>;
}
