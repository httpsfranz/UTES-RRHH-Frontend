// Dashboard de prueba: estatico a proposito (los valores reales llegan con los modulos
// de Personal y Asistencia). Se reemplaza cuando se defina el dashboard final.
import PageContainer from '../components/ui/PageContainer';
import PageHeader from '../components/ui/PageHeader';
import Panel from '../components/ui/Panel';
import StatCard from '../components/ui/StatCard';
import StatGrid from '../components/ui/StatGrid';

const stats = [
  { label: 'Trabajadores activos', value: '—' },
  { label: 'Microredes', value: '—' },
  { label: 'Marcaciones hoy', value: '—' },
  { label: 'Solicitudes pendientes', value: '—' },
];

export default function HomePage() {
  return (
    <PageContainer>
      <PageHeader title="Dashboard" subtitle="Sistema de Control de Asistencia — Red de Salud Trujillo" />

      <StatGrid>
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </StatGrid>

      <Panel title="Actividad reciente">
        Panel de marcador de posición — se reemplaza cuando se defina el dashboard final.
      </Panel>
    </PageContainer>
  );
}
