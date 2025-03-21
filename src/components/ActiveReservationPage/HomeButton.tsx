import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const HomeButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <Button
      className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={() => navigate("/home")}
    >
      {t("activeReservation.backToHome")}
    </Button>
  );
};