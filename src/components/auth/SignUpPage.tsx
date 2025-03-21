import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeSwitcher } from '@/components/auth/ThemeSwitcher';
import { Footer } from '@/components/common/Footer';
import { useSignUpForm } from '@/hooks/useSignUpForm';

export default function SignUpPage() {
  const { formData, setFormData, error, isLoading, handleSubmit } = useSignUpForm();

  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 px-4">
      <div className="w-full flex justify-end p-4">
        <ThemeSwitcher />
      </div>
      
      <Card className="w-full max-w-sm border-0 shadow-none">
        <CardContent className="space-y-6 pt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Account</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Full Name"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
            <Input
              type="email"
              placeholder="Email Address"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isLoading}
            />
            <Input
              type="text"
              placeholder="Phone Number"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-transparent border border-input h-12 text-lg placeholder:text-muted-foreground"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              disabled={isLoading}
            />

            {error && (
              <div className={`text-sm ${error.includes("successful") ? "text-green-500" : "text-red-500"}`}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-primary hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Footer />
    </div>
  );
}
