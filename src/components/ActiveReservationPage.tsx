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

  const cancelReservation = async () => {
    if (!activeReservation) return;
  
    try {
      // Crear la reserva con estado actualizado
      const updatedReservation = {
        ...activeReservation,
        status: 'cancelled',
        updatedAt: new Date().toISOString() // Actualizar timestamp
      };
      const token = localStorage.getItem('token');
      // Enviar la actualización a la base de datos
      const response = await fetch(`http://localhost:3000/api/bookings/${activeReservation.id}/cancel`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' }) // Enviar el estado actualizado
      });      
  
      if (!response.ok) {
        throw new Error('Error al actualizar la reserva en la base de datos');
      }
  
      // Guardar la reserva actualizada en localStorage
      localStorage.setItem('lastReservation', JSON.stringify(updatedReservation));
  
      // Ahora que ya se guardó en la DB, eliminarla de localStorage
      localStorage.removeItem('lastReservation');
      // Redirigir al usuario a la página de selección de habitación
      navigate('/reserve');
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      alert('Hubo un problema al cancelar la reserva. Inténtalo de nuevo.');
    }
  };
  

  if (!activeReservation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header */}
      <header className="p-4 bg-background border-b border-border">
        <h1 className="text-2xl font-medium text-center">Active Reservation</h1>
      </header>

      <div className="p-4">
        <Card className="p-4 mb-4 bg-card text-card-foreground">
          <div className="bg-yellow-100 p-3 rounded-lg mb-4 flex items-start">
            <Info className="h-5 w-5 text-yellow-700 mr-2 mt-0.5" />
            <p className="text-yellow-700 text-sm">
              You already have an active reservation. You cannot make a new reservation until the current one ends.
            </p>
          </div>
          
          <h2 className="text-xl font-semibold mb-3">Room #{activeReservation.roomId}</h2>
          
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
            <div>
              <div className="text-sm text-muted-foreground">
                Start: {new Date(activeReservation.startTime).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                End: {new Date(activeReservation.endTime).toLocaleString()}
              </div>
            </div>
          </div>
          
          <ReservationCountdown reservation={activeReservation} />
          
          <Button
            variant="outline"
            className="w-full mt-4 border border-border"
            onClick={cancelReservation}
          >
            Cancel Reservation
          </Button>
        </Card>
        
        <Button 
          className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
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