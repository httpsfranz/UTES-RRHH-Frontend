// Contenedor raiz de cada Page: el padding vive aca para que las pages no lleven className.
export default function PageContainer({ children }) {
  return <div className="p-6">{children}</div>;
}
