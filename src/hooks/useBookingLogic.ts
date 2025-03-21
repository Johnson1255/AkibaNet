import { useState } from "react";
import { useReservation } from "@/context/ReservationContext";
import { Room } from "@/types/roomDetails";
import { calculatePrice } from "@/utils/dateTimeUtils";

export const useBookingLogic = (room: Room | null) => {
  const [sliderValue, setSliderValue] = useState<number[]>([1]);
  const { updateRoomDetails } = useReservation();
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    if (room) {
      const hours = value[0];
      const price = calculatePrice(hours, room.hourlyRate);
      updateRoomDetails({ hours, price });
    }
  };
  const hours = room ? sliderValue[0] : 0;
  const price = room ? calculatePrice(hours, room.hourlyRate) : 0;
  
  return {
    sliderValue,
    handleSliderChange,
    hours,
    price,
  };
};
