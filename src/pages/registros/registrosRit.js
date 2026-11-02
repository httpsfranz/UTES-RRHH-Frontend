import { ArrowLeftRight, Award, BadgeCheck, Clock, FileStack, HandHeart, PhoneCall, ShieldAlert, Timer, UserRoundCheck } from 'lucide-react';
import { formatoFecha } from '../../utils/formato';

// Registros sencillos que exige el RIT: una tabla y un formulario (App\Support\RegistrosRit en el backend). Cada entrada
// describe su pantalla; tipos de campo: vinculo, trabajador, eess, fecha, numero, texto, area, opciones, si-no, documento.

const opciones = (pares) => pares.map(([value, label]) => ({ value, label }));

const TIPOS_LEGAJO = opciones([['DNI', 'DNI'], ['HOJA_DE_VIDA', 'Hoja de vida'], ['TITULO_PROFESIONAL', 'Título profesional'], ['COLEGIATURA', 'Colegiatura'], ['CONTRATO', 'Contrato'], ['RESOLUCION', 'Resolución'], ['CAPACITACION', 'Capacitación'], ['DECLARACION_JURADA', 'Declaración jurada'], ['CERTIFICADO_TRABAJO', 'Certificado de trabajo'], ['OTRO', 'Otro']]);

export const REGISTROS_RIT = {
  legajo: {
    endpoint: '/legajo-documentos', titulo: 'Legajo', singular: 'documento del legajo', icono: FileStack,
    ayuda: 'RRHH mantiene el legajo de cada servidor y este lo actualiza (RIT, Art. 11 y 14).',
    campos: [
      { name: 'TrabajadorId', api: 'trabajador_id', tipo: 'trabajador', label: 'Trabajador', requerido: true },
      { name: 'LegajoDocumentoTipo', api: 'tipo', tipo: 'opciones', label: 'Tipo', requerido: true, opciones: TIPOS_LEGAJO },
      { name: 'LegajoDocumentoNombre', api: 'nombre', tipo: 'texto', label: 'Nombre del documento', requerido: true },
      { name: 'LegajoDocumentoFecha', api: 'fecha', tipo: 'fecha', label: 'Fecha', requerido: true },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Archivo' },
      { name: 'LegajoDocumentoObservacion', api: 'observacion', tipo: 'area', label: 'Observación' },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['tipo', 'Tipo', (i) => TIPOS_LEGAJO.find((t) => t.value === i.tipo)?.label ?? i.tipo], ['nombre', 'Documento', (i) => i.nombre], ['fecha', 'Fecha', (i) => formatoFecha(i.fecha)]],
  },
  fotochecks: {
    endpoint: '/fotochecks', titulo: 'Fotochecks', singular: 'fotocheck', icono: BadgeCheck,
    ayuda: 'Uso obligatorio. La pérdida se denuncia en 24 horas y se devuelve al cese (RIT, Art. 13).',
    campos: [
      { name: 'TrabajadorId', api: 'trabajador_id', tipo: 'trabajador', label: 'Trabajador', requerido: true },
      { name: 'FotocheckNumero', api: 'numero', tipo: 'texto', label: 'Número', requerido: true },
      { name: 'FotocheckFechaEntrega', api: 'fecha_entrega', tipo: 'fecha', label: 'Fecha de entrega', requerido: true },
      { name: 'FotocheckEstado', api: 'estado', tipo: 'opciones', label: 'Estado', porDefecto: 'VIGENTE', opciones: opciones([['VIGENTE', 'Vigente'], ['PERDIDO', 'Perdido'], ['DEVUELTO', 'Devuelto']]) },
      { name: 'FotocheckFechaDenuncia', api: 'fecha_denuncia', tipo: 'fecha', label: 'Fecha de la denuncia' },
      { name: 'FotocheckFechaDevolucion', api: 'fecha_devolucion', tipo: 'fecha', label: 'Fecha de devolución' },
      { name: 'FotocheckEsDuplicado', api: 'es_duplicado', tipo: 'si-no', label: 'Es duplicado', porDefecto: false },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Denuncia policial' },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['numero', 'Número', (i) => i.numero], ['fecha_entrega', 'Entrega', (i) => formatoFecha(i.fecha_entrega)], ['estado', 'Estado', (i) => i.estado]],
  },
  entregas: {
    endpoint: '/entregas-cargo', titulo: 'Entrega de cargo', singular: 'entrega de cargo', icono: UserRoundCheck,
    ayuda: 'Obligatoria en vacaciones o licencias de 30 días o más, y al cese (RIT, Art. 56, 70 y 108).',
    campos: [
      { name: 'VinculoLaboralId', api: 'vinculo_laboral_id', tipo: 'vinculo', label: 'Quien entrega', requerido: true },
      { name: 'VinculoLaboralRecibeId', api: 'vinculo_laboral_recibe_id', tipo: 'vinculo', label: 'Quien recibe' },
      { name: 'EntregaCargoMotivo', api: 'motivo', tipo: 'opciones', label: 'Motivo', requerido: true, porDefecto: 'VACACIONES', opciones: opciones([['VACACIONES', 'Vacaciones'], ['LICENCIA', 'Licencia'], ['DESPLAZAMIENTO', 'Desplazamiento'], ['CESE', 'Cese']]) },
      { name: 'EntregaCargoFecha', api: 'fecha', tipo: 'fecha', label: 'Fecha', requerido: true },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Acta de entrega' },
      { name: 'EntregaCargoDetalle', api: 'detalle', tipo: 'area', label: 'Detalle' },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['motivo', 'Motivo', (i) => i.motivo], ['fecha', 'Fecha', (i) => formatoFecha(i.fecha)], ['recibe', 'Recibe', (i) => i.recibe ?? '—']],
  },
  desplazamientos: {
    endpoint: '/desplazamientos-temporales', titulo: 'Desplazamientos', singular: 'desplazamiento', icono: ArrowLeftRight,
    ayuda: 'Rotación, destaque, encargatura y otras acciones de desplazamiento (RIT, Art. 98 y 99).',
    campos: [
      { name: 'VinculoLaboralId', api: 'vinculo_laboral_id', tipo: 'vinculo', label: 'Trabajador', requerido: true },
      { name: 'EessDestinoId', api: 'eess_destino_id', tipo: 'eess', label: 'Establecimiento de destino', requerido: true },
      { name: 'DesplazamientoTemporalTipo', api: 'tipo', tipo: 'opciones', label: 'Tipo', requerido: true, porDefecto: 'ROTACION', opciones: opciones([['ROTACION', 'Rotación'], ['DESTAQUE', 'Destaque'], ['ENCARGATURA', 'Encargatura'], ['COMISION_DE_SERVICIOS', 'Comisión de servicios'], ['DESIGNACION_TEMPORAL', 'Designación temporal'], ['OTRO', 'Otro']]) },
      { name: 'DesplazamientoTemporalFechaInicio', api: 'fecha_inicio', tipo: 'fecha', label: 'Desde', requerido: true },
      { name: 'DesplazamientoTemporalFechaFin', api: 'fecha_fin', tipo: 'fecha', label: 'Hasta', requerido: true },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Documento' },
      { name: 'DesplazamientoTemporalMotivo', api: 'motivo', tipo: 'area', label: 'Motivo' },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['tipo', 'Tipo', (i) => i.tipo], ['destino', 'Destino', (i) => i.destino?.nombre], ['fecha_inicio', 'Desde', (i) => formatoFecha(i.fecha_inicio)], ['fecha_fin', 'Hasta', (i) => formatoFecha(i.fecha_fin)]],
  },
  avisos: {
    endpoint: '/avisos-ausencia', titulo: 'Avisos de ausencia', singular: 'aviso de ausencia', icono: PhoneCall,
    ayuda: 'El servidor avisa lo más pronto posible, dentro de la primera hora de la jornada (RIT, Art. 22 y 84.34; Anexo 009).',
    campos: [
      { name: 'VinculoLaboralId', api: 'vinculo_laboral_id', tipo: 'vinculo', label: 'Trabajador', requerido: true },
      { name: 'AvisoAusenciaFecha', api: 'fecha', tipo: 'fecha', label: 'Día de la ausencia', requerido: true },
      { name: 'AvisoAusenciaMedio', api: 'medio', tipo: 'opciones', label: 'Medio', requerido: true, porDefecto: 'TELEFONO', opciones: opciones([['PERSONAL', 'Personal'], ['TELEFONO', 'Teléfono'], ['MENSAJE', 'Mensaje'], ['ESCRITO', 'Escrito']]) },
      { name: 'AvisoAusenciaMotivo', api: 'motivo', tipo: 'area', label: 'Motivo', requerido: true },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['fecha', 'Día', (i) => formatoFecha(i.fecha)], ['medio', 'Medio', (i) => i.medio], ['plazo', 'Plazo', (i) => (i.dentro_de_plazo ? 'A tiempo' : 'Fuera de plazo')]],
  },
  ingresos: {
    endpoint: '/autorizaciones-ingreso', titulo: 'Ingreso autorizado', singular: 'autorización de ingreso', icono: Clock,
    ayuda: 'Ingreso fuera de horario o en día no laborable, con autorización previa (RIT, Art. 19 y Disp. Compl. 11ª).',
    campos: [
      { name: 'VinculoLaboralId', api: 'vinculo_laboral_id', tipo: 'vinculo', label: 'Trabajador', requerido: true },
      { name: 'AutorizacionIngresoFecha', api: 'fecha', tipo: 'fecha', label: 'Fecha', requerido: true },
      { name: 'AutorizacionIngresoMotivo', api: 'motivo', tipo: 'area', label: 'Motivo', requerido: true },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['fecha', 'Fecha', (i) => formatoFecha(i.fecha)], ['motivo', 'Motivo', (i) => i.motivo]],
  },
  facilidades: {
    endpoint: '/facilidades-horarias', titulo: 'Facilidad horaria', singular: 'facilidad horaria', icono: HandHeart,
    ayuda: 'Por tratamiento de tuberculosis: una hora al ingreso o a la salida, compensable (RIT, Art. 23 d).',
    campos: [
      { name: 'VinculoLaboralId', api: 'vinculo_laboral_id', tipo: 'vinculo', label: 'Trabajador', requerido: true },
      { name: 'FacilidadHorariaMomento', api: 'momento', tipo: 'opciones', label: 'Momento', requerido: true, porDefecto: 'INGRESO', opciones: opciones([['INGRESO', 'Ingreso una hora después'], ['SALIDA', 'Salida una hora antes']]) },
      { name: 'FacilidadHorariaFechaInicio', api: 'fecha_inicio', tipo: 'fecha', label: 'Desde', requerido: true },
      { name: 'FacilidadHorariaFechaFin', api: 'fecha_fin', tipo: 'fecha', label: 'Hasta', requerido: true },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Sustento médico', requerido: true },
      { name: 'FacilidadHorariaObservacion', api: 'observacion', tipo: 'area', label: 'Observación' },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['momento', 'Momento', (i) => i.momento], ['fecha_inicio', 'Desde', (i) => formatoFecha(i.fecha_inicio)], ['fecha_fin', 'Hasta', (i) => formatoFecha(i.fecha_fin)]],
  },
  tolerancias: {
    endpoint: '/tolerancias-extraordinarias', titulo: 'Tolerancia extraordinaria', singular: 'tolerancia extraordinaria', icono: Timer,
    ayuda: 'Hasta 2 horas por zona intransitable, paralización de transporte o desastre (RIT, Art. 16 y 27).',
    campos: [
      { name: 'EessId', api: 'eess_id', tipo: 'eess', label: 'Establecimiento', requerido: true },
      { name: 'ToleranciaExtraordinariaFechaInicio', api: 'fecha_inicio', tipo: 'fecha', label: 'Desde', requerido: true },
      { name: 'ToleranciaExtraordinariaFechaFin', api: 'fecha_fin', tipo: 'fecha', label: 'Hasta', requerido: true },
      { name: 'ToleranciaExtraordinariaMinutos', api: 'minutos', tipo: 'numero', label: 'Minutos (máximo 120)', requerido: true },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Sustento' },
      { name: 'ToleranciaExtraordinariaMotivo', api: 'motivo', tipo: 'area', label: 'Motivo', requerido: true },
    ],
    columnas: [['eess', 'Establecimiento', (i) => i.eess?.nombre], ['fecha_inicio', 'Desde', (i) => formatoFecha(i.fecha_inicio)], ['fecha_fin', 'Hasta', (i) => formatoFecha(i.fecha_fin)], ['minutos', 'Minutos', (i) => i.minutos]],
  },
  contingencias: {
    endpoint: '/contingencias-marcacion', titulo: 'Contingencia de marcación', singular: 'contingencia', icono: ShieldAlert,
    ayuda: 'Fuerza mayor: autoriza la marca manual en un establecimiento con reloj facial (RIT, Art. 16).',
    campos: [
      { name: 'EessId', api: 'eess_id', tipo: 'eess', label: 'Establecimiento', requerido: true },
      { name: 'ContingenciaMarcacionFechaInicio', api: 'fecha_inicio', tipo: 'fecha', label: 'Desde', requerido: true },
      { name: 'ContingenciaMarcacionFechaFin', api: 'fecha_fin', tipo: 'fecha', label: 'Hasta', requerido: true },
      { name: 'DocumentoSustentoId', api: 'documento_sustento_id', tipo: 'documento', label: 'Sustento' },
      { name: 'ContingenciaMarcacionMotivo', api: 'motivo', tipo: 'area', label: 'Motivo', requerido: true },
    ],
    columnas: [['eess', 'Establecimiento', (i) => i.eess?.nombre], ['fecha_inicio', 'Desde', (i) => formatoFecha(i.fecha_inicio)], ['fecha_fin', 'Hasta', (i) => formatoFecha(i.fecha_fin)], ['motivo', 'Motivo', (i) => i.motivo]],
  },
  reconocimientos: {
    endpoint: '/reconocimientos', titulo: 'Reconocimientos', singular: 'reconocimiento', icono: Award,
    ayuda: 'Hasta dos veces al año, por puntualidad y responsabilidad (RIT, Art. 96 y 97).',
    campos: [
      { name: 'VinculoLaboralId', api: 'vinculo_laboral_id', tipo: 'vinculo', label: 'Trabajador', requerido: true },
      { name: 'ReconocimientoServidorAnio', api: 'anio', tipo: 'numero', label: 'Año', requerido: true },
      { name: 'ReconocimientoServidorTipo', api: 'tipo', tipo: 'opciones', label: 'Tipo', requerido: true, porDefecto: 'FELICITACION', opciones: opciones([['AGRADECIMIENTO', 'Agradecimiento'], ['FELICITACION', 'Felicitación'], ['DIPLOMA', 'Diploma']]) },
      { name: 'ReconocimientoServidorFecha', api: 'fecha', tipo: 'fecha', label: 'Fecha', requerido: true },
      { name: 'ReconocimientoServidorResolucion', api: 'resolucion', tipo: 'texto', label: 'Resolución Directoral' },
      { name: 'ReconocimientoServidorMotivo', api: 'motivo', tipo: 'area', label: 'Motivo', requerido: true },
    ],
    columnas: [['trabajador', 'Trabajador', (i) => i.trabajador?.nombre_completo], ['tipo', 'Tipo', (i) => i.tipo], ['anio', 'Año', (i) => i.anio], ['motivo', 'Motivo', (i) => i.motivo]],
  },
};
