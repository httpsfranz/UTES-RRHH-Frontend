import { Hash, Tag } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function TipoPeriodoProgramacionForm({
  form,
  setForm,
  errors,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Código */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoPeriodoProgramacionCodigo"
        label="Código"
        placeholder="Ejm: 01, PP01..."
        icon={Hash}
      />

      {/* Nombre */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoPeriodoProgramacionNombre"
        label="Nombre"
        placeholder="Ejm: Mensual"
        icon={Tag}
      />

      {/* Estado */}
      <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Estado activo
          </label>

          <span className="text-xs text-gray-500">
            {form.TipoPeriodoProgramacionEstado
              ? 'El tipo de periodo estará disponible'
              : 'El tipo de periodo estará inactivo'}
          </span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form.TipoPeriodoProgramacionEstado)}
            onChange={(e) =>
              setForm({
                ...form,
                TipoPeriodoProgramacionEstado: e.target.checked,
              })
            }
            className="sr-only peer"
          />

          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Error del estado */}
      {errors?.TipoPeriodoProgramacionEstado && (
        <p className="text-xs text-red-500 md:col-span-2">
          {errors.TipoPeriodoProgramacionEstado[0]}
        </p>
      )}

    </div>
  );
}