import { CalendarDays, ShieldCheck } from 'lucide-react';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';

const CONSIENTE = [
  { value: '1', label: 'Sí consiente' },
  { value: '0', label: 'No consiente' },
];

/**
 * Formulario de la accion elegida sobre un trabajador:
 *   - autorizar: periodo en que puede marcar con registro manual (RIT, Art. 21: lo autoriza RRHH);
 *   - consentimiento: si consiente (o no) el tratamiento de su rostro (Ley 29733); queda como historial;
 *   - plantilla: alta de su plantilla facial (exige consentimiento; el vector lo carga el reloj facial).
 */
export default function GestionBiometricaForm({ modo, form, setForm, errors }) {
  if (modo === 'autorizar') {
    return (
      <>
        <FormGrid>
          <Field form={form} setForm={setForm} errors={errors} name="AutorizacionMetodoFechaInicio" label="Autorizado desde" icon={CalendarDays} type="date" required />
          <Field form={form} setForm={setForm} errors={errors} name="AutorizacionMetodoFechaFin" label="Hasta (vacío = sin fin)" icon={CalendarDays} type="date" />
        </FormGrid>
        <HelpText>El RIT (Art. 21) fija el reconocimiento facial como forma de marcar; el registro manual es una excepción que autoriza Recursos Humanos.</HelpText>
      </>
    );
  }
  if (modo === 'consentimiento') {
    return (
      <>
        <Select form={form} setForm={setForm} errors={errors} name="ConsentimientoBiometricoAceptado" label="¿Consiente el uso de su rostro para marcar asistencia?" icon={ShieldCheck} options={CONSIENTE} required />
        <HelpText>Se registra con la fecha de hoy. Si no consiente, su plantilla facial se desactiva y debe marcar con registro manual autorizado.</HelpText>
      </>
    );
  }
  return <HelpText>Se registra la plantilla facial del trabajador. El reloj facial completa el patrón biométrico al enrolarlo; el sistema nunca lo muestra.</HelpText>;
}
