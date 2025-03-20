import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const BottomActions: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="p-4 space-y-4">
            <Button 
                className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/home")}
            >
                {t('confirmation.backToHome')}
            </Button>
            <Button 
                variant="outline"
                className="w-full rounded-full h-12 border border-border"
                onClick={() => navigate("/account")}
            >
                {t('confirmation.viewReservations')}
            </Button>
        </div>
    );
};