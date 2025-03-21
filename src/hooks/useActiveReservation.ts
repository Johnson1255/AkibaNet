import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailedReservation } from "@/types/reservation";

export const useActiveReservation = () => {
  const navigate = useNavigate();
  const [activeReservation, setActiveReservation] = useState<DetailedReservation | null>(null);

  useEffect(() => {
    const savedReservation = localStorage.getItem("lastReservation");
    if (savedReservation) {
      setActiveReservation(JSON.parse(savedReservation));
    } else {
      navigate("/reserve");
    }
  }, [navigate]);

  const handleReservationAction = () => {
    if (activeReservation) {
      const now = new Date();
      const startTime = new Date(activeReservation.startTime);
      let updatedReservation;
      
      if (now < startTime) {
        updatedReservation = { ...activeReservation, status: "cancelled" };
      } else {
        updatedReservation = { ...activeReservation, status: "completed" };
      }
      
      localStorage.setItem("lastReservation", JSON.stringify(updatedReservation));
      localStorage.removeItem("lastReservation");
      navigate("/reserve");
    }
  };

  const getActionButtonText = (t: any) => {
    if (!activeReservation) return "";
    
    const now = new Date();
    const startTime = new Date(activeReservation.startTime);
    return now < startTime
      ? t("activeReservation.cancelReservation")
      : t("activeReservation.completeReservation");
  };

  return { activeReservation, handleReservationAction, getActionButtonText };
};