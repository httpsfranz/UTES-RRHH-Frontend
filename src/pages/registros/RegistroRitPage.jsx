import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { requerido, validador } from '../../utils/validaciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import HelpText from '../../components/ui/HelpText';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import CamposDeRegistro from './CamposDeRegistro';
import CandidatosReconocimiento from './CandidatosReconocimiento';
import { REGISTROS_RIT } from './registrosRit';

function configurar(registro) {
  const modelo = formModel(Object.fromEntries(registro.campos.map((c) => [c.name, c.porDefecto === undefined ? c.api : [c.api, c.porDefecto]])));
  return {
    ...modelo,
    validate: validador(Object.fromEntries(registro.campos.filter((c) => c.requerido).map((c) => [c.name, [requerido]]))),
    columns: registro.columnas.map(([key, header, valor]) => ({ key, header, render: (item) => valor(item) ?? '—' })),
    card: (item) => ({ icon: registro.icono, title: registro.columnas[0][2](item) ?? registro.titulo, meta: registro.columnas.slice(1).map(([, , valor]) => valor(item)) }),
  };
}

/** Pantalla de un registro sencillo del RIT: lista y formulario, descritos en registrosRit.js. */
export default function RegistroRitPage({ id }) {
  const registro = REGISTROS_RIT[id];
  const { emptyForm, mapToForm, validate, columns, card } = useMemo(() => configurar(registro), [registro]);
  const crud = useCrudResource({
    endpoint: registro.endpoint,
    emptyForm,
    mapToForm,
    validate,
    buildConfirmMessage: () => `¿Anular este registro de ${registro.singular}?`,
    deactivateErrorMessage: 'No se pudo anular el registro.',
  });

  return (
    <PageContainer>
      <PageHeader title={registro.titulo} subtitle={registro.ayuda}>
        {crud.abrirCrear && (
          <Button onClick={crud.abrirCrear} icon={Plus}>
            Registrar
          </Button>
        )}
      </PageHeader>
      <Alert>{crud.error}</Alert>
      {id === 'reconocimientos' && <CandidatosReconocimiento />}
      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando…"
        emptyIcon={registro.icono}
        emptyMessage={`Aún no hay registros de ${registro.titulo.toLowerCase()}.`}
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.desactivar}
      />
      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? `Editar ${registro.singular}` : `Registrar ${registro.singular}`}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <CamposDeRegistro campos={registro.campos} form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
        <HelpText>{registro.ayuda}</HelpText>
      </FormModal>
    </PageContainer>
  );
}
