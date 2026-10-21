import ListaProvider from './ListaProvider';
import { useEmbebido } from './embebido';

// Contenedor raiz de cada Page: padding (compacto), ritmo vertical (gap) y estado compartido de
// filtros/listado. Ocupa EXACTAMENTE el alto disponible (h-full): la pagina no hace scroll, el
// listado se reparte el espacio sobrante y se pagina para caber (ver EntityList).
// Es un flex-col: PageHeader y las estadisticas de EntityList usan `order` negativo para quedar
// siempre arriba (Cabecera > Estadisticas > Filtros > Listado) sin importar el orden del JSX de la Page.
// Dentro de un modal o una pestana (embebida) no lleva padding propio y su alto es el del contenedor.
export default function PageContainer({ children }) {
  const embebida = useEmbebido();

  return (
    <ListaProvider>
      <div className={embebida ? 'flex h-full w-full flex-col gap-3' : 'flex h-full w-full flex-col gap-4 px-4 py-4 lg:px-5'}>{children}</div>
    </ListaProvider>
  );
}
