import { Suspense } from 'react';
import Modal from '../Modal';
import LoadingState from './LoadingState';
import { EmbebidoContext } from './embebido';

// Modal grande que muestra una Page completa (listado, filtros, crear/editar/activar) sin salir de la pantalla actual:
// asi los catalogos pequenos viven en un solo lugar de configuracion y no ocupan una entrada del menu cada uno.
// Sus propios formularios se abren como un submodal flotante sobre este.
export default function ModalDePagina({ abierto, onClose, titulo, pagina: Pagina }) {
  return (
    <Modal open={abierto} onClose={onClose} title={titulo} size="xl">
      <EmbebidoContext.Provider value>
        <div className="h-[64vh]">
          <Suspense fallback={<LoadingState message="Cargando…" />}>{Pagina && <Pagina />}</Suspense>
        </div>
      </EmbebidoContext.Provider>
    </Modal>
  );
}
