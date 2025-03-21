import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { login as loginService } from '@/services/authService';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setSuccess("Registro exitoso. Por favor, inicia sesión con tu contraseña.");
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevenir múltiples submissions

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Por favor, ingresa tu correo electrónico y contraseña.');
      }

      const response = await loginService({ email, password });
      
      if (!response || !response.token) {
        throw new Error('Respuesta inválida del servidor');
      }

      login(response.token, response.user);
      navigate('/home');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error de conexión. Por favor, intenta más tarde.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError, // Exportar setError
    success,
    isLoading,
    handleLogin
  };
};
