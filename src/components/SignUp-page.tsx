import { Link, useNavigate } from "react-router-dom";
import { Heart, Sun, Moon } from "lucide-react"; // Importar iconos
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { register } from "@/services/authService";
import { useTheme } from "@/context/ThemeContext"; // Importar useTheme

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Obtener tema y función para cambiar tema

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name) {
      setError("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordPattern.test(password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      setIsLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      setIsLoading(false);
      return;
    }

    try {
      await register({ name, email, password, phone });
      setError("Registration successful. Please log in manually.");
      
      // Esperar 3 segundos y redirigir a la página de login
      setTimeout(() => {
        navigate("/login", { state: { email } }); // Pasamos el email para prellenarlo en el form
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error creating account. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="email"
              placeholder="Email Address"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Phone Number"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

            {error && <div className={`text-sm ${error.includes("successful") ? "text-green-500" : "text-red-500"}`}>{error}</div>}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-primary hover:underline">
              Already have an account? Log in
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
