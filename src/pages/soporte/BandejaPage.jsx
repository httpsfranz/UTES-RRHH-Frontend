import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, MailCheck } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../auth/useAuth';
import { useConsulta } from '../../hooks/useConsulta';
import { formatoFechaHora } from '../../utils/formato';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';

const columns = [
  { key: 'fecha', header: 'Fecha', render: (item) => formatoFechaHora(item.fecha) },
  { key: 'titulo', header: 'Aviso' },
  { key: 'mensaje', header: 'Mensaje' },
  { key: 'leida', header: 'Leída', render: (item) => (item.leida ? 'Sí' : 'No') },
];

const card = (item) => ({
  icon: Bell,
  title: item.titulo,
  meta: [item.mensaje, formatoFechaHora(item.fecha)],
  footer: item.leida ? 'Leída' : 'Sin leer',
});

// Mi bandeja: los avisos que el sistema me envio (aprobaciones, observaciones, alertas...). Se marcan como leidos y el
// enlace lleva a la pantalla del asunto.
export default function BandejaPage() {
  const { usuario } = useAuth();
  const navegar = useNavigate();
  const consulta = useConsulta('/notificaciones', { usuario_id: usuario.id, por_pagina: 100 });
  const filas = consulta.datos?.data ?? [];

  async function leer(item) {
    await api.post(`/notificaciones/${item.id}/leer`).catch(() => null);
    consulta.recargar();
  }

  async function leerTodas() {
    await api.post('/notificaciones/leer-todas').catch(() => null);
    consulta.recargar();
  }

  return (
    <PageContainer>
      <PageHeader title="Mi bandeja" subtitle="Soporte · Mi bandeja">
        <Button variant="secondary" icon={CheckCheck} onClick={leerTodas}>
          Marcar todas como leídas
        </Button>
      </PageHeader>
      <Alert>{consulta.error}</Alert>
      <EntityList
        items={filas}
        total={filas.length}
        loading={consulta.cargando}
        loadingMessage="Cargando tus avisos…"
        emptyIcon={Bell}
        emptyMessage="No tienes avisos."
        columns={columns}
        card={card}
        isActive={() => undefined}
        acciones={[
          { icon: MailCheck, label: 'Marcar como leída', visible: (item) => !item.leida, onClick: leer },
          { icon: ExternalLink, label: 'Ir al asunto', visible: (item) => Boolean(item.enlace), onClick: (item) => leer(item).then(() => navegar(item.enlace)) },
        ]}
      />
    </PageContainer>
  );
}
