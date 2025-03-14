import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, Sun, Moon } from "lucide-react"; // Importar iconos
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { login as loginService } from "@/services/authService";
import { useTheme } from "@/context/ThemeContext"; // Importar useTheme

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { theme, toggleTheme } = useTheme(); // Obtener tema y función para cambiar tema
  
  // Verificar si venimos del registro con un email predefinido
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setSuccess("Registro exitoso. Por favor, inicia sesión con tu contraseña.");
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.')
      setIsLoading(false)
      return
    }

    try {
      const response = await loginService({ email, password })
      
      // Guarda el token y la información del usuario
      login(response.token, response.user)
      
      // Redirige al usuario a la página principal
      navigate('/home')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Error de conexión. Por favor, intenta más tarde.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar errores de conexión
  const checkServerConnection = async () => {
    try {
      // Intenta hacer un ping al servidor
      const response = await fetch('http://localhost:3000/health', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        setError('El servidor no está respondiendo correctamente. Por favor, intenta más tarde.');
        return false;
      }
      return true;
    } catch {
      setError('No se pudo conectar al servidor. Verifica tu conexión a internet.');
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4">
      <div className="w-full flex justify-end p-4">
        <Button onClick={toggleTheme} className="bg-transparent hover:bg-transparent">
          {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </Button>
      </div>
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="space-y-6 pt-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
          </div>
  
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}
  
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Email / Telephone"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
  
            {error && <div className="text-red-500 text-sm">{error}</div>}
  
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12"
              disabled={isLoading}
              onClick={() => !isLoading && checkServerConnection()}
            >
              {isLoading ? 'Iniciando sesión...' : 'Login'}
            </Button>
          </form>
  
          <div className="space-y-3">
            <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12">
              Login with Google
            </Button>
            <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12">
              Login with Instagram
            </Button>
          </div>
  
          <div className="text-center">
            <Link to="/signup" className="text-primary hover:underline">
              Don't have an account yet? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
  
      <CardFooter className="text-muted-foreground text-sm text-center">
        <div className="space-y-1">
          <p>© 2023 Papus Developers INC. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Designed with <Heart className="w-4 h-4 fill-current" /> in Japan.
          </p>
        </div>
      </CardFooter>
    </div>
  );
}