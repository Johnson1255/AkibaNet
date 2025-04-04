import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Clock, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { handleDirectConfirm } from "@/utils/handleConfirmReservation";
import { Room } from "@/types/room";

interface BookingSectionProps {
  room: Room;
  price: number;
  hours: number;
  sliderValue: number[];
  reservation: {
    selectedTime?: string;
    selectedDate?: string;
  };
  onSliderChange: (value: number[]) => void;
  onUpdateRoomDetails: (details: any) => void;
  getHourText: (num: number) => string;
}

export function BookingSection({
  room,
  price,
  hours,
  sliderValue,
  reservation,
  onSliderChange,
  onUpdateRoomDetails,
  getHourText,
}: BookingSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="px-4 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-full bg-secondary hover:bg-secondary/80"
            onClick={() => {
              onUpdateRoomDetails({ selectedTime: reservation.selectedTime });
            }}
          >
            <span>
              {reservation.selectedTime ||
                t("reservation.selectTime", "Select time")}
            </span>
          </Button>
        </div>

        <Clock className="w-8 h-8" />

        <div className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-full bg-secondary hover:bg-secondary/80"
            onClick={() => {
              onUpdateRoomDetails({ selectedDate: reservation.selectedDate });
            }}
          >
            <span>
              {reservation.selectedDate || t("reservation.today", "Today")}
            </span>
          </Button>
        </div>
      </div>

      <div>
        <div className="text-right mb-2">¥{price.toFixed(2)}</div>
        <Slider
          defaultValue={sliderValue}
          value={sliderValue}
          min={room.minHours}
          max={room.maxHours}
          step={1}
          className="mb-2"
          onValueChange={onSliderChange}
        />
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>
            {room.minHours} {getHourText(room.minHours)}{" "}
            {t("reservation.minimum", "mínimo")}
          </span>
          <span>
            {room.maxHours} {getHourText(room.maxHours)}{" "}
            {t("reservation.maximum", "máximo")}
          </span>
        </div>
        <div className="text-sm text-muted-foreground text-center mt-2">
          ¥{price.toFixed(2)} {t("reservation.for", "por")} {hours}{" "}
          {getHourText(hours)}.
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          variant="outline"
          className="w-full rounded-full h-12 bg-secondary hover:bg-secondary/80"
          onClick={() => {
            if (!room._id || !room.id) { // Verifica que ambos existan
               console.error("Missing room _id or display id", room);
               alert("Error al obtener identificadores de la habitación.");
               return;
            }
            onUpdateRoomDetails({
              roomId: room._id,
              roomDisplayId: room.id, 
              hours,                    
              price,                
              hourlyRate: room.hourlyRate,
              minHours: room.minHours,
              maxHours: room.maxHours,
              selectedDate: reservation.selectedDate,
              selectedTime: reservation.selectedTime,
            });
            navigate("/additional-services");
          }}
        >
          {t("reservation.addServices", "Add services")}
          <Plus className="ml-2 h-5 w-5" />
        </Button>

        <Button
          variant="default"
          className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            if (!room || !room._id) { // Añade una verificación para room también
                console.error("Error: Objeto room o MongoDB _id no encontrado:", room);
                alert(t("reservation.errors.missingRoomId", "Error: No se pudo obtener el identificador único de la habitación."));
                return;
            }

            handleDirectConfirm({
                reservation,
                roomId: room._id, // <-- USA EL _id DE MONGODB
                roomDisplayId: room.id, // <-- El ID legible (ej: "108")
                hours,
                price,
                navigate,
                updateRoomDetails: onUpdateRoomDetails,
                t,
            });
            // --- FIN DE LA MODIFICACIÓN ---
        }}
        >
          {t("reservation.confirmAndPay", "Confirm and Pay")}
        </Button>
      </div>
    </div>
  );
}
