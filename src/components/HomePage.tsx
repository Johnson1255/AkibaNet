import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from '../context/ReservationContext';
import BottomNavBar from './Bottom-navbar';
import ReservationStatusCard from './ReservationStatusCard';

interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { checkExistingReservation } = useReservation();
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    // Verificar si hay un usuario logueado
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }

    // Cargar la reservación existente si hay alguna
    const savedReservation = localStorage.getItem('lastReservation');
    if (savedReservation) {
      try {
        const parsedReservation = JSON.parse(savedReservation);
        // Solo mostrar si está activa o pendiente
        if (parsedReservation.status === 'active' || parsedReservation.status === 'pending') {
          setCurrentReservation(parsedReservation);
        }
      } catch (error) {
        console.error('Error al analizar la reservación guardada:', error);
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="p-4 bg-white border-b">
        <h1 className="text-2xl font-medium text-center">Home</h1>
      </header>

      <div className="p-4">
        {currentReservation ? (
          <ReservationStatusCard reservation={currentReservation} />
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-4 text-center">
            <h2 className="text-xl font-semibold mb-3">No tienes reservaciones activas</h2>
            <p className="text-gray-600 mb-4">¡Haz una reserva para disfrutar de nuestras instalaciones!</p>
            <button
              onClick={() => navigate('/reserve')}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium"
            >
              Reservar ahora
            </button>
          </div>
        )}

        {/* Resto del contenido de la página de inicio */}
      </div>

      <BottomNavBar />
    </div>
  );
};

export default HomePage;
