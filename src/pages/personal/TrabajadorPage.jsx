import { Plus, UserRound } from 'lucide-react';
import { formModel, useCrudResource } from '../../hooks/useCrudResource';
import { useOpciones } from '../../hooks/useOpciones';
import {
  correo,
  documentoIdentidad,
  edadLaboral,
  fecha,
  nombrePersona,
  requerido,
  telefonoPeruano,
  unoDe,
  validador,
} from '../../utils/validaciones';
import { SEXOS, valoresDe } from '../../utils/opciones';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TrabajadorForm from './TrabajadorForm';

const { emptyForm, mapToForm } = formModel({
  TipoDocumentoIdentidadId: 'tipo_documento_id',
  TrabajadorNumeroDocumento: 'numero_documento',
  TrabajadorNombres: 'nombres',
  TrabajadorApellidoPaterno: 'apellido_paterno',
  TrabajadorApellidoMaterno: 'apellido_materno',
  TrabajadorSexo: 'sexo',
  TrabajadorFechaNacimiento: 'fecha_nacimiento',
  ProfesionId: 'profesion_id',
  TrabajadorCorreo: 'correo',
  TrabajadorTelefono: 'telefono',
  TrabajadorDireccion: 'direccion',
});

const documentoDe = (item) => (item.tipo_documento ? `${item.tipo_documento.abreviatura ?? item.tipo_documento.codigo} ${item.numero_documento}` : item.numero_documento);

const columns = [
  { key: 'documento', header: 'Documento', render: documentoDe },
  { key: 'nombre_completo', header: 'Trabajador' },
  { key: 'profesion', header: 'Profesión', render: (item) => item.profesion?.nombre ?? '—' },
  { key: 'telefono', header: 'Teléfono' },
  { key: 'correo', header: 'Correo' },
];

const card = (item) => ({
  initial: item.nombres?.[0],
  title: item.nombre_completo,
  meta: [item.profesion?.nombre, item.telefono && `Tel. ${item.telefono}`, item.correo],
  footer: documentoDe(item),
});

export default function TrabajadorPage() {
  // El formato del numero depende del tipo elegido, asi que la validacion de usuario necesita el catalogo.
  const tipos = useOpciones('/tipos-documento-identidad');
  const tipoDe = (form) => {
    const tipo = tipos.filas.find((fila) => String(fila.id) === String(form.TipoDocumentoIdentidadId));
    return tipo && { codigo: tipo.codigo, longitud: tipo.longitud };
  };

  const validate = (form) =>
    validador({
      TipoDocumentoIdentidadId: [requerido],
      TrabajadorNumeroDocumento: [requerido, documentoIdentidad(tipoDe(form))],
      TrabajadorNombres: [requerido, nombrePersona],
      TrabajadorApellidoPaterno: [requerido, nombrePersona],
      TrabajadorApellidoMaterno: [nombrePersona],
      TrabajadorSexo: [unoDe(valoresDe(SEXOS))],
      TrabajadorFechaNacimiento: [fecha, edadLaboral],
      TrabajadorCorreo: [correo],
      TrabajadorTelefono: [telefonoPeruano],
    })(form);

  const crud = useCrudResource({
    endpoint: '/trabajadores',
    emptyForm,
    mapToForm,
    validate,
    estadoKey: 'TrabajadorEstado',
    buildConfirmMessage: (item) => `¿Desactivar a "${item.nombre_completo}"?`,
  });

  return (
    <PageContainer>
      <PageHeader title="Trabajadores" subtitle="Personal · Trabajador">
        <Button onClick={crud.abrirCrear} icon={Plus}>
          Nuevo trabajador
        </Button>
      </PageHeader>

      <SearchInput
        value={crud.buscar}
        onChange={crud.setBuscar}
        onSubmit={() => crud.cargar()}
        placeholder="Buscar por nombre, documento o correo…"
      />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={crud.items}
        total={crud.total}
        loading={crud.loading}
        loadingMessage="Cargando trabajadores…"
        emptyIcon={UserRound}
        emptyMessage="No hay trabajadores registrados todavía."
        columns={columns}
        card={card}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar trabajador' : 'Nuevo trabajador'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TrabajadorForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} />
      </FormModal>
    </PageContainer>
  );
}
