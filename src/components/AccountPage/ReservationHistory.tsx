import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Reservation } from "@/types/reservation";

interface ReservationHistoryProps {
  reservations: Reservation[];
  onViewAll: () => void;
}

export const ReservationHistory: React.FC<ReservationHistoryProps> = ({ 
  reservations, 
  onViewAll 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold mb-4">{t('reservation.history')}</h2>
      <div className="space-y-3">
        {reservations.map((reservation, index) => (
          <div key={index} className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">{reservation.roomName}</h3>
              <p className="text-gray-500">{reservation.date} | {reservation.hours} {t('reservation.hours')}</p>
            </div>
            <span className="text-lg">¥ {reservation.price}</span>
          </div>
        ))}
      </div>
      <Button variant="ghost" className="w-full mt-2 text-gray-500" onClick={onViewAll}>
        {t('reservation.viewAll')} <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
