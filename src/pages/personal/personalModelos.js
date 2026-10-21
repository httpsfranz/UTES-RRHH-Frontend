import { formModel } from '../../hooks/useCrudResource';
import {
  alfanumerico,
  correo,
  documentoIdentidad,
  edadLaboral,
  fecha,
  noAnteriorA,
  nombrePersona,
  requerido,
  requeridoSi,
  telefonoPeruano,
  unoDe,
  validador,
} from '../../utils/validaciones';
import { SEXOS, valoresDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';
import { OTRO, colegiaturasDelTrabajador, colegiaturasParaEnviar } from '../../utils/colegiaturas';

// Formularios de Personal (trabajador, vinculo laboral y horario). Los usan el listado de trabajadores, el asistente
// "Nuevo trabajador" y la ficha del trabajador.

// La Red identifica a su personal solo con DNI: el tipo de documento no se pregunta (el backend lo asume DNI).
const modeloTrabajador = formModel({
  TrabajadorNumeroDocumento: 'numero_documento',
  TrabajadorNombres: 'nombres',
  TrabajadorApellidoPaterno: 'apellido_paterno',
  TrabajadorApellidoMaterno: 'apellido_materno',
  TrabajadorSexo: 'sexo',
  TrabajadorFechaNacimiento: 'fecha_nacimiento',
  ProfesionId: 'profesion_id',
  ProfesionNueva: 'profesion_nueva',
  TrabajadorCorreo: 'correo',
  TrabajadorTelefono: 'telefono',
  TrabajadorDireccion: 'direccion',
});

const DNI = { codigo: 'DNI', longitud: 8 };

export const trabajador = {
  emptyForm: () => ({ ...modeloTrabajador.emptyForm, Colegiaturas: [] }),
  mapToForm: (item) => ({ ...modeloTrabajador.mapToForm(item), Colegiaturas: colegiaturasDelTrabajador(item) }),
  // "Otra" profesion y los colegios "Otro" viajan como texto: el backend los crea en la misma transaccion.
  antesDeEnviar: ({ Colegiaturas, ProfesionId, ProfesionNueva, ...resto }) => ({
    ...resto,
    ProfesionId: ProfesionId === OTRO ? null : ProfesionId || null,
    ...(ProfesionId === OTRO ? { ProfesionNueva } : {}),
    Colegiaturas: colegiaturasParaEnviar(Colegiaturas),
  }),
  validate: validador({
    TrabajadorNumeroDocumento: [requerido, documentoIdentidad(DNI)],
    TrabajadorNombres: [requerido, nombrePersona],
    TrabajadorApellidoPaterno: [requerido, nombrePersona],
    TrabajadorApellidoMaterno: [nombrePersona],
    TrabajadorSexo: [unoDe(valoresDe(SEXOS))],
    TrabajadorFechaNacimiento: [fecha, edadLaboral],
    TrabajadorCorreo: [correo],
    TrabajadorTelefono: [telefonoPeruano],
  }),
};

export const vinculo = {
  ...formModel({
    TrabajadorId: 'trabajador_id',
    EessId: 'eess_id',
    RegimenLaboralId: 'regimen_laboral_id',
    CondicionLaboralId: 'condicion_laboral_id',
    CargoId: 'cargo_id',
    VinculoLaboralCodigoAirhsp: 'codigo_airhsp',
    VinculoLaboralFechaInicio: 'fecha_inicio',
    VinculoLaboralFechaFin: 'fecha_fin',
    VinculoLaboralMotivoCese: 'motivo_cese',
  }),
  /** AIRHSP es obligatorio solo para las condiciones que lo exigen: la validacion necesita el catalogo de condiciones. */
  validador: (condiciones) => {
    const exigeAirhsp = (form) => Boolean(condiciones.find((fila) => String(fila.id) === String(form.CondicionLaboralId))?.requiere_airhsp);
    return validador({
      TrabajadorId: [requerido],
      EessId: [requerido],
      RegimenLaboralId: [requerido],
      CondicionLaboralId: [requerido],
      CargoId: [requerido],
      VinculoLaboralCodigoAirhsp: [requeridoSi(exigeAirhsp, 'Esta condición laboral exige el código AIRHSP.'), alfanumerico],
      VinculoLaboralFechaInicio: [requerido, fecha],
      VinculoLaboralFechaFin: [fecha, noAnteriorA('VinculoLaboralFechaInicio', 'La fecha de fin no puede ser anterior a la de inicio.')],
    });
  },
};

export const asignacion = {
  ...formModel({
    VinculoLaboralId: 'vinculo_laboral_id',
    HorarioId: 'horario_id',
    AsignacionHorarioFechaInicio: 'fecha_inicio',
    AsignacionHorarioFechaFin: 'fecha_fin',
    AsignacionHorarioObservacion: 'observacion',
  }),
  validate: validador({
    VinculoLaboralId: [requerido],
    HorarioId: [requerido],
    AsignacionHorarioFechaInicio: [requerido, fecha],
    AsignacionHorarioFechaFin: [fecha, noAnteriorA('AsignacionHorarioFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
  }),
};

export const vigencia = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'sin fin'}`;
