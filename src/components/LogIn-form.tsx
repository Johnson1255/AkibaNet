import { Link, useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Aquí puedes agregar la lógica de autenticación si es necesario
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4">
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="space-y-6 pt-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
          </div>

          <div className="space-y-4">
            <Input type="text" placeholder="Email / Telephone" className="h-12 bg-gray-100 border-0" />
            <Input type="password" placeholder="Password" className="h-12 bg-gray-100 border-0" />
          </div>

          <Button className="w-full bg-black text-white hover:bg-black/90 rounded-full h-12" onClick={handleLogin}>Login</Button>

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
  )
}