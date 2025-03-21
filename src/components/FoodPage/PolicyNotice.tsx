import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";

interface PolicyNoticeProps {
  showButton: boolean;
}

export const PolicyNotice: React.FC<PolicyNoticeProps> = ({ showButton }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4">
      <div className="p-2 rounded-lg flex items-start bg-card text-card-foreground">
        <Info className="h-5 w-5 primary mr-2 mt-0.5" />
        {showButton ? t("food.policyNotice") : t("food.gotReservation")}
      </div>
    </div>
  );
};
