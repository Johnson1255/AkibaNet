// src/components/AdditionalServicesPage/BottomActions.tsx
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { BottomActionsProps } from "@/types/services";

export const BottomActions: React.FC<BottomActionsProps> = ({
  handleConfirmAndPay,
}) => {
  const { t } = useTranslation();
  return (
    <Button
      className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={handleConfirmAndPay}
    >
      {t("reservation.confirmAndPay")}
    </Button>
  );
};
