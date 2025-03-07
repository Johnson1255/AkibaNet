import CountdownTimer from './CountdownTimer';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const ReservationCountdown: React.FC<ReservationCountdownProps> = ({ reservation }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'active' | 'completed' | 'cancelled' | null>(
    reservation ? reservation.status : null
  );
  const [timers, setTimers] = useState<NodeJS.Timeout[]>([]);

  // Limpiar los timers cuando el componente se desmonte
  useEffect(() => {
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [timers]);

  useEffect(() => {
    if (!reservation) return;

    const updateReservationStatus = (newStatus: typeof status) => {
      if (newStatus === status) return; // Evitar actualizaciones innecesarias
      
      setStatus(newStatus);
      if (newStatus) {
        const updatedReservation = { ...reservation, status: newStatus };
        localStorage.setItem('lastReservation', JSON.stringify(updatedReservation));
      }
    };

    const now = new Date().getTime();
    const startTime = new Date(reservation.startTime).getTime();
    const endTime = new Date(reservation.endTime).getTime();

    // Limpiar timers existentes
    timers.forEach(timer => clearTimeout(timer));
    const newTimers: NodeJS.Timeout[] = [];

    if (now < startTime) {
      // La reserva aún no comienza
      updateReservationStatus('pending');
      const timer = setTimeout(() => {
        updateReservationStatus('active');
      }, startTime - now);
      newTimers.push(timer);
    } else if (now >= startTime && now < endTime) {
      // La reserva está activa
      updateReservationStatus('active');
      const timer = setTimeout(() => {
        updateReservationStatus('completed');
      }, endTime - now);
      newTimers.push(timer);
    } else {
      // La reserva ya terminó
      updateReservationStatus('completed');
    }

    setTimers(newTimers);
  }, [reservation?.id]); // Solo depende del ID de la reserva

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
          formatDate={formatDate}
          onComplete={() => {
            setStatus('active');
            // Actualizar en localStorage con el nuevo estado
            const updatedReservation = { ...reservation, status: 'active' };
            localStorage.setItem('lastReservation', JSON.stringify(updatedReservation));
          }}
        />
      )}
      
      {status === 'active' && (
        <CountdownTimer
          targetDate={new Date(reservation.endTime)}
          type="end"
          roomId={reservation.roomId}
          formatDate={formatDate}
          onComplete={() => {
            setStatus('completed');
            // Actualizar en localStorage con el nuevo estado
            const updatedReservation = { ...reservation, status: 'completed' };
            localStorage.setItem('lastReservation', JSON.stringify(updatedReservation));
          }}
        />
      )}
    </>
  );
};

export default ReservationCountdown;
