import { useState } from 'react';
import { Briefcase, CalendarClock, KeyRound, Pencil, Plus, UserRound } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import { useCrudResource } from '../../hooks/useCrudResource';
import { useConsulta } from '../../hooks/useConsulta';
import { useOpciones } from '../../hooks/useOpciones';
import { formatoFecha, formatoFechaHora } from '../../utils/formato';
import { hoyLocal } from '../../utils/marcacion';
import { asignacion, vigencia, vinculo } from './personalModelos';
import Modal from '../../components/Modal';
import Button from '../../components/ui/Button';
import Segmentado from '../../components/ui/Segmentado';
import DatosDeRegistro from '../../components/ui/DatosDeRegistro';
import ListaDeRegistros from '../../components/ui/ListaDeRegistros';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import Alert from '../../components/ui/Alert';
import HelpText from '../../components/ui/HelpText';
import FormModal from '../../components/ui/FormModal';
import VinculoLaboralForm from './VinculoLaboralForm';
import AsignacionHorarioForm from './AsignacionHorarioForm';

const PESTANAS = [
  { value: 'datos', label: 'Datos', icon: UserRound },
  { value: 'vinculos', label: 'Vínculo laboral', icon: Briefcase },
  { value: 'horario', label: 'Horario', icon: CalendarClock },
  { value: 'cuenta', label: 'Cuenta', icon: KeyRound },
];

/**
 * Ficha del trabajador: todo lo suyo en un solo lugar, por pestanas. Datos personales (se editan con el formulario de
 * siempre), sus vinculos laborales y sus horarios (se agregan, editan o dan de baja aqui mismo) y su cuenta de acceso.
 *
 *   trabajador  registro del listado (null = cerrada)
 *   onEditar    abre el formulario de datos personales del listado
 *   onCambio    algo cambio: el listado se recarga
 */
