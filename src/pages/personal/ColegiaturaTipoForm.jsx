import { useEffect, useState } from 'react';
import { Building, FileText, GraduationCap, Hash, IdCard } from 'lucide-react';
import { api } from '../../api/client';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';

export default function ColegiaturaTipoForm({ form, setForm, errors }) {
  const [profesiones, setProfesiones] = useState([]);

  useEffect(() => {
    api
      .get('/profesiones', { params: { por_pagina: 100 } })
      .then(({ data }) => setProfesiones(data.data ?? []))
      .catch(() => setProfesiones([]));
  }, []);

  const opciones = [
    { value: '', label: 'Sin profesión asociada' },
    ...profesiones.map((p) => ({ value: p.id, label: p.nombre })),
  ];

  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaTipoCodigo" label="Código" icon={Hash} placeholder="Ej. CMP" />
        <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaTipoNombre" label="Nombre" icon={IdCard} />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="ProfesionId" label="Profesión" icon={GraduationCap} options={opciones} />
      <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaTipoEntidad" label="Entidad" icon={Building} placeholder="Ej. Colegio Médico del Perú" />
      <Field form={form} setForm={setForm} errors={errors} name="ColegiaturaTipoDescripcion" label="Descripción" icon={FileText} />
    </>
  );
}
