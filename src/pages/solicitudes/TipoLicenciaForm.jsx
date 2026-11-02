import { FileText, Hash, Scale, Tag } from 'lucide-react';
import Select from '../../components/ui/Select';
import Field from '../../components/ui/Field';
import Checkbox from '../../components/ui/Checkbox';
import FormGrid from '../../components/ui/FormGrid';

export default function TipoLicenciaForm({ form, setForm, errors }) {
  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaNombre"
          label="Nombre"
          icon={Tag}
          required
          maxLength={150}
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoLicenciaDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaMaximoDias"
          label="Máximo de días"
          icon={Hash}
          maxLength={4}
          filter="digitos"
          placeholder="Vacío = sin límite"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoLicenciaBaseLegal"
          label="Base legal"
          icon={Scale}
          maxLength={200}
        />
      </FormGrid>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaMaximoDiasCas" label="Máximo de días (CAS)" type="number" />
        <Field form={form} setForm={setForm} errors={errors} name="TipoLicenciaMaximoDiasAnio" label="Máximo de días al año" type="number" />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="TipoLicenciaSexo" label="Solo para" options={[{ value: '', label: 'Cualquier persona' }, { value: 'F', label: 'Mujeres' }, { value: 'M', label: 'Hombres' }]} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoLicenciaConGoce" label="Con goce de haber" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoLicenciaACuentaVacaciones" label="Se descuenta de las vacaciones" />
      <Checkbox form={form} setForm={setForm} errors={errors} name="TipoLicenciaExigeAnticipacion" label="Exige anticipación" />
    </>
  );
}
