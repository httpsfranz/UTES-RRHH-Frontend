import { Calendar, Database, FileText, Hash, Table2, UserRound, Zap } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function AuditoriaForm({ form, setForm, errors }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">

        {/* ID de Auditoría */}
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="AuditoriaId"
          label="ID"
          icon={Hash}
        />

        {/* Esquema */}
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="AuditoriaEsquema"
          label="Esquema"
          icon={Database}
        />

        {/* Tabla */}
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="AuditoriaTabla"
          label="Tabla"
          icon={Table2}
        />

        {/* Operación */}
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="AuditoriaOperacion"
          label="Operación"
          icon={Zap}
        />

        {/* Usuario */}
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="UsuarioId"
          label="Usuario"
          icon={UserRound}
        />

        {/* Fecha y hora */}
        <Field
          form={form}
          setForm={setForm}
          errors={errors}
          name="AuditoriaFechaHora"
          label="Fecha y hora"
          icon={Calendar}
        />
      </div>

      {/* Detalle de auditoría */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="AuditoriaDetalle"
        label="Detalle"
        icon={FileText}
      />
    </>
  );
}
