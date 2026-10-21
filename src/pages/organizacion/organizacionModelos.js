import { formModel } from '../../hooks/useCrudResource';
import { digitosExactos, fecha, noAnteriorA, requerido, telefonoPeruano, ubigeo, unoDe, validador } from '../../utils/validaciones';
import { CATEGORIAS_EESS, valoresDe } from '../../utils/opciones';
import { formatoFecha } from '../../utils/formato';

// Formularios de Organizacion (microred, establecimiento y responsable): los usa la pantalla unica de Organizacion.

export const microred = {
  ...formModel({
    MicroredUbigeo: 'ubigeo',
    MicroredNombre: 'nombre',
    MicroredDistrito: 'distrito',
    MicroredTelefono: 'telefono',
    MicroredDireccion: 'direccion',
    MicroredDescripcion: 'descripcion',
  }),
  validate: validador({
    MicroredUbigeo: [ubigeo],
    MicroredNombre: [requerido],
    MicroredTelefono: [telefonoPeruano],
  }),
};

export const establecimiento = {
  ...formModel({
    EessCodigoRenipres: 'renipres',
    EessNombre: 'nombre',
    MicroredId: 'microred_id',
    TipoEstablecimientoId: 'tipo_establecimiento_id',
    EessCategoria: 'categoria',
    EessUbigeo: 'ubigeo',
    EessTelefono: 'telefono',
    EessDireccion: 'direccion',
    EessDescripcion: 'descripcion',
  }),
  validate: validador({
    EessCodigoRenipres: [digitosExactos(8, 'El código RENIPRESS')],
    EessNombre: [requerido],
    MicroredId: [requerido],
    TipoEstablecimientoId: [requerido],
    EessCategoria: [unoDe(valoresDe(CATEGORIAS_EESS))],
    EessUbigeo: [ubigeo],
    EessTelefono: [telefonoPeruano],
  }),
};

export const responsable = {
  ...formModel({
    EessId: 'eess_id',
    VinculoLaboralId: 'vinculo_laboral_id',
    TipoResponsabilidadId: 'tipo_responsabilidad_id',
    DocumentoSustentoId: 'documento_sustento_id',
    ResponsableEessFechaInicio: 'fecha_inicio',
    ResponsableEessFechaFin: 'fecha_fin',
    ResponsableEessDocumentoNumero: 'documento_numero',
    ResponsableEessObservacion: 'observacion',
  }),
  validate: validador({
    EessId: [requerido],
    VinculoLaboralId: [requerido],
    TipoResponsabilidadId: [requerido],
    ResponsableEessFechaInicio: [requerido, fecha],
    ResponsableEessFechaFin: [fecha, noAnteriorA('ResponsableEessFechaInicio', 'La fecha final no puede ser anterior a la inicial.')],
  }),
};

export const vigenciaDeDesignacion = (item) => `${formatoFecha(item.fecha_inicio)} – ${item.fecha_fin ? formatoFecha(item.fecha_fin) : 'vigente'}`;

/** ¿La designacion esta vigente hoy? */
export function designacionVigente(item, hoy) {
  return item.activo && item.fecha_inicio <= hoy && (!item.fecha_fin || item.fecha_fin >= hoy);
}
