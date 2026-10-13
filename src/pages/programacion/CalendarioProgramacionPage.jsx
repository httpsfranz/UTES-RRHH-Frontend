import CalendarioPlanificacionPage from './CalendarioPlanificacionPage';

export default function CalendarioProgramacionPage() {
  return (
    <CalendarioPlanificacionPage
      titulo="Calendario de programación"
      subtitulo="Programación · Calendario de programación"
      endpoint="/programacion-calendario/turnos"
      etiqueta="PROGRAMACIÓN"
    />
  );
}
