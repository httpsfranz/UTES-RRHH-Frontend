import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileSpreadsheet, IdCard, Plus, UserRound } from 'lucide-react';
import { useCrudResource } from '../../hooks/useCrudResource';
import { trabajador } from './personalModelos';
import PageContainer from '../../components/ui/PageContainer';
import ImportarTrabajadoresModal from './ImportarTrabajadoresModal';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import SearchInput from '../../components/ui/SearchInput';
import FiltroDeChips from '../../components/ui/FiltroDeChips';
import Alert from '../../components/ui/Alert';
import EntityList from '../../components/ui/EntityList';
import FormModal from '../../components/ui/FormModal';
import TrabajadorForm from './TrabajadorForm';
import NuevoTrabajadorAsistente from './NuevoTrabajadorAsistente';
import FichaTrabajadorModal from './FichaTrabajadorModal';

// Lo que falta completar del alta: el vinculo (lo registra RRHH) o el horario (lo define el jefe del EESS, RIT Art. 16).
const sinVinculo = (item) => item.activo && !item.vinculos?.length;
const sinHorario = (item) => item.vinculos?.some((v) => v.sin_horario);
const avisoDe = (item) => (sinVinculo(item) ? 'Falta vínculo laboral' : sinHorario(item) ? 'Falta horario' : null);
const FILTROS = { horario: sinHorario, vinculo: sinVinculo };

const colegiaturasDe = (item) => item.colegiaturas?.map((c) => `${c.tipo_codigo} ${c.numero}`).join(' · ') || '—';

const columns = [
  { key: 'documento', header: 'DNI', render: (item) => item.numero_documento },
  { key: 'nombre_completo', header: 'Trabajador' },
  { key: 'eess', header: 'Establecimiento', render: (item) => item.vinculos?.map((v) => v.eess).filter(Boolean).join(' · ') || 'Sin vínculo vigente' },
  { key: 'cargo', header: 'Cargo', render: (item) => item.vinculos?.map((v) => v.cargo).filter(Boolean).join(' · ') || '—' },
  { key: 'condicion', header: 'Condición', render: (item) => item.vinculos?.map((v) => v.condicion).filter(Boolean).join(' · ') || '—' },
  { key: 'profesion', header: 'Profesión', render: (item) => item.profesion?.nombre ?? '—' },
  { key: 'colegiatura', header: 'Colegiatura', render: colegiaturasDe },
  { key: 'pendiente', header: 'Pendiente', render: (item) => avisoDe(item) ?? '—' },
  { key: 'telefono', header: 'Teléfono' },
];

const card = (item) => ({
  initial: item.nombres?.[0],
  title: item.nombre_completo,
  meta: [
    item.vinculos?.map((v) => [v.cargo, v.eess].filter(Boolean).join(' · ')).join(' / ') || 'Sin vínculo vigente',
    item.profesion?.nombre,
    item.colegiaturas?.length ? colegiaturasDe(item) : null,
  ],
  footer: `DNI ${item.numero_documento}`,
  aviso: avisoDe(item),
});

/**
 * Personal: el listado de trabajadores. "Nuevo trabajador" abre el asistente de alta (datos -> vinculo -> horario) y
 * cada trabajador tiene su ficha, con sus vinculos, horarios y cuenta: ya no hay pantallas sueltas de vinculos ni de
 * asignacion de horario.
 */
export default function TrabajadorPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pendiente = FILTROS[searchParams.get('pendiente')] ? searchParams.get('pendiente') : 'todos';
  const [importando, setImportando] = useState(false);
  const [asistente, setAsistente] = useState(0); // 0 = cerrado; cambia en cada apertura para empezar en blanco
  const [fichaId, setFichaId] = useState(null);
  const crud = useCrudResource({
    endpoint: '/trabajadores',
    emptyForm: trabajador.emptyForm,
    mapToForm: trabajador.mapToForm,
    validate: trabajador.validate,
    antesDeEnviar: trabajador.antesDeEnviar,
    estadoKey: 'TrabajadorEstado',
    buildConfirmMessage: (item) => `¿Desactivar a "${item.nombre_completo}"?`,
  });
  const ficha = crud.items.find((t) => t.id === fichaId) ?? null;
  const visibles = useMemo(() => (pendiente === 'todos' ? crud.items : crud.items.filter(FILTROS[pendiente])), [crud.items, pendiente]);
  const chips = [
    { clave: 'todos', etiqueta: 'Todos', cantidad: crud.items.length },
    { clave: 'horario', etiqueta: 'Falta horario', cantidad: crud.items.filter(sinHorario).length },
    { clave: 'vinculo', etiqueta: 'Falta vínculo', cantidad: crud.items.filter(sinVinculo).length },
  ];

  function filtrar(clave) {
    setSearchParams(clave === 'todos' ? {} : { pendiente: clave }, { replace: true });
  }

  function cerrarAsistente(siguiente) {
    setAsistente(siguiente === 'otro' ? asistente + 1 : 0);
  }

  return (
    <PageContainer>
      <PageHeader title="Trabajadores" subtitle="El personal de la Red. Abre la ficha de un trabajador para ver o cambiar su vínculo, su horario y su cuenta.">
        {crud.puedeEditar && (
          <Button variant="secondary" onClick={() => setImportando(true)} icon={FileSpreadsheet}>
            Importar desde Excel
          </Button>
        )}
        {crud.abrirCrear && (
          <Button onClick={() => setAsistente(1)} icon={Plus}>
            Nuevo trabajador
          </Button>
        )}
      </PageHeader>

      <SearchInput value={crud.buscar} onChange={crud.setBuscar} onSubmit={() => crud.cargar()} placeholder="Buscar por nombre, documento o correo…" />
      <FiltroDeChips opciones={chips} valor={pendiente} onChange={filtrar} etiqueta="Pendientes del alta" />

      <Alert>{crud.error}</Alert>

      <EntityList
        items={visibles}
        total={pendiente === 'todos' ? crud.total : visibles.length}
        loading={crud.loading}
        loadingMessage="Cargando trabajadores…"
        emptyIcon={UserRound}
        emptyMessage={pendiente === 'todos' ? 'No hay trabajadores registrados todavía.' : 'Nadie tiene este pendiente: todo el personal está completo.'}
        columns={columns}
        card={card}
        acciones={[{ icon: IdCard, label: 'Ver ficha', onClick: (item) => setFichaId(item.id) }]}
        onEdit={crud.abrirEditar}
        onToggle={crud.alternarEstado}
      />

      {ficha && <FichaTrabajadorModal trabajador={ficha} onClose={() => setFichaId(null)} onEditar={crud.abrirEditar} onCambio={() => crud.cargar()} />}

      {asistente > 0 && (
        <NuevoTrabajadorAsistente
          key={asistente}
          onClose={cerrarAsistente}
          onCreado={() => crud.cargar()}
          onVerFicha={(t) => {
            setAsistente(0);
            setFichaId(t.id);
          }}
          onProgramar={() => navigate('/programacion/mensual')}
        />
      )}

      <FormModal
        open={crud.modalOpen}
        onClose={crud.cerrarModal}
        title={crud.editando ? 'Editar trabajador' : 'Nuevo trabajador'}
        onSubmit={crud.guardar}
        error={crud.erroresForm.general?.[0]}
        submitting={crud.guardando}
      >
        <TrabajadorForm form={crud.form} setForm={crud.setForm} errors={crud.erroresForm} editando={Boolean(crud.editando)} />
      </FormModal>
      <ImportarTrabajadoresModal open={importando} onClose={() => setImportando(false)} onImportado={() => crud.cargar()} />
    </PageContainer>
  );
}
