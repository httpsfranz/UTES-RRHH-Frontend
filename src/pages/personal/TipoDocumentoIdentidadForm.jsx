import { FileText, Hash, Tag, Ruler } from 'lucide-react';
import Field from '../../components/ui/Field';

export default function TipoDocumentoIdentidadForm({
  form,
  setForm,
  errors,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoDocumentoIdentidadCodigo"
        label="Código"
        placeholder="Ejm: 01, DNI..."
        icon={Hash}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoDocumentoIdentidadNombre"
        label="Nombre"
        placeholder="Ejm: Documento Nacional de Identidad"
        icon={Tag}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoDocumentoIdentidadAbreviatura"
        label="Abreviatura"
        placeholder="Ejm: DNI"
        icon={FileText}
      />

      <Field
        form={form}
        setForm={setForm}
        errors={errors}
        name="TipoDocumentoIdentidadLongitud"
        label="Longitud"
        placeholder="Ejm: 8"
        icon={Ruler}
        type="number"
        min={1}
      />

      {/* Control Switch sin el icono de la izquierda */}
      <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Estado activo
          </label>
          <span className="text-xs text-gray-500">
            {form.TipoDocumentoIdentidadEstado
              ? 'El tipo de documento estará disponible'
              : 'El tipo de documento estará inactivo'}
          </span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(form.TipoDocumentoIdentidadEstado)}
            onChange={(e) =>
              setForm({
                ...form,
                TipoDocumentoIdentidadEstado: e.target.checked,
              })
            }
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {errors?.TipoDocumentoIdentidadEstado && (
        <p className="text-xs text-red-500 md:col-span-2">
          {errors.TipoDocumentoIdentidadEstado[0]}
        </p>
      )}
    </div>
  );
}