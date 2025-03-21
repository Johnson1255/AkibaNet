import { Button } from "@/components/ui/button";

export const SocialLoginButtons = () => {
  return (
    <div className="space-y-3">
      <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12">
        Login with Google
      </Button>
      <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full h-12">
        Login with Instagram
      </Button>
    </div>
  );
};
