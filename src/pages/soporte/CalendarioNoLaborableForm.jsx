import { useEffect, useState } from 'react';
import { CalendarDays, FileText, MapPin, Scale, Tag } from 'lucide-react';
import { api } from '../../api/client';
import Field from '../../components/ui/Field';
import Select from '../../components/ui/Select';
import FormGrid from '../../components/ui/FormGrid';
import Checkbox from '../../components/ui/Checkbox';

const TIPOS = [
  { value: 'FERIADO', label: 'Feriado' },
  { value: 'DIA_NO_LABORABLE', label: 'Día no laborable' },
  { value: 'ASUETO', label: 'Asueto' },
  { value: 'DUELO', label: 'Duelo' },
];

export default function CalendarioNoLaborableForm({ form, setForm, errors }) {
  const [microredes, setMicroredes] = useState([]);

  useEffect(() => {
    api
      .get('/microredes', { params: { por_pagina: 100 } })
      .then(({ data }) => setMicroredes(data.data ?? []))
      .catch(() => setMicroredes([]));
  }, []);

  const opcionesMicrored = [
    { value: '', label: 'Todas las microredes' },
    ...microredes.map((m) => ({ value: m.id, label: m.nombre })),
  ];

  return (
    <>
      <FormGrid>
        <Field form={form} setForm={setForm} errors={errors} name="CalendarioNoLaborableFecha" label="Fecha" icon={CalendarDays} type="date" />
        <Select form={form} setForm={setForm} errors={errors} name="CalendarioNoLaborableTipo" label="Tipo" icon={Tag} options={TIPOS} />
      </FormGrid>
      <Select form={form} setForm={setForm} errors={errors} name="MicroredId" label="Microred" icon={MapPin} options={opcionesMicrored} />
      <Field form={form} setForm={setForm} errors={errors} name="CalendarioNoLaborableDescripcion" label="Descripción" icon={FileText} />
      <Field form={form} setForm={setForm} errors={errors} name="CalendarioNoLaborableNormaSustento" label="Norma de sustento" icon={Scale} />
      <Checkbox form={form} setForm={setForm} errors={errors} name="CalendarioNoLaborableCompensable" label="Compensable" />
    </>
  );
}
