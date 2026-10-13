import { createContext } from 'react';

// Estado de la sesion que comparte toda la aplicacion (ver AuthProvider y useAuth).
export const AuthContext = createContext(null);
