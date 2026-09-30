// Pagina generica: por ahora cada item del menu sin modulo propio usa esta misma pantalla, con su
// propio titulo. Cuando construyas un modulo de verdad, creas su archivo en src/pages y lo
// conectas en src/routes.jsx en lugar de PlaceholderPage.
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
