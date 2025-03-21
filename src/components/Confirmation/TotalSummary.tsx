import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { ConfirmedReservationDetails } from "@/types/reservation";

interface TotalSummaryProps {
  reservation: ConfirmedReservationDetails;
}

export const TotalSummary: React.FC<TotalSummaryProps> = ({ reservation }) => {
  const { t } = useTranslation();
  return (
    <>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold text-lg px-4">
        <span>{t("confirmation.total")}</span>
        <span>¥{reservation.totalPrice || reservation.basePrice}</span>
      </div>
    </>
  );
};
