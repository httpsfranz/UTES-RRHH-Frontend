import { lazy } from 'react';
import { BarChart3, CalendarCheck, ClipboardCheck, Hourglass, Wallet } from 'lucide-react';
import PantallaConPestanas from '../../components/ui/PantallaConPestanas';

// El detalle que el Cierre del mes resume: consolidado, liquidaciones, horas de compensacion y periodos.
const PESTANAS = [
  { id: 'consolidado', etiqueta: 'Consolidado', icono: BarChart3, pagina: lazy(() => import('./ConsolidadoAsistenciaPage')) },
  { id: 'liquidaciones', etiqueta: 'Liquidaciones de descuento', icono: Wallet, pagina: lazy(() => import('../compensaciones/LiquidacionDescuentoPage')) },
  { id: 'compensaciones', etiqueta: 'Compensación horaria', icono: ClipboardCheck, pagina: lazy(() => import('../compensaciones/CompensacionHorariaListaPage')) },
  { id: 'horas', etiqueta: 'Horas detectadas', icono: Hourglass, pagina: lazy(() => import('../compensaciones/HorasDetectadasPage')) },
  { id: 'periodos', etiqueta: 'Períodos de asistencia', icono: CalendarCheck, pagina: lazy(() => import('./PeriodoAsistenciaPage')) },
];

export default function ConsolidadoYDescuentosPage() {
  return (
    <PantallaConPestanas
      titulo="Consolidado y descuentos"
      subtitulo="El detalle de cada trabajador en el mes: consolidado, liquidaciones de descuento y horas por compensar."
      pestanas={PESTANAS}
    />
  );
}
