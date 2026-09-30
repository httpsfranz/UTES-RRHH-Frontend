// Dos columnas para campos cortos dentro de un formulario (codigo + nombre, etc.).
export default function FormGrid({ children }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}
