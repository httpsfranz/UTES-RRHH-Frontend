import { useState } from 'react';
import { CalendarClock, CalendarDays, CalendarRange, IdCard, UserPlus } from 'lucide-react';
import { api } from '../../api/client';
import { invalidarOpciones } from '../../api/cacheDeOpciones';
import { mensajeDeError } from '../../api/paginado';
import { useAlcanceDeEess } from '../../hooks/useAlcanceDeEess';
import { useOpciones } from '../../hooks/useOpciones';
import { hoyLocal } from '../../utils/marcacion';
import { asignacion, trabajador, vigencia, vinculo } from './personalModelos';
import Modal from '../../components/Modal';
import Form from '../../components/ui/Form';
import Button from '../../components/ui/Button';
import AccionesDeModal from '../../components/ui/AccionesDeModal';
import HelpText from '../../components/ui/HelpText';
import Segmentado from '../../components/ui/Segmentado';
import DatosDeRegistro from '../../components/ui/DatosDeRegistro';
import AvisoExito from '../../components/ui/AvisoExito';
import IndicadorDePasos from '../../components/ui/IndicadorDePasos';
import TrabajadorForm from './TrabajadorForm';
import VinculoLaboralForm from './VinculoLaboralForm';
import AsignacionHorarioForm from './AsignacionHorarioForm';

const PASOS = ['Datos personales', 'Vínculo laboral', 'Horario (opcional)'];
const MODOS = [
  { value: 'fijo', label: 'Horario fijo', icon: CalendarDays },
  { value: 'rotativo', label: 'Turnos rotativos', icon: CalendarRange },
  { value: 'despues', label: 'Definir después', icon: CalendarClock },
];

/**
 * Alta de un trabajador en un solo recorrido: datos personales -> vinculo laboral (establecimiento, cargo, condicion)
 * -> horario. El horario es opcional: lo revisa y aprueba el jefe del establecimiento (RIT, Art. 16), que muchas veces no
 * es quien registra el alta; sin horario el trabajador queda como pendiente ("Falta horario" en Trabajadores y en "Por
 * hacer" del inicio) y no se le exigen dias. Cada paso se guarda al continuar, con las validaciones de siempre; si se deja a medias, lo que falta se
 * completa despues desde la ficha del trabajador. Quien trabaja por turnos rotativos no lleva horario fijo: se programa
 * cada mes en la grilla de programacion.
 *
 * Se monta solo mientras esta abierto (cada apertura empieza en blanco).
 */
