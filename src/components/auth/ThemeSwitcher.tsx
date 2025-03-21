import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="bg-secondary hover:bg-secondary/90 rounded-full p-2"
    >
      {theme === "light" ? (
        <Moon className="w-6 h-6 text-secondary-foreground" />
      ) : (
        <Sun className="w-6 h-6 text-secondary-foreground" />
      )}
    </Button>
  );
};
