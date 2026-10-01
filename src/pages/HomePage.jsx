// Dashboard de prueba: estatico a proposito (los valores reales llegan con los modulos
// de Personal y Asistencia). Se reemplaza cuando se defina el dashboard final.
import PageContainer from '../components/ui/PageContainer';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import StatCard from '../components/ui/StatCard';
import StatGrid from '../components/ui/StatGrid';
import { Building2, Clock, FileText, Users } from 'lucide-react';
import { TONES } from '../nav/moduleIcons';

const stats = [
  { label: 'Trabajadores activos', value: '—', icon: Users, tone: TONES.teal },
  { label: 'Microredes', value: '—', icon: Building2, tone: TONES.blue },
  { label: 'Marcaciones hoy', value: '—', icon: Clock, tone: TONES.green },
  { label: 'Solicitudes pendientes', value: '—', icon: FileText, tone: TONES.orange },
];

export default function HomePage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Sistema de Control de Asistencia — Red de Salud Trujillo" />

      <StatGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </StatGrid>

      <Panel title="Actividad reciente">
        Panel de marcador de posición — se reemplaza cuando se defina el dashboard final.
      </Panel>
    </PageContainer>
  );
}
