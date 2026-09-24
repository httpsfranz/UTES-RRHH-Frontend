// Dashboard de prueba: estatico a proposito, todo en este mismo archivo (sin
// importar ni crear componentes nuevos) para que sea trivial de tirar y reemplazar
// cuando definan el dashboard real.
export default function HomePage() {
  const stats = [
    { label: 'Trabajadores activos', value: '—' },
    { label: 'Microredes', value: '—' },
    { label: 'Marcaciones hoy', value: '—' },
    { label: 'Solicitudes pendientes', value: '—' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-heading">Dashboard</h1>
        <p className="text-sm text-muted">Sistema de Control de Asistencia — Red de Salud Trujillo</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-heading">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-heading">Actividad reciente</h2>
        <p className="mt-2 text-sm text-muted">
          Panel de marcador de posición — se reemplaza cuando se defina el dashboard final.
        </p>
      </div>
    </div>
  );
}
