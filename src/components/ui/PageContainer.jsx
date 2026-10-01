import ListaProvider from './ListaProvider';

// Contenedor raiz de cada Page: padding (compacto), ritmo vertical (gap) y estado compartido de
// filtros/listado. Ocupa EXACTAMENTE el alto disponible (h-full): la pagina no hace scroll, el
// listado se reparte el espacio sobrante y se pagina para caber (ver EntityList).
// Es un flex-col: PageHeader y las estadisticas de EntityList usan `order` negativo para quedar
// siempre arriba (Cabecera > Estadisticas > Filtros > Listado) sin importar el orden del JSX de la Page.
export default function PageContainer({ children }) {
  return (
    <ListaProvider>
      <div className="flex h-full w-full flex-col gap-4 px-4 py-4 lg:px-5">{children}</div>
    </ListaProvider>
  );
}
