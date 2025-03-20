// src/components/AdditionalServicesPage/RoomSummary.tsx
import { useTranslation } from "react-i18next";

interface RoomSummaryProps {
  reservation: any;
  roomId: string;
  baseRoomPrice: number;
}

export const RoomSummary: React.FC<RoomSummaryProps> = ({ reservation, roomId, baseRoomPrice }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 bg-muted/30">
      <h2 className="text-lg font-medium">{t('reservation.room')} #{roomId}</h2>
      <div className="text-sm text-muted-foreground">
        <p>{reservation.selectedDate} - {reservation.selectedTime}</p>
        <p>{reservation.hours} {reservation.hours === 1 ? t('reservation.hour') : t('reservation.hours')} - ¥{baseRoomPrice}</p>
      </div>
    </div>
  );
};