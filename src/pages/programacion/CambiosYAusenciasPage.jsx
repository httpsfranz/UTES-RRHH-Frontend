import { lazy } from 'react';
import { CalendarRange, ClipboardList, ListChecks, Repeat } from 'lucide-react';
import PantallaConPestanas from '../../components/ui/PantallaConPestanas';

// Lo que cambia una programacion ya armada: cambios de turno, guardias comunitarias, ausencias del mes y el historial.
const PESTANAS = [
  { id: 'cambios', etiqueta: 'Cambios de turno', icono: Repeat, pagina: lazy(() => import('./CambioTurnoPage')) },
  { id: 'ausencias', etiqueta: 'Ausencias y vacaciones', icono: CalendarRange, pagina: lazy(() => import('./CalendarioAusenciasPage')) },
  { id: 'guardias', etiqueta: 'Guardias comunitarias', icono: ClipboardList, pagina: lazy(() => import('./InformeGuardiaComunitariaPage')) },
  { id: 'programaciones', etiqueta: 'Programaciones registradas', icono: ListChecks, pagina: lazy(() => import('./ProgramacionPeriodoPage')) },
];

export default function CambiosYAusenciasPage() {
  return (
    <PantallaConPestanas
      titulo="Cambios y ausencias"
      subtitulo="Cambios de turno, quién falta en el mes, informes de guardia comunitaria y el historial de programaciones."
      pestanas={PESTANAS}
    />
  );
}
