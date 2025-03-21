import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import ReservationCountdown from "@/components/ActiveReservationPage/ReservationCountdown";
import { DetailedReservation } from "@/types/reservation";

interface ReservationInfoCardProps {
  reservation: DetailedReservation;
  onAction: () => void;
  actionButtonText: string;
}

export const ReservationInfoCard: React.FC<ReservationInfoCardProps> = ({
  reservation,
  onAction,
  actionButtonText
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="p-4 mb-4 bg-card text-card-foreground">

      <h2 className="text-xl font-semibold mb-3">
        {t("reservation.room")} #{reservation.roomId}
      </h2>
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-muted-foreground mr-2" />
        <div>
          <div className="text-sm text-muted-foreground">
            {t("confirmation.date")}:{" "}
            {new Date(reservation.startTime).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {t("confirmation.time")}:{" "}
            {new Date(reservation.endTime).toLocaleString()}
          </div>
        </div>
      </div>
      <ReservationCountdown reservation={reservation} />
      <Button
        variant="outline"
        className="w-full mt-4 border border-border"
        onClick={onAction}
      >
        {actionButtonText}
      </Button>
    </Card>
  );
};