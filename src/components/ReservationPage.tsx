import React, { useState, useEffect } from "react";
import ReservationStatus from "./ReservationStatus";
import { DetailedReservation } from "@/types/reservation";

const ReservationPage: React.FC = () => {
  // En un caso real, obtendrías la reserva desde un API
  // Ejemplo de una reserva
  const sampleReservation: DetailedReservation = {
    id: "1",
    roomId: "A1",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    status: "active",
    userId: "1",
  };
  const [reservation, setReservation] = useState<DetailedReservation | null>(
    sampleReservation
  );

  // Ejemplo: simular finalización de reserva después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setReservation(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Estado de tu Reserva
      </h1>
      <ReservationStatus reservation={reservation} />
    </div>
  );
};

export default ReservationPage;
