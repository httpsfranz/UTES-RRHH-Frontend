import { useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../api/client';
import { mensajeDeError } from '../../api/paginado';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import Field from '../../components/ui/Field';
import FormGrid from '../../components/ui/FormGrid';
import HelpText from '../../components/ui/HelpText';
import ListaDeRegistros from '../../components/ui/ListaDeRegistros';
import Select from '../../components/ui/Select';

const SEMESTRES = [
  { value: '1', label: 'Enero a junio' },
  { value: '2', label: 'Julio a diciembre' },
];

/** Personal sin tardanzas ni faltas en el semestre: de aqui salen los reconocimientos (RIT, Art. 96 y 97). */
export default function CandidatosReconocimiento() {
  const [form, setForm] = useState({ anio: String(new Date().getFullYear()), semestre: '1' });
  const [candidatos, setCandidatos] = useState(null);
  const [error, setError] = useState('');

  async function buscar() {
    setError('');
    try {
      const { data } = await api.get('/reconocimientos/candidatos', { params: form });
      setCandidatos(data.data);
    } catch (err) {
      setError(mensajeDeError(err) ?? 'No se pudo consultar a los candidatos.');
    }
  }

  return (
    <div className="space-y-3">
      <Alert>{error}</Alert>
      <FormGrid>
        <Field form={form} setForm={setForm} name="anio" label="Año" type="number" />
        <Select form={form} setForm={setForm} name="semestre" label="Semestre" options={SEMESTRES} />
      </FormGrid>
      <Button variant="secondary" icon={Search} onClick={buscar}>
        Ver candidatos por puntualidad
      </Button>
      {candidatos && (
        <ListaDeRegistros
          titulo={`Candidatos (${candidatos.length})`}
          vacio="Nadie cumple sin tardanzas ni faltas en ese semestre."
          filas={candidatos.slice(0, 30).map((c) => ({ id: c.vinculo_id, titulo: c.nombre, detalle: `${c.eess} · ${c.dias} días registrados` }))}
        />
      )}
      {candidatos?.length > 30 && <HelpText>Se muestran los primeros 30 de {candidatos.length}.</HelpText>}
    </div>
  );
}
