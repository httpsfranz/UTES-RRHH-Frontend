import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import LoginForm from '../components/auth/LoginForm';
import LoginLayout from '../components/auth/LoginLayout';
import LoadingState from '../components/ui/LoadingState';

export default function LoginPage() {
  const { autenticado, cargando, iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const destino = useLocation().state?.desde ?? '/';

  if (cargando) return <LoadingState message="Verificando sesión…" />;
  if (autenticado) return <Navigate to={destino} replace />;

  async function ingresar(usuario, password) {
    const error = await iniciarSesion(usuario, password);
    if (!error) navigate(destino, { replace: true });
    return error;
  }

  return (
    <LoginLayout>
      <LoginForm onSubmit={ingresar} />
    </LoginLayout>
  );
}
