import CalendarioPlanificacionPage from './CalendarioPlanificacionPage';

export default function CalendarioAusenciasPage() {
  return (
    <CalendarioPlanificacionPage
      titulo="Calendario de ausencias y vacaciones"
      subtitulo="Programación · Ausencias y vacaciones"
      endpoint="/programacion-calendario/ausencias"
      etiqueta="AUSENCIAS"
    />
  );
}
