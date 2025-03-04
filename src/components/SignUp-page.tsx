import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { register, login as loginService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !email || !password) {
      setError("Por favor, completa todos los campos obligatorios.");
      setIsLoading(false);
      return;
    }

    try {
      // Registrar al usuario
      const userData = await register({ name, email, password, phone });
      
      try {
        // Intentar iniciar sesión automáticamente
        const loginResponse = await loginService({ email, password });
        
        // Si el login es exitoso, guardar datos de sesión
        login(loginResponse.token, loginResponse.user);
        navigate("/home");
      } catch (loginError) {
        // Si falla el login automático, redirigir al login manual
        console.error("Error en login automático:", loginError);
        setError("Registro exitoso. Por favor inicia sesión manualmente.");
        
        // Esperar 2 segundos y redirigir a la página de login
        setTimeout(() => {
          navigate("/login", { state: { email } }); // Pasamos el email para prellenarlo en el form
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error al crear la cuenta. Por favor intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="space-y-6 pt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              className="h-12 bg-gray-100 border-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="email"
              placeholder="Email Address"
              className="h-12 bg-gray-100 border-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Phone Number (optional)"
              className="h-12 bg-gray-100 border-0"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

            {error && <div className={`text-sm ${error.includes("exitoso") ? "text-green-500" : "text-red-500"}`}>{error}</div>}

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90 rounded-full h-12"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-black hover:underline">
              Already have an account? Log in
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
