// src/components/Confirmation/useLoadReservation.ts
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmedReservationDetails } from "@/types/reservation";

export const useLoadReservation = () => {
  const { i18n } = useTranslation();
  const [savedReservation, setSavedReservation] =
    useState<ConfirmedReservationDetails | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("lastReservation");
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      if (parsedData.startTime) {
        const startDate = new Date(parsedData.startTime);
        parsedData.selectedDate = startDate.toLocaleDateString();
        parsedData.selectedTime = startDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }

      setSavedReservation(parsedData);

      if (parsedData.startTime && parsedData.endTime) {
        const activeReservation = {
          ...parsedData,
          id: parsedData.id || `res-${Date.now()}`,
          userId: "current-user",
          status: "active",
        };

        localStorage.setItem(
          "lastReservation",
          JSON.stringify(activeReservation)
        );
      }
    } else {
      console.error("No reservation data found in local storage");
    }
  }, [i18n.language]);

  return savedReservation;
};
