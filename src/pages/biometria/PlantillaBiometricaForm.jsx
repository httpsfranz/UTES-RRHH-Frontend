import { Fingerprint, Hand, ScanFace, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import { etiquetaTrabajador } from '../../utils/formato';
import { DEDOS, TIPOS_PLANTILLA } from '../../utils/opciones';
import Select from '../../components/ui/Select';
import SelectBuscable from '../../components/ui/SelectBuscable';
import HelpText from '../../components/ui/HelpText';

export default function PlantillaBiometricaForm({ form, setForm, errors }) {
  const { opciones: trabajadores } = useOpciones('/trabajadores', { actual: form.TrabajadorId, etiqueta: etiquetaTrabajador });
  const esHuella = form.PlantillaBiometricaTipo === 'HUELLA';

  return (
    <>
      <SelectBuscable
        form={form}
        setForm={setForm}
        errors={errors}
        name="TrabajadorId"
        label="Trabajador"
        icon={UserRound}
        options={trabajadores}
        required
      />
      <Select
        form={form}
        setForm={(actualizar) =>
          setForm((f) => {
            const siguiente = typeof actualizar === 'function' ? actualizar(f) : actualizar;
            // Solo la huella lleva dedo: al pasar a rostro se limpia.
            return siguiente.PlantillaBiometricaTipo === 'HUELLA' ? siguiente : { ...siguiente, PlantillaBiometricaDedo: '' };
          })
        }
        errors={errors}
        name="PlantillaBiometricaTipo"
        label="Tipo de plantilla"
        icon={form.PlantillaBiometricaTipo === 'HUELLA' ? Fingerprint : ScanFace}
        options={TIPOS_PLANTILLA}
        required
      />
      {esHuella && (
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="PlantillaBiometricaDedo"
          label="Dedo"
          icon={Hand}
          options={DEDOS}
          required
        />
      )}
      <HelpText>
        Aquí solo se registran los datos de la plantilla. La referencia biométrica la captura el equipo de enrolamiento y nunca se
        muestra. Requiere un consentimiento vigente del trabajador; la huella exige además una autorización de método vigente (el RIT
        fija el reconocimiento facial como forma de marcación, Art. 21).
      </HelpText>
    </>
  );
}
