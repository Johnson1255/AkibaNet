import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../models/reservation';
import { getReservationTimeInfo, ReservationTimeStatus } from '../utils/reservationTimer';

interface ReservationStatusProps {
  reservation: Reservation | null;
}

const ReservationStatus: React.FC<ReservationStatusProps> = ({ reservation }) => {
  const [timeInfo, setTimeInfo] = useState(() => 
    reservation ? getReservationTimeInfo(reservation) : null
  );

  useEffect(() => {
    if (!reservation) return;

    // Actualizar cada segundo
    const interval = setInterval(() => {
      setTimeInfo(getReservationTimeInfo(reservation));
    }, 1000);

    return () => clearInterval(interval);
  }, [reservation]);

  if (!reservation || !timeInfo) {
    return (
      <div className="p-5 rounded-lg shadow-md mx-auto my-5 max-w-md text-center bg-gray-50 border border-gray-200">
        <p className="text-lg mb-4">No tienes ninguna reserva pendiente</p>
        <Link to="/room-select" className="inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
          Reservar una sala
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-lg shadow-md mx-auto my-5 max-w-md text-center">
      {timeInfo.status === ReservationTimeStatus.NOT_STARTED && (
        <div className="bg-amber-50 border border-amber-100 p-5 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Tu reserva inicia en:</h3>
          <div className="text-4xl font-bold my-5 text-gray-800">{timeInfo.formattedTimeRemaining}</div>
          <p>Para la sala: {reservation.roomId}</p>
        </div>
      )}

      {timeInfo.status === ReservationTimeStatus.IN_PROGRESS && (
        <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
          <h3 className="text-xl font-medium mb-2">Tu reserva termina en:</h3>
          <div className="text-4xl font-bold my-5 text-gray-800">{timeInfo.formattedTimeRemaining}</div>
          <p>Sala actual: {reservation.roomId}</p>
        </div>
      )}

      {timeInfo.status === ReservationTimeStatus.COMPLETED && (
        <div className="bg-gray-50 border border-gray-200 p-7 rounded-lg">
          <p className="text-lg mb-4">Tu reserva ha finalizado</p>
          <Link to="/room-select" className="inline-block px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors">
            Hacer una nueva reserva
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReservationStatus;
