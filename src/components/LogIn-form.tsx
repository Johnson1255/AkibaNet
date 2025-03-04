import { Link, useNavigate, useLocation } from "react-router-dom"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { login as loginService } from "@/services/authService"

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
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
    } catch (error) {
      setError('No se pudo conectar al servidor. Verifica tu conexión a internet.');
      return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4">
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
              className="h-12 bg-gray-100 border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              className="h-12 bg-gray-100 border-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
  
            {error && <div className="text-red-500 text-sm">{error}</div>}
  
            <Button 
              type="submit" 
              className="w-full bg-black text-white hover:bg-black/90 rounded-full h-12"
              disabled={isLoading}
              onClick={() => !isLoading && checkServerConnection()}
            >
              {isLoading ? 'Iniciando sesión...' : 'Login'}
            </Button>
          </form>
  
          <div className="space-y-3">
            <Button variant="secondary" className="w-full bg-gray-100 hover:bg-gray-200 text-black rounded-full h-12">
              Login with Google
            </Button>
            <Button variant="secondary" className="w-full bg-gray-100 hover:bg-gray-200 text-black rounded-full h-12">
              Login with Instagram
            </Button>
          </div>
  
          <div className="text-center">
            <Link to="/signup" className="text-black hover:underline">
              Don't have an account yet? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
  
      <CardFooter className="text-gray-500 text-sm text-center">
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