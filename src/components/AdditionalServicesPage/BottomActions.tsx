// src/components/AdditionalServicesPage/BottomActions.tsx
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { BottomActionsProps } from "@/types/services";

export const BottomActions: React.FC<BottomActionsProps> = ({
  handleConfirmAndPay,
}) => {
  const { t } = useTranslation();
  return (
    <div className="px-4">
      <Button
        className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 my-4"
        onClick={handleConfirmAndPay}
      >
        {t("reservation.confirmAndPay")}
      </Button>
    </div>
  );
};