export default function FichaTrabajadorModal({ trabajador, onClose, onEditar, onCambio }) {
  const auth = useAuth();
  const [pestana, setPestana] = useState('datos');
  // La cuenta de acceso solo la ve quien administra la seguridad.
  const veCuenta = auth.tiene('SEGURIDAD_VER');
  const condiciones = useOpciones('/condiciones-laborales');
  const filtro = { trabajador_id: trabajador.id };
  const vinculos = useCrudResource({
    endpoint: '/vinculos-laborales',
    params: filtro,
    emptyForm: { ...vinculo.emptyForm, TrabajadorId: trabajador.id },
    mapToForm: vinculo.mapToForm,
    validate: (form) => vinculo.validador(condiciones.filas)(form),
    estadoKey: 'VinculoLaboralEstado',
    onCambio,
    buildConfirmMessage: (item) => `¿Desactivar el vínculo de ${item.cargo?.nombre ?? ''} en ${item.eess?.nombre ?? ''}?`,
  });
  const horarios = useCrudResource({
    endpoint: '/asignaciones-horario',
    params: filtro,
    emptyForm: asignacion.emptyForm,
    mapToForm: asignacion.mapToForm,
    validate: asignacion.validate,
    estadoKey: 'AsignacionHorarioEstado',
    onCambio,
    buildConfirmMessage: (item) => `¿Desactivar la asignación del horario "${item.horario?.nombre ?? ''}"?`,
  });
  const cuenta = useConsulta('/usuarios', filtro, { activo: veCuenta });
  const usuario = cuenta.datos?.data?.[0] ?? null;
  const vigentes = vinculos.items.filter((v) => v.vigente);

  function nuevoHorario() {
    horarios.abrirCrear();
    const v = vigentes[0] ?? vinculos.items[0];
    horarios.setForm((f) => ({ ...f, VinculoLaboralId: v?.id ?? '', AsignacionHorarioFechaInicio: hoyLocal() }));
  }

  return (
    <>
      <Modal open onClose={onClose} title={trabajador.nombre_completo} size="lg">
        <div className="space-y-4">
          <Segmentado opciones={veCuenta ? PESTANAS : PESTANAS.filter((p) => p.value !== 'cuenta')} value={pestana} onChange={setPestana} etiqueta="Secciones de la ficha" />
          <Alert>{vinculos.error || horarios.error}</Alert>

          {pestana === 'datos' && (
            <DatosDeRegistro
              items={[
                { label: 'DNI', value: trabajador.numero_documento },
                { label: 'Sexo', value: { M: 'Masculino', F: 'Femenino' }[trabajador.sexo] ?? trabajador.sexo },
                { label: 'Nacimiento', value: trabajador.fecha_nacimiento && formatoFecha(trabajador.fecha_nacimiento) },
                { label: 'Profesión', value: trabajador.profesion?.nombre },
                { label: 'Colegiatura', value: trabajador.colegiaturas?.map((c) => `${c.tipo_codigo} ${c.numero}`).join(' · ') },
                { label: 'Correo', value: trabajador.correo },
                { label: 'Teléfono', value: trabajador.telefono },
                { label: 'Dirección', value: trabajador.direccion },
                { label: 'Trabaja en', value: vigentes.map((v) => `${v.cargo?.nombre} · ${v.eess?.nombre}`).join(' / ') || 'Sin vínculo vigente' },
              ]}
            />
          )}

          {pestana === 'vinculos' && (
            <ListaDeRegistros
              titulo="Vínculos laborales"
              vacio="Aún no tiene vínculo laboral: sin él no aparece en la asistencia ni en la programación."
              accion={
                vinculos.abrirCrear && (
                  <Button variant="secondary" icon={Plus} onClick={vinculos.abrirCrear}>
                    Agregar vínculo
                  </Button>
                )
              }
              filas={vinculos.items.map((v) => ({
                id: v.id,
                titulo: `${v.cargo?.nombre ?? 'Vínculo'} · ${v.eess?.nombre ?? ''}`,
                detalle: [v.condicion?.nombre, vigencia(v), v.vigente ? 'vigente' : 'no vigente', v.motivo_cese && `cese: ${v.motivo_cese}`].filter(Boolean).join(' · '),
                activo: v.activo,
                onEdit: vinculos.abrirEditar ? () => vinculos.abrirEditar(v) : undefined,
                onToggle: vinculos.alternarEstado ? () => vinculos.alternarEstado(v) : undefined,
              }))}
            />
          )}

          {pestana === 'horario' && (
            <>
              {trabajador.vinculos?.some((v) => v.sin_horario) && (
                <Alert variant="aviso">
                  Aún no tiene horario fijo ni programación: no se le exigen días ni se le cuentan faltas. Asígnale un horario aquí o prográmalo en
                  Programación del mes (lo aprueba el jefe del establecimiento, RIT Art. 16).
                </Alert>
              )}
              <ListaDeRegistros
                titulo="Horarios asignados"
                vacio="Sin horario fijo: si trabaja por turnos rotativos, sus turnos se asignan en Programación del mes."
                accion={
                  horarios.abrirCrear &&
                  vinculos.items.length > 0 && (
                    <Button variant="secondary" icon={Plus} onClick={nuevoHorario}>
                      Asignar horario
                    </Button>
                  )
                }
                filas={horarios.items.map((h) => ({
                  id: h.id,
                  titulo: h.horario?.nombre ?? 'Horario',
                  detalle: [vigencia(h), h.observacion].filter(Boolean).join(' · '),
                  activo: h.activo,
                  onEdit: horarios.abrirEditar ? () => horarios.abrirEditar(h) : undefined,
                  onToggle: horarios.alternarEstado ? () => horarios.alternarEstado(h) : undefined,
                }))}
              />
              <HelpText>Un vínculo tiene un solo horario vigente. Para cambiarlo, pon fecha de fin al actual y asigna el nuevo.</HelpText>
            </>
          )}

          {pestana === 'cuenta' &&
            (usuario ? (
              <DatosDeRegistro
                items={[
                  { label: 'Usuario', value: usuario.nombre },
                  { label: 'Roles', value: (usuario.roles ?? []).map((r) => r.nombre).join(' · ') || 'Sin rol' },
                  { label: 'Alcance', value: (usuario.ambitos ?? []).map((a) => a.nombre).join(' · ') || '—' },
                  { label: 'Cuenta', value: { ACTIVO: 'Activa', INACTIVO: 'Desactivada', BLOQUEADO: 'Bloqueada' }[usuario.estado_cuenta] ?? usuario.estado_cuenta },
                  { label: 'Último acceso', value: usuario.ultimo_acceso ? formatoFechaHora(usuario.ultimo_acceso) : 'Nunca' },
                ]}
              />
            ) : (
              <HelpText>No tiene cuenta para ingresar al sistema. Las cuentas se crean en Seguridad (solo quien registra o aprueba necesita una).</HelpText>
            ))}

          <AccionesDeModal>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
            {onEditar && (
              <Button icon={Pencil} onClick={() => onEditar(trabajador)}>
                Editar datos personales
              </Button>
            )}
          </AccionesDeModal>
        </div>
      </Modal>

      <FormModal
        open={vinculos.modalOpen}
        onClose={vinculos.cerrarModal}
        title={vinculos.editando ? 'Editar vínculo laboral' : 'Nuevo vínculo laboral'}
        onSubmit={vinculos.guardar}
        error={vinculos.erroresForm.general?.[0]}
        submitting={vinculos.guardando}
      >
        <VinculoLaboralForm form={vinculos.form} setForm={vinculos.setForm} errors={vinculos.erroresForm} sinTrabajador />
      </FormModal>

      <FormModal
        open={horarios.modalOpen}
        onClose={horarios.cerrarModal}
        title={horarios.editando ? 'Editar asignación de horario' : 'Asignar horario'}
        onSubmit={horarios.guardar}
        error={horarios.erroresForm.general?.[0]}
        submitting={horarios.guardando}
      >
        <AsignacionHorarioForm form={horarios.form} setForm={horarios.setForm} errors={horarios.erroresForm} sinVinculo={vigentes.length === 1 && !horarios.editando} />
      </FormModal>
    </>
  );
}
