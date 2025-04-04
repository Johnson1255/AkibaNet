import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "@/hooks/useLoginForm";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { Footer } from "../common/Footer";
import { checkServerConnection } from "@/utils/serverUtils";
import { ThemeSwitcher } from "./ThemeSwitcher";

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError, // Añadir setError
    success,
    isLoading,
    handleLogin,
  } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Importante: prevenir el comportamiento por defecto

    try {
      const isConnected = await checkServerConnection();
      if (!isConnected) {
        setError(
          "No se pudo conectar al servidor. Verifica tu conexión a internet."
        );
        return;
      }

      await handleLogin(e);
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4">
      <div className="w-full flex justify-end p-4">
        <ThemeSwitcher />
      </div>

      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="space-y-6 pt-8">
          <div className="flex justify-center">
            <img
              src="/icon.png"
              alt="Logo"
              className="h-20 w-20 rounded-xl shadow-lg"
            />
          </div>

          {success && (
            <div className="text-green-500 text-sm text-center">{success}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
            >
              {isLoading ? "Iniciando sesión..." : "Login"}
            </Button>
          </form>

          <SocialLoginButtons />

          <div className="text-center">
            <Link to="/signup" className="text-primary hover:underline">
              Don't have an account yet? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}
