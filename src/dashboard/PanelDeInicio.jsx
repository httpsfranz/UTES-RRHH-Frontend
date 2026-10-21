import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import Alert from '../components/ui/Alert';
import LoadingState from '../components/ui/LoadingState';
import PageContainer from '../components/ui/PageContainer';
import PageHeader from '../components/ui/PageHeader';
import FiltrosDeInicio from './FiltrosDeInicio';
import { useDashboard } from './useDashboard';
import Widget from './widgets/Widget';

const ANCHOS = { 1: 'lg:col-span-1', 2: 'lg:col-span-2' };

const filtrosIniciales = () => {
  const hoy = new Date();
  return { perfil: '', anio: String(hoy.getFullYear()), mes: String(hoy.getMonth() + 1), microred_id: '', eess_id: '', agrupar: '' };
};

// Quita los filtros vacios para no mandarlos a la API.
const aParametros = (filtros) => Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== ''));

/**
 * Panel de inicio: el backend decide que widgets ve cada rol y aqui
 * solo se dibujan en una cuadricula. Los indicadores ocupan todo el ancho; el resto, una o dos columnas segun su `ancho`.
 */
export default function PanelDeInicio() {
  const { usuario } = useAuth();
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const { datos, error, cargando } = useDashboard(aParametros(filtros));
  const cambiar = (cambios) => setFiltros((previos) => ({ ...previos, ...cambios }));

  return (
    <PageContainer>
      <PageHeader title="Inicio" subtitle={datos ? `${datos.perfiles.find((p) => p.clave === datos.perfil)?.nombre} · ${usuario?.nombre ?? ''}` : 'Sistema de Control de Asistencia — Red de Salud Trujillo'} />
      <Alert>{error}</Alert>
      {!datos && !error && <LoadingState message="Preparando tu panel…" />}

      {datos && (
        <div className={`space-y-4 transition-opacity duration-200 ${cargando ? 'opacity-60' : ''}`}>
          <FiltrosDeInicio datos={datos} filtros={filtros} cambiar={cambiar} />
          {datos.widgets
            .filter((widget) => widget.tipo === 'tareas' || widget.tipo === 'kpis')
            .map((widget) => (
              <Widget key={widget.id} widget={widget} />
            ))}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {datos.widgets
              .filter((widget) => widget.tipo !== 'tareas' && widget.tipo !== 'kpis')
              .map((widget) => (
                <div key={widget.id} className={`min-w-0 ${ANCHOS[widget.ancho] ?? ANCHOS[1]}`}>
                  <Widget widget={widget} alAgrupar={(agrupar) => cambiar({ agrupar })} />
                </div>
              ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
