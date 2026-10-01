import { createContext, useContext } from 'react';

// Estado compartido entre la barra de filtros (SearchInput) y el listado (EntityList) de una misma
// pagina, para que ambos se comuniquen sin que cada Page tenga que cablearlos:
//   - EntityList registra que filtros aplican (`meta`: Estado, selects derivados de las columnas,
//     si hay selector de vista) y filtra con los valores elegidos.
//   - SearchInput los dibuja dentro de su tarjeta y publica el texto de busqueda (`busqueda`).
// El proveedor vive en PageContainer (ver ListaProvider.jsx).
export const ListaContext = createContext(null);

export function useLista() {
  return useContext(ListaContext);
}
