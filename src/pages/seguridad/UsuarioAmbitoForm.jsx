import { Hospital, Network, UserRound } from 'lucide-react';
import { useOpciones } from '../../hooks/useOpciones';
import Select from '../../components/ui/Select';
import HelpText from '../../components/ui/HelpText';

export default function UsuarioAmbitoForm({ form, setForm, errors }) {
  const { opciones: usuarios } = useOpciones('/usuarios', { actual: form.UsuarioId, etiqueta: (usuario) => `${usuario.nombre}${usuario.trabajador ? ` — ${usuario.trabajador.nombre_completo}` : ''}` });
  const { opciones: microredes } = useOpciones('/microredes', { actual: form.MicroredId, sinOpcion: 'Ninguna' });
  const { opciones: establecimientos } = useOpciones('/establecimientos', { actual: form.EessId, sinOpcion: 'Ninguno' });

  return (
    <>
      <Select form={form} setForm={setForm} errors={errors} name="UsuarioId" label="Usuario" icon={UserRound} options={usuarios} required />
      <Select
        form={form}
        setForm={(actualizar) =>
          setForm((f) => {
            const siguiente = typeof actualizar === 'function' ? actualizar(f) : actualizar;
            // Microred y establecimiento se excluyen: al elegir una, la otra se vacia.
            return siguiente.MicroredId && siguiente.MicroredId !== f.MicroredId ? { ...siguiente, EessId: '' } : siguiente;
          })
        }
        errors={errors}
        name="MicroredId"
        label="Microred (ve todos sus establecimientos)"
        icon={Network}
        options={microredes}
      />
      <Select
        form={form}
        setForm={(actualizar) =>
          setForm((f) => {
            const siguiente = typeof actualizar === 'function' ? actualizar(f) : actualizar;
            return siguiente.EessId && siguiente.EessId !== f.EessId ? { ...siguiente, MicroredId: '' } : siguiente;
          })
        }
        errors={errors}
        name="EessId"
        label="Establecimiento (ve solo ese)"
        icon={Hospital}
        options={establecimientos}
      />
      <HelpText>Si no eliges microred ni establecimiento, el usuario ve toda la Red (perfil de sede).</HelpText>
    </>
  );
}
