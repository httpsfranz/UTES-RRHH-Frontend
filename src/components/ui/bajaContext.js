import { createContext, useContext } from 'react';

// Pide el motivo antes de desactivar un registro (modal unico de baja, ver ConfirmarBaja.jsx). El proveedor vive en
// MainLayout; sin el (pruebas, pantallas sueltas) se cae a una confirmacion simple sin motivo.
//
//   const pedirBaja = usePedirBaja();
//   const motivo = await pedirBaja({ mensaje: '¿Desactivar "Cargo X"?', endpoint: '/cargos' });   // null = cancelo
export const BajaContext = createContext(null);

export function usePedirBaja() {
  const pedir = useContext(BajaContext);
  return pedir ?? (async ({ mensaje }) => (window.confirm(mensaje) ? '' : null));
}
