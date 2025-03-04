import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, validateToken, checkServerStatus } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  serverAvailable: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  setAuthLoading: (loading: boolean) => void;
  checkServer: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverAvailable, setServerAvailable] = useState(true);

  // Verificar estado del servidor
  const checkServer = async (): Promise<boolean> => {
    const status = await checkServerStatus();
    setServerAvailable(status);
    return status;
  };

  // Verificar si hay token almacenado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      // Primero verificar si el servidor está disponible
      const isServerUp = await checkServer();
      
      if (!isServerUp) {
        console.warn("Servidor no disponible, usando datos locales si existen");
        // Si el servidor no está disponible, intentar usar datos guardados localmente
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedToken && storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setToken(storedToken);
          } catch (error) {
            console.error("Error al parsear los datos de usuario almacenados:", error);
            // Si hay error al parsear, limpiar datos
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
        
        setIsLoading(false);
        return;
      }
      
      // Si el servidor está disponible, validar el token
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const result = await validateToken(storedToken);
          
          if (result.valid && result.user) {
            setUser(result.user);
            setToken(storedToken);
            // Actualizar datos locales con info fresca del servidor
            localStorage.setItem('user', JSON.stringify(result.user));
          } else {
            // Token inválido, limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error validando el token:', error);
          // No borrar datos locales si hay error de conexión
          if (serverAvailable) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          } else {
            // Usar datos locales si no hay conexión
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
              } catch (e) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
              }
            }
          }
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const setAuthLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    serverAvailable,
    login,
    logout,
    setAuthLoading,
    checkServer
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