export default function NuevoTrabajadorAsistente({ onClose, onCreado, onVerFicha, onProgramar }) {
  const { eessFijo } = useAlcanceDeEess();
  const condiciones = useOpciones('/condiciones-laborales');
  const [paso, setPaso] = useState(0);
  const [formT, setFormT] = useState(trabajador.emptyForm);
  const [formV, setFormV] = useState(null);
  const [formA, setFormA] = useState(null);
  const [modo, setModo] = useState('fijo');
  const [creados, setCreados] = useState({ trabajador: null, vinculo: null, asignacion: null });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  async function guardar(endpoint, datos, validar) {
    const locales = validar(datos);
    if (Object.keys(locales).length) {
      setErrores(locales);
      return null;
    }
    setErrores({});
    setGuardando(true);
    try {
      const { data } = await api.post(endpoint, datos);
      invalidarOpciones(endpoint);
      return data.data ?? data;
    } catch (err) {
      setErrores(err.response?.status === 422 ? (err.response.data.errors ?? { general: [err.response.data.message] }) : { general: [mensajeDeError(err) ?? 'No se pudo guardar.'] });
      return null;
    } finally {
      setGuardando(false);
    }
  }

  async function continuar(event) {
    event.preventDefault();
    if (paso === 0) {
      const t = await guardar('/trabajadores', trabajador.antesDeEnviar(formT), () => trabajador.validate(formT));
      if (!t) return;
      setCreados((c) => ({ ...c, trabajador: t }));
      setFormV({ ...vinculo.emptyForm, TrabajadorId: t.id, EessId: eessFijo ?? '', VinculoLaboralFechaInicio: hoyLocal() });
      onCreado?.();
      setPaso(1);
    } else if (paso === 1) {
      const v = await guardar('/vinculos-laborales', formV, vinculo.validador(condiciones.filas));
      if (!v) return;
      setCreados((c) => ({ ...c, vinculo: v }));
      setFormA({ ...asignacion.emptyForm, VinculoLaboralId: v.id, AsignacionHorarioFechaInicio: v.fecha_inicio });
      onCreado?.();
      setPaso(2);
    } else if (paso === 2) {
      if (modo === 'fijo') {
        const a = await guardar('/asignaciones-horario', formA, asignacion.validate);
        if (!a) return;
        setCreados((c) => ({ ...c, asignacion: a }));
      }
      onCreado?.();
      setPaso(3);
    }
  }

  const nombre = creados.trabajador?.nombre_completo;

  return (
    <Modal open onClose={onClose} title={paso < 3 ? 'Nuevo trabajador' : 'Trabajador registrado'} size="lg">
      <IndicadorDePasos pasos={PASOS} actual={paso} />
      {paso < 3 ? (
        <Form onSubmit={continuar} generalError={errores.general?.[0]}>
          {paso === 0 && <TrabajadorForm form={formT} setForm={setFormT} errors={errores} editando={false} />}
          {paso === 1 && (
            <>
              <HelpText>Dónde y en qué trabaja {nombre}: establecimiento, cargo, régimen y condición laboral.</HelpText>
              <VinculoLaboralForm form={formV} setForm={setFormV} errors={errores} sinTrabajador />
            </>
          )}
          {paso === 2 && (
            <>
              <Segmentado opciones={MODOS} value={modo} onChange={setModo} etiqueta="Cómo trabaja" />
              {modo === 'fijo' ? (
                <AsignacionHorarioForm form={formA} setForm={setFormA} errors={errores} sinVinculo />
              ) : modo === 'despues' ? (
                <HelpText>
                  El horario lo revisa y aprueba el jefe del establecimiento (RIT, Art. 16). {nombre} queda registrado con su vínculo y aparecerá como
                  «Falta horario» en Trabajadores y en «Por hacer» del inicio hasta que se le asigne un horario fijo o se le programe el mes. Mientras
                  tanto no se le cuentan faltas.
                </HelpText>
              ) : (
                <HelpText>
                  Quien trabaja por turnos rotativos (mañana, tarde, guardias) no lleva horario fijo: sus turnos se asignan cada mes en Programación del
                  mes.
                </HelpText>
              )}
            </>
          )}
          <AccionesDeModal>
            {!(paso === 2 && modo === 'despues') && (
              <Button variant="secondary" onClick={paso === 0 ? onClose : () => setPaso(3)}>
                {paso === 0 ? 'Cancelar' : 'Completar después'}
              </Button>
            )}
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando…' : paso === 2 ? 'Terminar' : 'Guardar y continuar'}
            </Button>
          </AccionesDeModal>
        </Form>
      ) : (
        <>
          <AvisoExito>{nombre} quedó registrado.</AvisoExito>
          <div className="mt-4">
            <DatosDeRegistro
              items={[
                { label: 'DNI', value: creados.trabajador?.numero_documento },
                { label: 'Vínculo', value: creados.vinculo ? `${creados.vinculo.cargo?.nombre ?? ''} · ${creados.vinculo.eess?.nombre ?? ''} · ${vigencia(creados.vinculo)}` : 'Pendiente: agrégalo desde su ficha' },
                {
                  label: 'Horario',
                  value: creados.asignacion
                    ? (creados.asignacion.horario?.nombre ?? 'Asignado')
                    : creados.vinculo && modo === 'rotativo'
                      ? 'Turnos rotativos: se programan cada mes'
                      : creados.vinculo
                        ? 'Pendiente: lo define el jefe del establecimiento (queda en «Por hacer»)'
                        : 'Pendiente: asígnalo desde su ficha',
                },
              ]}
            />
          </div>
          <AccionesDeModal>
            <Button variant="secondary" icon={UserPlus} onClick={() => onClose('otro')}>
              Registrar otro
            </Button>
            {creados.vinculo && !creados.asignacion && (
              <Button variant="secondary" icon={CalendarRange} onClick={onProgramar}>
                Programar su mes
              </Button>
            )}
            <Button icon={IdCard} onClick={() => onVerFicha(creados.trabajador)}>
              Ver su ficha
            </Button>
          </AccionesDeModal>
        </>
      )}
    </Modal>
  );
}
