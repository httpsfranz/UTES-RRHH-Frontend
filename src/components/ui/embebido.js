import { createContext, useContext } from 'react';

// Una Page puede mostrarse DENTRO de otra (en un modal de configuracion o en una pestana) en vez de ocupar la pantalla:
// en ese caso PageContainer y PageHeader se compactan (sin migas de pan, alto fijo). Lo provee ModalDePagina y Pestanas.
export const EmbebidoContext = createContext(false);

export function useEmbebido() {
  return useContext(EmbebidoContext);
}
