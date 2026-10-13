import { RouterProvider } from 'react-router-dom';
import BarraDeProgreso from './components/ui/BarraDeProgreso';
import AuthProvider from './auth/AuthProvider';
import { router } from './routes';

function App() {
  return (
    <AuthProvider>
      <BarraDeProgreso />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
