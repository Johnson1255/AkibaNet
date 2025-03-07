import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '../models/reservation';

interface ReservationManagerProps {
  children: React.ReactNode;
}

const ReservationManager: React.FC<ReservationManagerProps> = ({ children }) => {
  const navigate = useNavigate();
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);
  
  useEffect(() => {2
    // Comprobar si hay una reserva activa en localStorage
    const checkActiveReservation = () => {
      const savedReservation = localStorage.getItem('lastReservation');
      
      if (savedReservation) {
        const reservation = JSON.parse(savedReservation) as Reservation;
        const now = new Date();
        const endTime = new Date(reservation.endTime);
        
        // Si la reserva aún no ha terminado, mantenerla activa
        if (now < endTime && reservation.status !== 'cancelled') {
          setActiveReservation(reservation);
          
          // Si estamos en la página de selección de sala, redirigir al usuario
          const currentPath = window.location.pathname;
          if (currentPath === '/reserve' || currentPath === '/reserve') {
            navigate('/active-reservation');
          }
        } else {
          // La reserva ha terminado, eliminarla
          localStorage.removeItem('lastReservation');
          setActiveReservation(null);
        }
      }
    };
    
    // Comprobar al inicio
    checkActiveReservation();
    
    // Configurar un intervalo para comprobar periódicamente
    const intervalId = setInterval(checkActiveReservation, 30000); // Comprobar cada 30 segundos
    
    return () => clearInterval(intervalId);
  }, [navigate]);
  
  return <>{children}</>;
};

export default ReservationManager;