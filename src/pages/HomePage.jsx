// Inicio: resumen del dia limitado al alcance de quien entra (toda la Red, su establecimiento o su propia informacion).
import { AlarmClockOff, Bell, CalendarCheck, Clock, FileText, UserX, Users } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useResumenDeInicio } from '../hooks/useResumenDeInicio';
import { TONES } from '../nav/moduleIcons';
import Alert from '../components/ui/Alert';
import LoadingState from '../components/ui/LoadingState';
import NotificacionesRecientes from '../components/dashboard/NotificacionesRecientes';
import PageContainer from '../components/ui/PageContainer';
import PageHeader from '../components/ui/PageHeader';
import PendientesPorTipo from '../components/dashboard/PendientesPorTipo';
import StatCard from '../components/ui/StatCard';
import StatGrid from '../components/ui/StatGrid';

const ALCANCE = {
  red: 'Toda la Red',
  establecimientos: 'Tus establecimientos',
  propio: 'Tu información',
};

export default function HomePage() {
  const { usuario, alcance, tiene } = useAuth();
  const { resumen, error } = useResumenDeInicio();
  const propio = alcance.propio;
  const veSolicitudes = !propio && tiene('SOLICITUDES_VER');

  const subtitulo = resumen ? `${ALCANCE[resumen.alcance]} · ${usuario?.nombre ?? ''}` : 'Sistema de Control de Asistencia — Red de Salud Trujillo';

  return (
    <PageContainer>
      <PageHeader title="Inicio" subtitle={subtitulo} />
      <Alert>{error}</Alert>
      {!resumen && !error && <LoadingState message="Cargando resumen…" />}

      {resumen && (
        <>
          <StatGrid>
            {!propio && <StatCard label="Trabajadores activos" value={resumen.trabajadores_activos} icon={Users} tone={TONES.teal} />}
            <StatCard label="Marcaciones hoy" value={resumen.marcaciones_hoy} icon={Clock} tone={TONES.green} />
            {veSolicitudes && <StatCard label="Solicitudes por resolver" value={resumen.solicitudes_pendientes} icon={FileText} tone={TONES.orange} />}
            <StatCard label="Avisos sin leer" value={resumen.notificaciones_sin_leer} icon={Bell} tone={TONES.blue} />
          </StatGrid>

          <StatGrid>
            <StatCard label={`Días trabajados (${resumen.asistencia_mes.desde.slice(5, 7)}/${resumen.asistencia_mes.desde.slice(0, 4)})`} value={resumen.asistencia_mes.trabajados} icon={CalendarCheck} tone={TONES.green} />
            <StatCard label="Tardanzas del mes" value={resumen.asistencia_mes.tardanzas} icon={AlarmClockOff} tone={TONES.amber} />
            <StatCard label="Faltas injustificadas" value={resumen.asistencia_mes.faltas} icon={UserX} tone={TONES.red} />
            <StatCard label="Faltas justificadas" value={resumen.asistencia_mes.justificadas} icon={CalendarCheck} tone={TONES.indigo} />
          </StatGrid>

          <div className="grid gap-4 lg:grid-cols-2">
            {veSolicitudes && <PendientesPorTipo pendientes={resumen.pendientes_por_tipo} />}
            <NotificacionesRecientes notificaciones={resumen.notificaciones} />
          </div>
        </>
      )}
    </PageContainer>
  );
}
