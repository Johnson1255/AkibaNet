import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmedReservationDetails } from "@/types/reservation";

interface ReservationDetailsProps {
  reservation: ConfirmedReservationDetails;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({ reservation }) => {
  const { t } = useTranslation();
  return (
    <Card className="m-4 p-4 bg-card text-card-foreground">
      <h3 className="text-xl font-semibold mb-4">{t('confirmation.details')}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('confirmation.room')}:</span>
          <span className="font-medium">#{reservation.roomId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('confirmation.date')}:</span>
          <span className="font-medium">{reservation.selectedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('confirmation.time')}:</span>
          <span className="font-medium">{reservation.selectedTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('confirmation.duration')}:</span>
          <span className="font-medium">{reservation.hours} {t('confirmation.hours')}</span>
        </div>
        {reservation?.id && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('confirmation.bookingId')}:</span>
            <span className="font-medium">{reservation.id}</span>
          </div>
        )}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('confirmation.room')} ({reservation.hours} {t('confirmation.hours')})</span>
          <span>¥{reservation.basePrice}</span>
        </div>
      </div>
    </Card>
  );
};