import { Heart } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

export const Footer = () => {
  return (
    <CardFooter className="text-muted-foreground text-sm text-center">
      <div className="space-y-1">
        <p>© 2023 Papus Developers INC. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1">
          Designed with <Heart className="w-4 h-4 fill-current" /> in Japan.
        </p>
      </div>
    </CardFooter>
  );
};
