// src/components/FoodPage/PolicyNotice.tsx
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

interface PolicyNoticeProps {
  showButton: boolean;
}

export const PolicyNotice: React.FC<PolicyNoticeProps> = ({ showButton }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="p-4 bg-yellow-200 text-yellow-800 text-center">
        {showButton ? t("food.policyNotice") : t("food.gotReservation")}
      </div>
      <Separator className="my-4" />
    </>
  );
};