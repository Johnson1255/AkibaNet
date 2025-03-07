import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ReservationCountdown from './ReservationCountdown';
import BottomNavBar from './Bottom-navbar';
import { Clock, Info } from 'lucide-react';

interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  roomId: string;
  userId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

const ActiveReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeReservation, setActiveReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const savedReservation = localStorage.getItem('lastReservation');
    if (savedReservation) {
      setActiveReservation(JSON.parse(savedReservation));
    } else {
      navigate('/reserve');
    }
  }, [navigate]);

  const cancelReservation = () => {
    if (activeReservation) {
      // Actualizar el estado de la reserva a cancelado
      const updatedReservation = {
        ...activeReservation,
        status: 'cancelled'
      };
      
      // Guardar la reserva actualizada
      localStorage.setItem('activeReservation', JSON.stringify(updatedReservation));
      
      // Redirigir al usuario a la página de selección de habitación
      navigate('/reserve');
    }
  };

  if (!activeReservation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="p-4 bg-white border-b">
        <h1 className="text-2xl font-medium text-center">Active Reservation</h1>
      </header>

      <div className="p-4">
        <Card className="p-4 mb-4">
          <div className="bg-yellow-100 p-3 rounded-lg mb-4 flex items-start">
            <Info className="h-5 w-5 text-yellow-700 mr-2 mt-0.5" />
            <p className="text-yellow-700 text-sm">
              You already have an active reservation. You cannot make a new reservation until the current one ends.
            </p>
          </div>
          
          <h2 className="text-xl font-semibold mb-3">Room #{activeReservation.roomId}</h2>
          
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="text-sm text-gray-600">
                Start: {new Date(activeReservation.startTime).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                End: {new Date(activeReservation.endTime).toLocaleString()}
              </div>
            </div>
          </div>
          
          <ReservationCountdown reservation={activeReservation} />
          
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={cancelReservation}
          >
            Cancel Reservation
          </Button>
        </Card>
        
        <Button 
          className="w-full rounded-full h-12 bg-black text-white hover:bg-black/90"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default ActiveReservationPage;