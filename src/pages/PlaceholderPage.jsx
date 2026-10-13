// Pagina generica de los items del menu que no tienen modulo propio: muestra su titulo.
import PageContainer from '../components/ui/PageContainer';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

export default function PlaceholderPage({ title }) {
  return (
    <PageContainer>
      <PageHeader title={title} subtitle="Módulo pendiente" />
      <EmptyState message={`Esta pantalla todavía no tiene contenido. Aquí irá el listado / formulario de ${title.toLowerCase()}.`} />
    </PageContainer>
  );
}
