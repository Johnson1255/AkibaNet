import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  
  return (
    <div className="px-6 py-4">
      <Button 
        variant="default" 
        className="w-full bg-black text-white rounded-xl h-12"
        onClick={onLogout}
      >
        {t('buttons.logout')} <LogOut className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};