import { lazy } from 'react';
import { CalendarRange, ClipboardList, Palmtree } from 'lucide-react';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import PasosDelProceso from '../../components/ui/PasosDelProceso';
import Pestanas from '../../components/ui/Pestanas';

// Las vacaciones son un solo proceso de tres pasos (RIT, Art. 68 a 74): se ven en una pantalla, una pestana por paso.
const PASOS = [
  { titulo: 'Récord', texto: 'Cada año de servicios da 30 días. Solo se indica desde cuándo corre el récord.' },
  { titulo: 'Rol (programación)', texto: 'Se programan las fechas del descanso; el rol se aprueba en noviembre (Art. 71).' },
  { titulo: 'Goce', texto: 'Se solicita el goce del descanso programado y se aprueba; los días se descuentan solos.' },
  { titulo: 'Asistencia', texto: 'El goce aprobado aparece como VAC en el control de asistencia: no es falta.' },
];

const PESTANAS = [
  { id: 'record', etiqueta: '1. Récord', icono: CalendarRange, pagina: lazy(() => import('./PeriodoVacacionalPage')) },
  { id: 'rol', etiqueta: '2. Rol vacacional', icono: ClipboardList, pagina: lazy(() => import('./RolVacacionalPage')) },
  { id: 'goce', etiqueta: '3. Goce', icono: Palmtree, pagina: lazy(() => import('./GoceVacacionalPage')) },
];

export default function VacacionesPage() {
  return (
    <PageContainer>
      <PageHeader title="Vacaciones del personal" subtitle="Récord, programación y goce del descanso vacacional en un solo lugar." />
      <PasosDelProceso pasos={PASOS} />
      <Pestanas pestanas={PESTANAS} />
    </PageContainer>
  );
}
