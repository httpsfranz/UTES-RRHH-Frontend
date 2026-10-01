import { BadgeCheck, FileText, Hash, Hospital, Landmark, Layers, MapPin, Network, Phone } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import { CATEGORIAS_EESS } from '../../utils/opciones';

export default function EstablecimientoSaludForm({ form, setForm, errors }) {
  const { opciones: opcionesMicrored } = useOpciones('/microredes', { actual: form.MicroredId });
  const { opciones: opcionesTipo } = useOpciones('/tipos-establecimiento', { actual: form.TipoEstablecimientoId });

  return (
    <>
      <FormGrid>
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="EessCodigo"
          label="Código"
          icon={Hash}
          required
          maxLength={30}
          filter="codigo"
          placeholder="Ej. EESS-LE-01"
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="EessCodigoRenipres"
          label="Código RENIPRESS"
          icon={BadgeCheck}
          maxLength={8}
          filter="digitos"
          placeholder="8 dígitos, Ej. 00004711"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessNombre"
        label="Nombre"
        icon={Hospital}
        required
        maxLength={150}
      />
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="MicroredId"
          label="Microred"
          icon={Network}
          options={opcionesMicrored}
          required
        />
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="TipoEstablecimientoId"
          label="Tipo de establecimiento"
          icon={Landmark}
          options={opcionesTipo}
          required
        />
      </FormGrid>
      <FormGrid>
        <Select
          form={form}
          setForm={setForm}
          errors={errors}
          name="EessCategoria"
          label="Categoría"
          icon={Layers}
          options={[{ value: '', label: 'Sin categoría' }, ...CATEGORIAS_EESS]}
        />
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="EessUbigeo"
          label="Ubigeo"
          icon={MapPin}
          maxLength={6}
          filter="digitos"
          placeholder="6 dígitos, Ej. 130105"
        />
      </FormGrid>
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessTelefono"
        label="Teléfono"
        icon={Phone}
        maxLength={9}
        filter="digitos"
        inputMode="tel"
        placeholder="9 dígitos, Ej. 987654321"
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessDireccion"
        label="Dirección"
        icon={MapPin}
        maxLength={300}
      />
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="EessDescripcion"
        label="Descripción"
        icon={FileText}
        maxLength={300}
      />
    </>
  );
}
