import { Hash, Tag, UserRoundCheck } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function TipoCambioTurnoForm({
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
        name="TipoCambioTurnoCodigo"
        label="Código"
        placeholder="Ejm: 01, CT01..."
        icon={Hash}
      />

      {/* Nombre */}
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoCambioTurnoNombre"
        label="Nombre"
        placeholder="Ejm: Permuta de turno"
        icon={Tag}
      />

      {/* Requiere reemplazante */}
      <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center gap-3">
          <UserRoundCheck className="w-5 h-5 text-gray-500" />

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Requiere reemplazante
            </label>

            <span className="text-xs text-gray-500">
              {form.TipoCambioTurnoRequiereReemplazante
                ? 'Este tipo de cambio requiere un reemplazante'
                : 'Este tipo de cambio no requiere reemplazante'}
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form.TipoCambioTurnoRequiereReemplazante)}
            onChange={(e) =>
              setForm({
                ...form,
                TipoCambioTurnoRequiereReemplazante: e.target.checked,
              })
            }
            className="sr-only peer"
          />

          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {errors?.TipoCambioTurnoRequiereReemplazante && (
        <p className="text-xs text-red-500 md:col-span-2">
          {errors.TipoCambioTurnoRequiereReemplazante[0]}
        </p>
      )}

      {/* Estado */}
      <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Estado activo
          </label>

          <span className="text-xs text-gray-500">
            {form.TipoCambioTurnoEstado
              ? 'El tipo de cambio estará disponible'
              : 'El tipo de cambio estará inactivo'}
          </span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form.TipoCambioTurnoEstado)}
            onChange={(e) =>
              setForm({
                ...form,
                TipoCambioTurnoEstado: e.target.checked,
              })
            }
            className="sr-only peer"
          />

          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {errors?.TipoCambioTurnoEstado && (
        <p className="text-xs text-red-500 md:col-span-2">
          {errors.TipoCambioTurnoEstado[0]}
        </p>
      )}

    </div>
  );
}