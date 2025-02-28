import React, { useState, useEffect } from 'react';
import ReservationStatus from './ReservationStatus';
import { Reservation, sampleReservation } from '../models/reservation';

const ReservationPage: React.FC = () => {
  // En un caso real, obtendrías la reserva desde un API
  const [reservation, setReservation] = useState<Reservation | null>(sampleReservation);

  // Ejemplo: simular finalización de reserva después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setReservation(null);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Estado de tu Reserva</h1>
      <ReservationStatus reservation={reservation} />
    </div>
  );
};

export default ReservationPage;
