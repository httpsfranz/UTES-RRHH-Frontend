import RegistroRitPage from './RegistroRitPage';

/** Componente de pestana para `PantallaConPestanas` o de tarjeta para Configuracion. */
export const paginaDeRegistro = (id) =>
  function PaginaDeRegistro() {
    return <RegistroRitPage id={id} />;
  };
