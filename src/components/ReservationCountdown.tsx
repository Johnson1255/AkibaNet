import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

interface Reservation {
  id: string;
  startTime: string; // formato ISO
  endTime: string;   // formato ISO
  roomId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

interface ReservationCountdownProps {
  reservation?: Reservation;
}

const ReservationCountdown: React.FC<ReservationCountdownProps> = ({ reservation }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'active' | 'completed' | 'cancelled' | null>(
      reservation ? reservation.status : null
  );

  useEffect(() => {
    if (!reservation) return;
    
    setStatus(reservation.status);
    
    // Configurar el temporizador para cambiar automáticamente de pendiente a activo
    if (reservation.status === 'pending') {
      const startTime = new Date(reservation.startTime);
      const now = new Date();
      const timeUntilStart = startTime.getTime() - now.getTime();
      
      if (timeUntilStart > 0) {
        const timer = setTimeout(() => {
          setStatus('active');
        }, timeUntilStart);
        return () => clearTimeout(timer);
      } else {
        setStatus('active');
      }
    }
    
    // Configurar el temporizador para cambiar automáticamente de activo a completado
    if (reservation.status === 'active' || status === 'active') {
      const endTime = new Date(reservation.endTime);
      const now = new Date();
      const timeUntilEnd = endTime.getTime() - now.getTime();
      
      if (timeUntilEnd > 0) {
        const timer = setTimeout(() => {
          setStatus('completed');
        }, timeUntilEnd);
        return () => clearTimeout(timer);
      } else {
        setStatus('completed');
      }
    }
  }, [reservation, status]);

  if (!reservation || status === 'cancelled') {
    return (
      <div className="rounded-xl bg-white border p-6 shadow-sm text-center">
        <h2 className="text-2xl font-medium mb-3">No tienes ninguna reserva</h2>
        <p className="text-gray-600 mb-5">Haz una nueva reserva para comenzar</p>
        <button
          onClick={() => navigate('/reserve')}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Reservar una sala
        </button>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="rounded-xl bg-white border p-6 shadow-sm text-center">
        <h2 className="text-2xl font-medium mb-3">Tu reserva ha finalizado</h2>
        <p className="text-gray-600 mb-5">Gracias por usar nuestro servicio</p>
        <button
          onClick={() => navigate('/reserve')}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Hacer una nueva reserva
        </button>
      </div>
    );
  }

  return (
    <>
      {status === 'pending' && (
        <CountdownTimer
          targetDate={new Date(reservation.startTime)}
          type="start"
          roomId={reservation.roomId}
          onComplete={() => setStatus('active')}
        />
      )}
      
      {status === 'active' && (
        <CountdownTimer
          targetDate={new Date(reservation.endTime)}
          type="end"
          roomId={reservation.roomId}
          onComplete={() => setStatus('completed')}
        />
      )}
    </>
  );
};

export default ReservationCountdown;
